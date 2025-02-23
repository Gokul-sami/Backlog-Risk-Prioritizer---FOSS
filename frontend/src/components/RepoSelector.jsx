import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../RepoSelector.css"; // Import updated CSS

const RepoSelector = ({ onRepoSelected }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState("");
  const [startCommand, setStartCommand] = useState("npm start");
  const [envVariables, setEnvVariables] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/github/repos", { withCredentials: true })
      .then((res) => setRepos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (repo) => {
    onRepoSelected(repo);

    try {
      const response = await axios.post("http://localhost:5000/docker/run", {
        repoUrl: repo.clone_url,
        startCommand,
        envVariables,
      });

      console.log("Server Response:", response.data);
      setLogs(response.data.logs);
    } catch (error) {
      console.error("Error running repo:", error);
      setLogs("❌ Error running repo");
    }
  };

  return (
    <div className="repo-container">
      
      {/* Input Fields */}
      <div className="input-container">
        <label className="input-label">
          Start Command:
          <input
            type="text"
            value={startCommand}
            onChange={(e) => setStartCommand(e.target.value)}
            placeholder="npm start"
            className="input-field"
          />
        </label>

        <label className="input-label">
          Environment Variables:
          <textarea
            value={envVariables}
            onChange={(e) => setEnvVariables(e.target.value)}
            placeholder="VAR1=value1\nVAR2=value2"
            className="textarea-field"
          />
        </label>
      </div>

      <h3>Select a GitHub Repository:</h3>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ul className="repo-list">
          {repos.map((repo) => (
            <li key={repo.id} onClick={() => handleSelect(repo)} className="repo-item">
              {repo.name}
            </li>
          ))}
        </ul>
      )}

      {/* Logs Display */}
      {logs && <pre className="logs">{logs}</pre>}
    </div>
  );
};

RepoSelector.propTypes = {
  onRepoSelected: PropTypes.func.isRequired,
};

export default RepoSelector;
