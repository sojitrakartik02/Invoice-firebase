import React, { useRef, useState } from "react";
import "../login/login.css";
import { storage, auth, db } from "../../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const naviagte = useNavigate();
  const fileinputRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((newUser) => {
        console.log(newUser);
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`);
        uploadBytesResumable(storageRef, file)
          .then((res) => {
            console.log(res);
            getDownloadURL(storageRef).then(async (downloadUrl) => {
              console.log(downloadUrl);
              await updateProfile(newUser.user, {
                displayName: displayName,
                photoURL: downloadUrl,
              });
              setDoc(doc(db, "user", newUser.user.uid), {
                uid: newUser.user.uid,
                displayName: displayName,
                email: email,
                photoURL: downloadUrl,
              });
              naviagte("/dashboard");
              setIsLoading(false);

              localStorage.setItem("cName", newUser.user.displayName);
              localStorage.setItem("photoURL", newUser.user.photoURL);
              localStorage.setItem("email", newUser.user.email);
              localStorage.setItem("uid", newUser.user.uid);
            });
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const onSeleceteFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="login-wrpper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h2 className="login-heading">Create your Account</h2>
          <form onSubmit={submitHandler}>
            <input
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="login-input"
              placeholder="Email"
              type="text"
            />
            <input
              required
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
              className="login-input"
              placeholder="Company Name"
              type="text"
            />
            <input
              required
              className="login-input"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              required
              style={{ display: "none" }}
              className="login-input"
              type="file"
              ref={fileinputRef}
              onChange={(e) => {
                onSeleceteFile(e);
              }}
            />
            <input
              required
              className="login-input"
              type="button"
              value="Select your logo"
              onClick={() => {
                fileinputRef.current.click();
              }}
            />
            {imageUrl != null && (
              <img className="image-preview" src={imageUrl} />
            )}{" "}
            <button className="login-input login-btn" type="submit">
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}
              Register
            </button>
          </form>
          <Link to="/login" className="register-link">
            Login with your account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
