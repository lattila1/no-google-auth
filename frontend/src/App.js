import { Redirect, Route, Switch, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ConfirmEmail from "./components/ConfirmEmail";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";

export default function App() {
  const [user, setUser] = useState(false);

  const login = () => {
    if (sessionStorage.getItem("token") === null) return;
    const token = sessionStorage.getItem("token");
    const payload = jwt_decode(token);
    setUser(payload);
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <div className="container">
      <nav className="navbar navbar-expand navbar-light bg-light">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand">
            No-Google Auth
          </NavLink>
          <div className="navbar-nav">
            <NavLink to="/" className="nav-link" activeClassName="active" exact>
              Home
            </NavLink>
            {!user && (
              <>
                <NavLink to="/login" className="nav-link" activeClassName="active">
                  Login
                </NavLink>
                <NavLink to="/signup" className="nav-link" activeClassName="active">
                  Signup
                </NavLink>
              </>
            )}
            {user && (
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  sessionStorage.removeItem("token");
                  setUser(false);
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <Switch>
        <Route exact path="/">
          <Home user={user} />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/login">
          <Login login={login} />
        </Route>
        <Route exact path="/confirm">
          <ConfirmEmail />
        </Route>
        <Route exact path="/request-password-reset">
          <RequestPasswordReset />
        </Route>
        <Route exact path="/password">
          <ResetPassword />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}
