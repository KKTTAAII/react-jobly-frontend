import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  clearInputs,
  createError,
  createInput,
  removeErrElement,
} from "../helper";
import swal from "sweetalert";
import "../css/Signup.css";

const INITIAL_STATE = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  email: "",
};

const WARNING = "All fields are required";

function SignUp({ signup }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setInvalid] = useState(true);
  const history = useHistory();

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
    setFormData(INITIAL_STATE);
    //clear old errors
    removeErrElement(document.querySelector(".err-container"));
    if (!isInvalid) {
      let resp = await signup(formData); //if there is resp returned, it's error(s)
      if (resp) {
        createError(".SignUp-form", resp);
        clearInputs("#username, #password, #firstName, #lastName, #email");
      } else {
        history.push("/companies");
      }
    } else {
      swal("Oop, somthings wrong");
      console.log("something's wrong");
    }
  };

  return (
    <div className="SignUp">
      <div className="SignUp-header">Sign up</div>
      <form onSubmit={handleSubmit} className="SignUp-form">
        {createInput(
          "username",
          "text",
          formData.username,
          handleChange,
          "Username"
        )}
        {createInput(
          "password",
          "password",
          formData.password,
          handleChange,
          "Password"
        )}
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
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button className="SignUp-button">Sign up</button>
      </form>
      <div className="SignUp-already">
        Already signed up? <Link to={`/login`}>Log in</Link>
      </div>
    </div>
  );
}

export default SignUp;
