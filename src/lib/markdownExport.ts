import { GitHubUser, GitHubRepo, GitHubOrg, GitHubSocialAccount, GitHubEvent } from './github';
import { calculateLanguageStats } from './githubUtils';
import { formatDistanceToNow } from 'date-fns';

export interface MarkdownExportOptions {
  includeReadme: boolean;
  includeStats: boolean;
  includeOrgs: boolean;
  includeRepos: boolean;
  excludeForks: boolean;
  includeLanguages: boolean;
  includeActivity: boolean;
  includePrivateRepos: boolean;
  includeRepoReadmes: boolean;
}

export function generateMarkdown(
  user: GitHubUser, 
  repos: GitHubRepo[], 
  readme: string | null,
  orgs: GitHubOrg[],
  socials: GitHubSocialAccount[],
  events: GitHubEvent[],
  options: MarkdownExportOptions = {
    includeReadme: true,
    includeStats: true,
    includeOrgs: true,
    includeRepos: true,
    excludeForks: true,
    includeLanguages: true,
    includeActivity: true,
    includePrivateRepos: false,
    includeRepoReadmes: false,
  },
  repoReadmes?: Record<string, string | null>
): string {
  let md = `# ${user.name || user.login} (@${user.login})\n\n`;

  if (user.bio) {
    md += `> ${user.bio}\n\n`;
  }

  let sourceRepos = options.excludeForks ? repos.filter(r => !r.fork) : repos;
  if (!options.includePrivateRepos) {
    sourceRepos = sourceRepos.filter(r => !r.private);
  }
  const totalStars = sourceRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = sourceRepos.reduce((acc, repo) => acc + repo.forks_count, 0);

  if (options.includeStats) {
    md += `## 📊 GitHub Stats\n`;
    md += `- **Followers:** ${user.followers.toLocaleString()}\n`;
    md += `- **Following:** ${user.following.toLocaleString()}\n`;
    md += `- **Public Repos:** ${user.public_repos.toLocaleString()}\n`;
    md += `- **Total Stars:** 🌟 ${totalStars.toLocaleString()}\n`;
    md += `- **Total Forks:** 🍴 ${totalForks.toLocaleString()}\n`;
    if (user.company) md += `- **Company:** ${user.company}\n`;
    if (user.location) md += `- **Location:** ${user.location}\n`;
    md += `\n`;
  }

  if (options.includeLanguages) {
    const langStats = calculateLanguageStats(sourceRepos);
    if (langStats.length > 0) {
      md += `## 💻 Primary Languages (by Repo Count)\n`;
      langStats.slice(0, 10).forEach(lang => {
        md += `- **${lang.name}:** ${lang.value} repos\n`;
      });
      md += `\n`;
    }
  }

  if (options.includeOrgs && orgs.length > 0) {
    md += `## 🏢 Organizations\n`;
    md += orgs.map(org => `- [${org.login}](https://github.com/${org.login})`).join('\n');
    md += `\n\n`;
  }

  md += `## 🔗 Links\n`;
  md += `- **GitHub:** [${user.html_url}](${user.html_url})\n`;
  if (user.blog) {
    const blogUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
    md += `- **Website/Blog:** [${user.blog}](${blogUrl})\n`;
  }
  if (user.twitter_username) {
    md += `- **Twitter:** [@${user.twitter_username}](https://twitter.com/${user.twitter_username})\n`;
  }
  socials.forEach(social => {
    md += `- **${social.provider}:** [${social.url}](${social.url})\n`;
  });
  md += `\n`;

  if (options.includeReadme && readme) {
    md += `## 📖 Profile README\n\n`;
    md += `${readme}\n\n`;
  }

  if (options.includeActivity && events && events.length > 0) {
    const filteredEvents = events.filter(e => 
      ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'WatchEvent', 'CreateEvent'].includes(e.type)
    ).slice(0, 10);
    
    if (filteredEvents.length > 0) {
      md += `## 📈 Recent Activity\n`;
      filteredEvents.forEach(event => {
        const timeAgo = formatDistanceToNow(new Date(event.created_at));
        switch (event.type) {
          case 'PushEvent': {
            const commits = event.payload.commits?.length || 0;
            md += `- Pushed ${commits} commit${commits !== 1 ? 's' : ''} to [${event.repo.name}](https://github.com/${event.repo.name}) (${timeAgo} ago)\n`;
            break;
          }
          case 'PullRequestEvent': {
            md += `- ${event.payload.action === 'opened' ? 'Opened' : 'Closed'} a pull request in [${event.repo.name}](https://github.com/${event.repo.name}) (${timeAgo} ago)\n`;
            break;
          }
          case 'IssuesEvent': {
            md += `- ${event.payload.action === 'opened' ? 'Opened' : 'Closed'} an issue in [${event.repo.name}](https://github.com/${event.repo.name}) (${timeAgo} ago)\n`;
            break;
          }
          case 'WatchEvent': {
            md += `- Starred [${event.repo.name}](https://github.com/${event.repo.name}) (${timeAgo} ago)\n`;
            break;
          }
          case 'CreateEvent': {
            md += `- Created a new ${event.payload.ref_type} in [${event.repo.name}](https://github.com/${event.repo.name}) (${timeAgo} ago)\n`;
            break;
          }
        }
      });
      md += `\n`;
    }
  }

  if (options.includeRepos) {
    md += `## 💻 Public Repositories\n\n`;
    
    const sortedRepos = [...sourceRepos].sort((a, b) => b.stargazers_count - a.stargazers_count);

    if (sortedRepos.length === 0) {
      md += `*No public repositories found.*\n`;
    } else {
      sortedRepos.forEach(repo => {
        md += `### [${repo.name}](${repo.html_url})\n`;
        if (repo.description) {
          md += `${repo.description}\n\n`;
        }
        md += `- **Stars:** 🌟 ${repo.stargazers_count.toLocaleString()} | **Forks:** 🍴 ${repo.forks_count.toLocaleString()}`;
        if (repo.language) {
          md += ` | **Language:** ${repo.language}`;
        }
        if (repo.created_at) {
          md += ` | **Started:** ${new Date(repo.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`;
        }
        md += `\n`;
        
        if (repo.topics && repo.topics.length > 0) {
          md += `- **Topics:** ${repo.topics.map(t => '\`' + t + '\`').join(', ')}\n`;
        }
        
        if (options.includeRepoReadmes && repoReadmes && repoReadmes[repo.name]) {
          md += `\n<details>\n<summary>View Repository README</summary>\n\n${repoReadmes[repo.name]}\n\n</details>\n`;
        }
        
        md += `\n`;
      });
    }
  }

  return md;
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateAIPortfolioMarkdown(
  user: GitHubUser,
  repos: GitHubRepo[],
  readme: string | null,
  orgs: GitHubOrg[],
  socials: GitHubSocialAccount[],
  events: GitHubEvent[],
  includePrivate: boolean = false
): string {
  let sourceRepos = repos;
  if (!includePrivate) {
    sourceRepos = sourceRepos.filter(r => !r.private);
  }

  const originalRepos = sourceRepos.filter(r => !r.fork);
  const forkedRepos = sourceRepos.filter(r => r.fork);

  const topRepos = [...originalRepos]
    .sort((a, b) => {
      const scoreA =
        a.stargazers_count * 3 +
        a.forks_count * 2 +
        (a.homepage ? 5 : 0) +
        (a.description ? 3 : 0) +
        ((a.topics?.length || 0) * 1);

      const scoreB =
        b.stargazers_count * 3 +
        b.forks_count * 2 +
        (b.homepage ? 5 : 0) +
        (b.description ? 3 : 0) +
        ((b.topics?.length || 0) * 1);

      return scoreB - scoreA;
    })
    .slice(0, 10);

  let md = `# AI Portfolio Context for ${user.name || user.login}

## Basic Profile
- **Name:** ${user.name || user.login}
- **GitHub Username:** ${user.login}
- **GitHub URL:** ${user.html_url}
- **Bio:** ${user.bio || 'Not provided'}
- **Location:** ${user.location || 'Not provided'}
- **Website:** ${user.blog || 'Not provided'}
- **Followers:** ${user.followers}
- **Public Repositories:** ${user.public_repos}

## Social Links
`;
  if (socials && socials.length > 0) {
    socials.forEach(social => {
      md += `- **${social.provider}:** ${social.url}\n`;
    });
  } else {
    md += `No additional social links provided.\n`;
  }
  md += `\n`;

  md += `## Organizations
`;
  if (orgs && orgs.length > 0) {
    md += orgs.map(org => `- ${org.login} (https://github.com/${org.login})`).join('\n') + `\n\n`;
  } else {
    md += `Not a member of any public organizations.\n\n`;
  }

  if (readme) {
    md += `## Profile README Highlight
The user has a profile README. Here is the raw content for context:
\`\`\`markdown
${readme.substring(0, 500)}${readme.length > 500 ? '...\n(README truncated)' : ''}
\`\`\`\n\n`;
  }

  md += `## Portfolio-Ready Projects\n`;

  if (topRepos.length === 0) {
    md += `No original public repositories found.\n\n`;
  } else {
    topRepos.forEach(repo => {
      const signals: string[] = [];

      if (repo.description) signals.push('has a clear description');
      if (repo.homepage) signals.push('has a live/demo link');
      if (repo.stargazers_count >= 10) signals.push(`${repo.stargazers_count} stars`);
      if (repo.forks_count >= 3) signals.push(`${repo.forks_count} forks`);
      if (repo.topics?.length) signals.push(`topics: ${repo.topics.slice(0, 6).join(', ')}`);
      if (!repo.archived) signals.push('not archived');

      md += `### ${repo.name}
- **GitHub URL:** ${repo.html_url}
${repo.homepage ? `- **Live Demo:** ${repo.homepage}\n` : ''}- **Description:** ${repo.description || 'No description provided'}
- **Primary Language:** ${repo.language || 'Unknown'}
- **Stars:** ${repo.stargazers_count}
- **Forks:** ${repo.forks_count}
- **Created:** ${new Date(repo.created_at).toLocaleDateString()}
- **Last Updated:** ${new Date(repo.updated_at).toLocaleDateString()}
- **Topics:** ${repo.topics?.length ? repo.topics.join(', ') : 'None'}
- **Portfolio Signal:** ${signals.length ? signals.join('; ') : 'Needs stronger description, topics, or demo link before highlighting'}

`;
    });
  }

  const langStats = calculateLanguageStats(originalRepos);
  const languages = langStats.slice(0, 8).map(l => `${l.name} (${l.value} repos)`).join(', ');

  const repoText = sourceRepos
    .map(r => `${r.name} ${r.description || ''} ${(r.topics || []).join(' ')}`)
    .join(' ')
    .toLowerCase();

  const frameworkKeywords = [
    'react', 'nextjs', 'next.js', 'vue', 'angular',
    'node', 'express', 'fastapi', 'django', 'flask',
    'tailwind', 'tailwindcss', 'docker', 'supabase',
    'mongodb', 'postgresql', 'sqlite', 'redis',
    'typescript', 'python'
  ];

  const inferredFrameworks = frameworkKeywords.filter(k => repoText.includes(k));

  md += `## Skill Signals
- **Primary languages by repo count:** ${languages || 'Not enough data'}
- **Frameworks/tools inferred from repo names, topics, and descriptions:** ${inferredFrameworks.length ? [...new Set(inferredFrameworks)].join(', ') : 'None confidently inferred'}
- **Repository footprint:** ${originalRepos.length} original repositories and ${forkedRepos.length} forks visible from fetched data.
- **Note:** This export is based on public GitHub metadata. Do not invent experience, jobs, metrics, or private work not shown here.

## Instructions for AI Portfolio/Resume Generation
Use this context to create:
- homepage hero section
- about section
- skills section
- project cards
- resume project bullets
- LinkedIn featured project descriptions
- SEO title and meta description

Prioritize projects with clear descriptions, recent updates, live demos, topics, stars, forks, and strong technical relevance.
Do not exaggerate impact. If impact is unclear, phrase it as functionality rather than business results.
`;

  return md;
}
