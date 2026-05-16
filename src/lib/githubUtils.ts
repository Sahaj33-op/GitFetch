import { GitHubRepo } from './github';

/**
 * Aggregates language usage across a list of repositories.
 * Returns a sorted list of languages and their counts.
 */
export function calculateLanguageStats(repos: GitHubRepo[]) {
  const languages: Record<string, number> = {};
  
  repos.forEach(repo => {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  });

  return Object.entries(languages)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Filters and sorts repositories based on search query and sort criteria.
 */
export function filterAndSortRepos(
  repos: GitHubRepo[],
  searchQuery: string,
  sortBy: 'stars' | 'updated',
  repoType: 'all' | 'personal' | 'org',
  username: string,
  language: string = 'all'
) {
  let result = repos.filter(repo => !repo.fork);

  if (repoType === 'personal') {
    result = result.filter(repo => !repo.owner || repo.owner.login.toLowerCase() === username.toLowerCase());
  } else if (repoType === 'org') {
    result = result.filter(repo => repo.owner && repo.owner.login.toLowerCase() !== username.toLowerCase());
  }

  if (language && language !== 'all') {
    result = result.filter(repo => repo.language === language);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      repo => 
        repo.name.toLowerCase().includes(query) || 
        (repo.description && repo.description.toLowerCase().includes(query)) ||
        repo.topics.some(topic => topic.toLowerCase().includes(query))
    );
  }

  result.sort((a, b) => {
    if (sortBy === 'stars') {
      return b.stargazers_count - a.stargazers_count;
    } else {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  return result;
}

/**
 * Calculates summary statistics for a list of repositories.
 */
export function calculateRepoStats(repos: GitHubRepo[]) {
  const sourceRepos = repos.filter(r => !r.fork);
  const totalStars = sourceRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const totalForks = sourceRepos.reduce((acc, repo) => acc + repo.forks_count, 0);
  const mostPopular = [...sourceRepos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  
  return {
    totalStars,
    totalForks,
    repoCount: sourceRepos.length,
    mostPopular
  };
}
