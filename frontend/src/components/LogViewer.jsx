import { useEffect, useState } from "react";
import axios from "axios";

const LogViewer = ({ projectId }) => {
  const [logs, setLogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/logs/${projectId}`)
      .then(res => {
        setLogs(res.data.logs);
        setSuggestions(res.data.suggestions);
      });
  }, [projectId]);

  return (
    <div>
      <h3>Execution Logs</h3>
      <pre style={{ background: "#222", color: "#fff", padding: 10 }}>{logs.join("\n")}</pre>

      <h3>AI Suggested Fixes</h3>
      <ul>
        {suggestions.map((fix, idx) => <li key={idx}>{fix}</li>)}
      </ul>
    </div>
  );
};

export default LogViewer;
