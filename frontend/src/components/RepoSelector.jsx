import { useState, useEffect } from "react";
import axios from "axios";

const RepoSelector = ({ onRepoSelected }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/github/repos", { withCredentials: true })
      .then(res => setRepos(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3>Select a GitHub Repository:</h3>
      {loading ? <p>Loading...</p> : (
        <ul>
          {repos.map(repo => (
            <li key={repo.id} onClick={() => onRepoSelected(repo)}>
              {repo.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RepoSelector;
