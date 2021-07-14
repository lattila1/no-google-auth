import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function ResetPassword() {
  const history = useHistory();
  const query = useQuery();

  const [message, setMessage] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(false);

    const code = query.get("code");
    const username = query.get("user");

    const response = await fetch("/api/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        username,
        password,
      }),
    });
    const result = await response.json();

    setMessage(result.message);

    if (response.ok) {
      history.push("/login?reset=true");
    }
  };

  return (
    <>
      <h1 className="text-center my-5">Reset password</h1>
      <form onSubmit={handleSubmit}>
        {message && <div className="alert alert-danger">{message}</div>}

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            New password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Reset password
        </button>
      </form>
    </>
  );
}
