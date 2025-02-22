import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types';

const FileViewer = ({ accessToken, repo }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!accessToken || !repo) return;

    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
            },
          }
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [accessToken, repo]);

  return (
    <div>
      <h2>Files in {repo.name}</h2>
      <ul>
        {files.map((file) => (
          <li key={file.path}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};
FileViewer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  repo: PropTypes.shape({
    owner: PropTypes.shape({
      login: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default FileViewer;