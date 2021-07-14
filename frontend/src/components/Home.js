import { useState } from "react";

export default function Home({ user }) {
  const [message, setMessage] = useState(false);

  const fetchApi = async (page) => {
    const response = await fetch(`/api/${page}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    const result = await response.json();

    setMessage(result.message);
  };

  return (
    <>
      <h1 className="text-center my-5">Hello, there! This is the homepage.</h1>
      <div className="text-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            fetchApi("public");
          }}
        >
          Fetch public
        </button>{" "}
        {user && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              fetchApi("private");
            }}
          >
            Fetch private
          </button>
        )}
      </div>
      <h2 className="text-center">{message}</h2>
    </>
  );
}
