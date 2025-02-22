import { useEffect, useState } from "react";
import axios from "axios";

const GitHubAuth = ({ onAuthSuccess }) => {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    window.location.href = "http://localhost:5000/auth/github";  // Backend OAuth URL
  };

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.username}</p>
          <button onClick={() => onAuthSuccess(user)}>Continue</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with GitHub</button>
      )}
    </div>
  );
};

export default GitHubAuth;
