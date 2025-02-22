import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const GitHubRepoList = ({ accessToken, setSelectedRepo }) => {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchRepos = async () => {
      try {
        const response = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        setRepos(response.data);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };

    fetchRepos();
  }, [accessToken]);

  return (
    <div>
      <h2>Your GitHub Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} onClick={() => setSelectedRepo(repo)}>
            {repo.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
GitHubRepoList.propTypes = {
  accessToken: PropTypes.string.isRequired,
  setSelectedRepo: PropTypes.func.isRequired,
};

export default GitHubRepoList;
