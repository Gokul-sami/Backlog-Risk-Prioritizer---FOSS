import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const LogViewer = ({ containerId }) => {
  const [logs, setLogs] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get(`http://localhost:5000/docker/logs/${containerId}`);
      setLogs(res.data);
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Refresh logs every 5s
    return () => clearInterval(interval);
  }, [containerId]);

  return (
    <div>
      <h3>Container Logs:</h3>
      <pre>{logs}</pre>
    </div>
  );
};
LogViewer.propTypes = {
  containerId: PropTypes.string.isRequired,
};

export default LogViewer;