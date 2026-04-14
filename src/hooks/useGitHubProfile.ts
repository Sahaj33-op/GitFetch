import { useState, useEffect } from 'react';
import { 
  fetchUser, 
  fetchRepos, 
  fetchUserReadme, 
  fetchOrgs, 
  fetchSocialAccounts, 
  GitHubUser, 
  GitHubRepo, 
  GitHubOrg, 
  GitHubSocialAccount 
} from '../lib/github';

export interface GitHubProfileData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  readme: string | null;
  orgs: GitHubOrg[];
  socials: GitHubSocialAccount[];
  loading: boolean;
  error: string | null;
}

export function useGitHubProfile(username: string): GitHubProfileData {
  const [data, setData] = useState<GitHubProfileData>({
    user: null,
    repos: [],
    readme: null,
    orgs: [],
    socials: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!username) {
      setData(prev => ({ ...prev, user: null, repos: [], readme: null, orgs: [], socials: [], loading: false, error: null }));
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setData(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // Use allSettled for resilience: if one non-critical API fails, we still show the rest
        const results = await Promise.allSettled([
          fetchUser(username),
          fetchRepos(username),
          fetchUserReadme(username),
          fetchOrgs(username),
          fetchSocialAccounts(username)
        ]);

        if (!isMounted) return;

        const [userRes, reposRes, readmeRes, orgsRes, socialsRes] = results;

        // User is the only critical piece
        if (userRes.status === 'rejected') {
          throw userRes.reason;
        }

        setData({
          user: userRes.value,
          repos: reposRes.status === 'fulfilled' ? reposRes.value : [],
          readme: readmeRes.status === 'fulfilled' ? readmeRes.value : null,
          orgs: orgsRes.status === 'fulfilled' ? orgsRes.value : [],
          socials: socialsRes.status === 'fulfilled' ? socialsRes.value : [],
          loading: false,
          error: null,
        });
      } catch (err) {
        if (isMounted) {
          setData(prev => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : 'An unexpected error occurred',
            user: null,
          }));
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [username]);

  return data;
}
