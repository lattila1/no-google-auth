import { useState } from "react";

export default function CreatePasswordReset() {
  const [message, setMessage] = useState(false);
  const [usernameOrEmail, setUsernameOrEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage(false);

    const response = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernameOrEmail,
      }),
    });
    const result = await response.json();

    setMessage(result.message);
  };

  return (
    <>
      <h1 className="text-center my-5">Request password reset</h1>
      {message && <div className="alert alert-success text-center">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usernameOrEmail" className="form-label">
            Username or Email
          </label>
          <input
            type="text"
            className="form-control"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => {
              setUsernameOrEmail(e.target.value);
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Request password reset
        </button>
      </form>
    </>
  );
}
