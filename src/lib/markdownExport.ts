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
  }
): string {
  let md = `# ${user.name || user.login} (@${user.login})\n\n`;

  if (user.bio) {
    md += `> ${user.bio}\n\n`;
  }

  const sourceRepos = options.excludeForks ? repos.filter(r => !r.fork) : repos;
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
