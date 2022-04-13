import React, { useContext, useEffect, useState } from "react";
import UserInfoContext from "../UserInfoContext";
import { Link } from "react-router-dom";
import { createError, removeErrElement, createInput } from "../helper";
import LoadingSpin from "react-loading-spin";
import JoblyApi from "../api";
import "../css/Profile.css";
import swal from "sweetalert";

const WARNING = "All fields are required";
const ERROR = "Oops, something's wrong";

function Profile() {
  const userInfo = useContext(UserInfoContext);
  const { isLoggedIn, token, currentUser } = userInfo;
  const [formData, setFormData] = useState(currentUser);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setInvalid] = useState(true);

  if (isLoggedIn === false && !token) {
    return (
      <div>
        <p>Please log in to access this page</p>
        <Link to={`/login`}>Log in</Link>
      </div>
    );
  }

  useEffect(() => {
    async function getFormData() {
      try {
        setFormData(currentUser);
      } catch (e) {
        console.log(e);
        swal(ERROR);
      }
    }
    getFormData();
  }, [currentUser]);

  //get the data for form data first
  //- it's from currentUser
  if (!formData) {
    return (
      <div className="loading">
        <LoadingSpin />
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(formData => ({
      ...formData,
      [name]: value,
    }));
    setIsTouched(true);
    e.target.value === "" ? setInvalid(true) : setInvalid(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    //clear old errors everytime it submits
    removeErrElement(document.querySelector(".err-container"));
    if (!isInvalid) {
      try {
        await JoblyApi.authenticate({
          username: formData.username,
          password: formData.password,
        });
        await JoblyApi.updateInfo(
          "users",
          formData.username,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
          },
          token
        );
      } catch (e) {
        createError(".Update-Form-Container", e);
      }
    } else {
      swal(ERROR);
      console.log("something's wrong");
    }
  };

  return (
    <div className="Profile">
      <div className="Profile-header">{currentUser.username}</div>
      <div className="Update-Form-Container">
        <form onSubmit={handleSubmit} className="Profile-form">
          {createInput(
            "firstName",
            "text",
            formData.firstName,
            handleChange,
            "First Name"
          )}
          {createInput(
            "lastName",
            "text",
            formData.lastName,
            handleChange,
            "Last Name"
          )}
          {createInput("email", "email", formData.email, handleChange, "Email")}
          <label>Confirm your Password to make changes:</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
          />
          {isInvalid && isTouched && <small color="warning">{WARNING}</small>}
          <button className="Profile-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
