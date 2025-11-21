import { useState, useEffect } from 'react'

export const useGitHubRepos = (username) => {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch repositories
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10&type=all`
        )
        
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories')
        }
        
        const reposData = await reposResponse.json()
        
        // Fetch languages for each repo
        const reposWithLanguages = await Promise.all(
          reposData.map(async (repo) => {
            try {
              const langResponse = await fetch(repo.languages_url)
              if (langResponse.ok) {
                const languages = await langResponse.json()
                return {
                  ...repo,
                  languages: Object.keys(languages),
                }
              }
              return { ...repo, languages: [] }
            } catch (err) {
              return { ...repo, languages: [] }
            }
          })
        )
        
        // Filter out forks and sort by stars/updated date
        const filteredRepos = reposWithLanguages
          .filter(repo => !repo.fork && !repo.archived)
          .sort((a, b) => {
            // Sort by stars first, then by updated date
            if (b.stargazers_count !== a.stargazers_count) {
              return b.stargazers_count - a.stargazers_count
            }
            return new Date(b.updated_at) - new Date(a.updated_at)
          })
          .slice(0, 6) // Limit to 6 repos
        
        setRepos(filteredRepos)
      } catch (err) {
        console.error('Error fetching GitHub repos:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (username) {
      fetchRepos()
    }
  }, [username])

  return { repos, loading, error }
}

