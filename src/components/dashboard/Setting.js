import {
  EmailAuthCredential,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import React, { useRef, useState } from "react";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const Setting = () => {
  const naviagte = useNavigate();
  const fileinputRef = useRef(null);
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [file, setFile] = useState(null);
  const [displayName, setDisplayName] = useState(localStorage.getItem("cName"));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("photoURL"));
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoLoading, setIsLogoLoading] = useState(false);

  const [LoadPass, setLoadPass] = useState(false);

  const onSeleceteFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const updateLogo = () => {
    setIsLogoLoading(true);
    const fileRef = ref(storage, localStorage.getItem("photoURL"));
    console.log(fileRef._location.path_);

    const storageRef = ref(storage, fileRef._location.path_);
    uploadBytesResumable(storageRef, file)
      .then((result) => {
        window.location.reload();
        // getDownloadURL(storageRef).then((downloadURL) => {
        //   updateProfile(localStorage.getItem("uid"), {
        //     photoURL: downloadURL,
        //   });
        //   localStorage.setItem("photoURL", downloadURL);
        // });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLogoLoading(false);
      });
  };

  const updateCName = () => {
    setIsLoading(true);

    updateProfile(auth.currentUser, {
      displayName: displayName,
    })
      .then((res) => {
        localStorage.setItem("cName", displayName);
        updateDoc(doc(db, "user", localStorage.getItem("uid")), {
          displayName: displayName,
        })
          .then((res) => {
            console.log(res);
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const updatePasswordHandler = () => {
    setLoadPass(true);
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    reauthenticateWithCredential(user, credential)
      .then(() => {
        updatePassword(user, newPassword);
        console.log("Upadte password succesfully");
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((error) => {
        console.log("Error in Upadting Password", error);
      })
      .finally(() => {
        setLoadPass(false);
      });
  };

  return (
    <div>
      <p>setting</p>
      <div className="setting-wrapper">
        <div className="profile-info update-cname">
          {" "}
          <img
            onClick={() => {
              fileinputRef.current.click();
            }}
            src={imageUrl}
          />
          <input
            style={{ display: "none" }}
            className="login-input"
            type="file"
            ref={fileinputRef}
            onChange={(e) => {
              onSeleceteFile(e);
            }}
          />
          {file && (
            <button
              style={{
                width: "30%",
                padding: "10px",
                backgroundColor: "hotpink",
              }}
              onClick={updateLogo}
            >
              {isLogoLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}{" "}
              Update Profile pic
            </button>
          )}
        </div>
        <div className="update-cname">
          <input
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            value={displayName}
            type="text"
            placeholder="company Name"
          />
          <button onClick={updateCName}>
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}{" "}
            Upadte Comapny Name
          </button>
        </div>

        <div className="update-cname">
          <input
            onChange={(e) => {
              setCurrentPassword(e.target.value);
            }}
            value={currentPassword}
            type="text"
            placeholder="Current Password"
          />
          <input
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            value={newPassword}
            type="text"
            placeholder="New Password"
          />
          <button onClick={updatePasswordHandler}>
            {LoadPass && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}{" "}
            Upadte Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
