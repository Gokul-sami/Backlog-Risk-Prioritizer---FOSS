import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from "axios";

const RepoSelector = ({ onRepoSelected }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/github/repos", { withCredentials: true })
      .then(res => setRepos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (repo) => {
    onRepoSelected(repo); // Update frontend state

    try {
      const response = await axios.post("http://localhost:5000/docker/run", {
        repoUrl: repo.clone_url
      });

      console.log("Docker Response:", response.data);
    } catch (error) {
      console.error("Error sending repo to Docker:", error);
    }
  };

  return (
    <div>
      <h3>Select a GitHub Repository:</h3>
      {loading ? <p>Loading...</p> : (
        <ul>
          {repos.map(repo => (
            <li key={repo.id} onClick={() => handleSelect(repo)}>
              {repo.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

RepoSelector.propTypes = {
  onRepoSelected: PropTypes.func.isRequired,
};

export default RepoSelector;
