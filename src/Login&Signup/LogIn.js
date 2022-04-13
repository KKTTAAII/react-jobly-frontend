import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  removeErrElement,
  clearInputs,
  createError,
  createInput,
} from "../helper";
import swal from 'sweetalert';
import "../css/Login.css"

const INITIAL_STATE = {
  username: "",
  password: "",
};

const WARNING = "All fields are required";

function LogIn({ logIn }) {
  const history = useHistory();
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [isTouched, setIsTouched] = useState(false);
  const [isInvalid, setInvalid] = useState(true);

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
    //clear old errors
    removeErrElement(document.querySelector(".err-container"));
    if (!isInvalid) {
      setFormData(INITIAL_STATE);
      let resp = await logIn(formData);
      if (resp) {
        createError(".LogIn-Form-Container", resp);
        clearInputs("#username, #password");
      } else {
        history.push("/companies");
      }
    } else {
      swal("Oop, somthings wrong");
      console.log("something's wrong");
    }
  };

  return (
    <div className="LogIn">
      <div className="LogIn-header">Log in</div>
      <form onSubmit={handleSubmit} className="LogIn-form LogIn-Form-Container">
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
        {isInvalid && isTouched && <small>{WARNING}</small>}
        <button className="LogIn-button">Log in</button>
      </form>
    </div>
  );
}

export default LogIn;
