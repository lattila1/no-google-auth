import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login({ login }) {
  const history = useHistory();

  const [message, setMessage] = useState(false);
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });

  const searchParams = new URLSearchParams(window.location.search);
  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(false);

    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await response.json();

    if (response.status === 200) {
      sessionStorage.setItem("token", result.token);
      login();
      history.push("/");
    } else {
      setMessage(result.message);
    }
  };

  return (
    <>
      <h1 className="text-center my-5">Login</h1>
      {verified && (
        <div className="alert alert-success text-center">Email verified successfully! You can login now.</div>
      )}
      {reset && <div className="alert alert-success text-center">Password reset successfully! You can login now.</div>}
      <form onSubmit={handleSubmit}>
        {message && <div className="alert alert-danger text-center">{message}</div>}
        <div className="mb-3">
          <label htmlFor="usernameOrEmail" className="form-label">
            Username or Email
          </label>
          <input
            type="text"
            className="form-control"
            id="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>{" "}
        <button
          className="btn btn-light"
          onClick={(e) => {
            e.preventDefault();
            history.push("/request-password-reset");
          }}
        >
          Forgot password?
        </button>
      </form>
    </>
  );
}
