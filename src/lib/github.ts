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
  private: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  archived: boolean;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  created_at: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function isAuthUser(username: string, token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(`${GITHUB_API_BASE}/user`, { 
      headers: getHeaders(token), 
      cache: 'no-store' 
    });
    if (res.ok) {
      const data = await res.json();
      return data.login.toLowerCase() === username.toLowerCase();
    }
  } catch (e) {
    // ignore
  }
  return false;
}

export async function fetchEvents(username: string, token?: string, isAuth?: boolean): Promise<GitHubEvent[]> {
  const endpoint = isAuth ? `/users/${username}/events` : `/users/${username}/events/public`;
  const res = await fetch(`${GITHUB_API_BASE}${endpoint}?per_page=30`, { 
    headers: getHeaders(token),
    cache: 'no-store' 
  });
  if (!res.ok) {
    return []; // Suppress errors for events to maintain rest of the profile
  }
  return res.json();
}

export async function fetchUser(username: string, token?: string, isAuth?: boolean): Promise<GitHubUser> {
  const endpoint = isAuth ? '/user' : `/users/${username}`;
  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, { 
    headers: getHeaders(token),
    cache: 'no-store' 
  });
  if (!res.ok) {
    if (res.status === 404) throw new Error('User not found');
    if (res.status === 403) {
      const resetTime = res.headers.get('x-ratelimit-reset');
      let resetMsg = '';
      if (resetTime) {
        const resetDate = new Date(parseInt(resetTime) * 1000);
        resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}`;
      }
      throw new Error(`API rate limit exceeded.${resetMsg} Please try again later or provide a PAT.`);
    }
    throw new Error('Failed to fetch user');
  }
  return res.json();
}

export async function fetchRepos(username: string, token?: string, isAuth?: boolean): Promise<{ repos: GitHubRepo[], capped: boolean }> {
  let allRepos: GitHubRepo[] = [];
  let page = 1;
  let hasMore = true;
  let capped = false;

  const endpoint = isAuth ? '/user/repos' : `/users/${username}/repos`;
  const extraParams = isAuth ? '&affiliation=owner,collaborator,organization_member' : '';

  while (hasMore && page <= 5) { // Limit to 5 pages (500 repos) to avoid hitting rate limits too hard
    const res = await fetch(`${GITHUB_API_BASE}${endpoint}?per_page=100&page=${page}&sort=pushed${extraParams}`, { 
      headers: getHeaders(token),
      cache: 'no-store' 
    });
    if (!res.ok) {
      if (res.status === 403) {
        const resetTime = res.headers.get('x-ratelimit-reset');
        let resetMsg = '';
        if (resetTime) {
           const resetDate = new Date(parseInt(resetTime) * 1000);
           resetMsg = ` Resets at ${resetDate.toLocaleTimeString()}`;
        }
        throw new Error(`API rate limit exceeded.${resetMsg}`);
      }
      throw new Error('Failed to fetch repositories');
    }
    const repos = await res.json();
    allRepos = [...allRepos, ...repos];
    
    if (repos.length < 100) {
      hasMore = false;
    } else {
      page++;
      if (page > 5) {
        capped = true;
      }
    }
  }

  return { repos: allRepos, capped };
}

export async function fetchUserReadme(username: string, token?: string): Promise<string | null> {
  try {
    const headers = getHeaders(token);
    headers.Accept = 'application/vnd.github.v3.raw';
    
    const res = await fetch(`${GITHUB_API_BASE}/repos/${username}/${username}/readme`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.text();
  } catch (error) {
    return null;
  }
}

export async function fetchRepoReadme(owner: string, repoName: string, token?: string): Promise<string | null> {
  try {
    const headers = getHeaders(token);
    headers.Accept = 'application/vnd.github.v3.raw';
    
    const res = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`, {
      headers,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    return await res.text();
  } catch (error) {
    return null;
  }
}

export async function fetchOrgs(username: string, token?: string, isAuth?: boolean): Promise<GitHubOrg[]> {
  const endpoint = isAuth ? '/user/orgs' : `/users/${username}/orgs`;
  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, { 
    headers: getHeaders(token),
    cache: 'no-store' 
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSocialAccounts(username: string, token?: string): Promise<GitHubSocialAccount[]> {
  const res = await fetch(`${GITHUB_API_BASE}/users/${username}/social_accounts`, { 
    headers: getHeaders(token),
    cache: 'no-store' 
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchOrgRepos(orgLogin: string, token?: string): Promise<GitHubRepo[]> {
  const res = await fetch(`${GITHUB_API_BASE}/orgs/${orgLogin}/repos?type=all&per_page=100&sort=pushed`, { 
    headers: getHeaders(token),
    cache: 'no-store' 
  });
  if (!res.ok) {
    let msg = await res.text();
    try {
      const json = JSON.parse(msg);
      if (json.message) msg = json.message;
    } catch (e) {}
    throw new Error(`${res.status} - ${msg}`);
  }
  return res.json();
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

export async function fetchRateLimit(token?: string): Promise<RateLimit | null> {
  try {
    const headers = getHeaders(token);
    const res = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.resources.core;
  } catch (e) {
    return null;
  }
}

