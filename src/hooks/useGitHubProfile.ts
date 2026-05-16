import { useState, useEffect } from 'react';
import { 
  fetchUser, 
  fetchRepos, 
  fetchUserReadme, 
  fetchOrgs, 
  fetchSocialAccounts, 
  fetchOrgRepos,
  fetchEvents,
  isAuthUser,
  GitHubUser, 
  GitHubRepo, 
  GitHubOrg, 
  GitHubSocialAccount,
  GitHubEvent
} from '../lib/github';

export interface GitHubProfileData {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  readme: string | null;
  orgs: GitHubOrg[];
  socials: GitHubSocialAccount[];
  events: GitHubEvent[];
  loading: boolean;
  error: string | null;
  warnings: string[];
}

export function useGitHubProfile(username: string, token: string = ''): GitHubProfileData {
  const [data, setData] = useState<GitHubProfileData>({
    user: null,
    repos: [],
    readme: null,
    orgs: [],
    socials: [],
    events: [],
    loading: false,
    error: null,
    warnings: [],
  });

  useEffect(() => {
    if (!username) {
      setData(prev => ({ ...prev, user: null, repos: [], readme: null, orgs: [], socials: [], events: [], loading: false, error: null, warnings: [] }));
      return;
    }

    let isMounted = true;

    const loadProfile = async () => {
      setData(prev => ({ ...prev, loading: true, error: null, warnings: [] }));
      
      try {
        const isAuth = await isAuthUser(username, token);

        // Use allSettled for resilience: if one non-critical API fails, we still show the rest
        const results = await Promise.allSettled([
          fetchUser(username, token, isAuth),
          fetchRepos(username, token, isAuth),
          fetchUserReadme(username, token),
          fetchOrgs(username, token, isAuth),
          fetchSocialAccounts(username, token),
          fetchEvents(username, token, isAuth)
        ]);

        if (!isMounted) return;

        const [userRes, reposRes, readmeRes, orgsRes, socialsRes, eventsRes] = results;

        // User is the only critical piece
        if (userRes.status === 'rejected') {
          throw userRes.reason;
        }

        let userRepos = reposRes.status === 'fulfilled' ? reposRes.value : [];
        const userOrgs = orgsRes.status === 'fulfilled' ? orgsRes.value : [];
        let warningsList: string[] = [];

        // Fetch organization repositories if any
        if (userOrgs.length > 0) {
          try {
            const orgReposPromises = userOrgs.map(org => fetchOrgRepos(org.login, token));
            const orgReposResults = await Promise.allSettled(orgReposPromises);
            
            orgReposResults.forEach((res, index) => {
              if (res.status === 'fulfilled') {
                userRepos = [...userRepos, ...res.value];
              } else {
                const orgName = userOrgs[index].login;
                warningsList.push(`Could not fetch data for organization '${orgName}': ${res.reason?.message || 'Unknown error'}`);
              }
            });
            
            // Deduplicate repositories just in case
            const seen = new Set();
            userRepos = userRepos.filter(r => {
              if (seen.has(r.id)) return false;
              seen.add(r.id);
              return true;
            });
          } catch (e) {
            console.error('Failed to fetch org repos', e);
          }
        }

        if (!isMounted) return;

        setData({
          user: userRes.value,
          repos: userRepos,
          readme: readmeRes.status === 'fulfilled' ? readmeRes.value : null,
          orgs: userOrgs,
          socials: socialsRes.status === 'fulfilled' ? socialsRes.value : [],
          events: eventsRes.status === 'fulfilled' ? eventsRes.value : [],
          loading: false,
          error: null,
          warnings: warningsList,
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
