import { useState, useEffect } from "react";

export default function Signup() {
  const [message, setMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });

  const handleChange = (e) => {
    setMessage(false);
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await response.json();

    if (response.status === 201) {
      setSuccessMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  useEffect(() => {
    if (!formData.email && !formData.username) {
      return;
    }

    const timeout = setTimeout(async () => {
      const response = await fetch(`/api/check-availability?email=${formData.email}&username=${formData.username}`);
      const result = await response.json();

      if (response.status === 400) {
        setMessage(result.message);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [formData]);

  if (successMessage) {
    return (
      <>
        <h1 className="text-center my-5">Signup</h1>
        <div className="alert alert-success text-center">{successMessage}</div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center my-5">Signup</h1>
      <form onSubmit={handleSubmit}>
        {message && <div className="alert alert-danger text-center">{message}</div>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input type="email" className="form-control" id="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input type="text" className="form-control" id="username" value={formData.username} onChange={handleChange} />
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
          Signup
        </button>
      </form>
    </>
  );
}
