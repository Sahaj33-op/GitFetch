import { GitHubUser, GitHubRepo, GitHubOrg, GitHubSocialAccount } from './github';

export function generateMarkdown(
  user: GitHubUser, 
  repos: GitHubRepo[], 
  readme: string | null,
  orgs: GitHubOrg[],
  socials: GitHubSocialAccount[]
): string {
  let md = `# ${user.name || user.login} (@${user.login})\n\n`;

  if (user.bio) {
    md += `> ${user.bio}\n\n`;
  }

  const sourceRepos = repos.filter(r => !r.fork);
  const totalStars = sourceRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = sourceRepos.reduce((acc, repo) => acc + repo.forks_count, 0);

  md += `## 📊 GitHub Stats\n`;
  md += `- **Followers:** ${user.followers.toLocaleString()}\n`;
  md += `- **Following:** ${user.following.toLocaleString()}\n`;
  md += `- **Public Repos:** ${user.public_repos.toLocaleString()}\n`;
  md += `- **Total Stars:** 🌟 ${totalStars.toLocaleString()}\n`;
  md += `- **Total Forks:** 🍴 ${totalForks.toLocaleString()}\n`;
  if (user.company) md += `- **Company:** ${user.company}\n`;
  if (user.location) md += `- **Location:** ${user.location}\n`;
  md += `\n`;

  if (orgs.length > 0) {
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

  if (readme) {
    md += `## 📖 Profile README\n\n`;
    md += `${readme}\n\n`;
  }

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
      md += `\n`;
      
      if (repo.topics && repo.topics.length > 0) {
        md += `- **Topics:** ${repo.topics.map(t => `\`${t}\``).join(', ')}\n`;
      }
      md += `\n`;
    });
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
