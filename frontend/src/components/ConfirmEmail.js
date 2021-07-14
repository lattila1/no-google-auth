import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ConfirmEmail() {
  const history = useHistory();

  const [message, setMessage] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const code = searchParams.get("code");
    const username = searchParams.get("user");

    setTimeout(async () => {
      const response = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          username,
        }),
      });
      const result = await response.json();

      setMessage(result.message);

      if (response.ok) {
        history.push("/login?verified=true");
      }
    }, 2000);
  }, []); // eslint-disable-line
  return (
    <>
      <h1 className="text-center my-5">Email confirmation</h1>
      <div className={`alert alert-${message ? "danger" : "light"} text-center`}>
        {message ? message : "Please wait..."}
      </div>
    </>
  );
}
