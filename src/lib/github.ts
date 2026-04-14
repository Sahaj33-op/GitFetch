export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubOrg {
  login: string;
  id: number;
  avatar_url: string;
  description: string | null;
}

export interface GitHubSocialAccount {
  provider: string;
  url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  updated_at: string;
  homepage: string | null;
  topics: string[];
}

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API_BASE}/users/${username}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) throw new Error('API rate limit exceeded. Please try again later.');
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  let allRepos: GitHubRepo[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 3) { // Limit to 3 pages (300 repos) to avoid hitting rate limits too hard
    const res = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&page=${page}&sort=pushed`);
    if (!res.ok) {
      if (res.status === 403) throw new Error('API rate limit exceeded.');
      throw new Error('Failed to fetch repositories');
    }
    const repos = await res.json();
    allRepos = [...allRepos, ...repos];
    
    if (repos.length < 100) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return allRepos;
}

export async function fetchUserReadme(username: string): Promise<string | null> {
  try {
    const res = await fetch(`${GITHUB_API_BASE}/repos/${username}/${username}/readme`, {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.text();
  } catch (error) {
    return null;
  }
}

export async function fetchOrgs(username: string): Promise<GitHubOrg[]> {
  const res = await fetch(`${GITHUB_API_BASE}/users/${username}/orgs`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSocialAccounts(username: string): Promise<GitHubSocialAccount[]> {
  const res = await fetch(`${GITHUB_API_BASE}/users/${username}/social_accounts`);
  if (!res.ok) return [];
  return res.json();
}
