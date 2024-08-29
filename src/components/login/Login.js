import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("cName", user.displayName);
        localStorage.setItem("photoURL", user.photoURL);
        localStorage.setItem("email", user.email);
        localStorage.setItem("uid", user.uid);

        navigate("/dashboard");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setIsLoading(false);
      });
  };
  return (
    <div className="login-wrpper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h2 className="login-heading">login</h2>
          <form onSubmit={submitHandler}>
            <input
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="login-input"
              placeholder="Email"
              type="text"
            />{" "}
            <input
              required
              className="login-input"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="login-input login-btn" type="submit">
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}{" "}
              Login
            </button>
          </form>
          <Link to="/register" className="register-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
