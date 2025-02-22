import { useState } from "react";
import GitHubAuth from "./components/GitHubAuth";
import RepoSelector from "./components/RepoSelector";
import LogViewer from "./components/LogViewer";

const App = () => {
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [repo, setRepo] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Project Debugging Platform</h1>

      {!user && <GitHubAuth onAuthSuccess={setUser} />}
      {user && !repo && <RepoSelector onRepoSelected={setRepo} />}
      {project && <LogViewer projectId={project.id} />}
    </div>
  );
};

export default App;
