import React from "react";
import "./css/NotFound.css";
import ERROR_PIC from "./assets/error-404.png";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="NotFound">
      <div className="NoutFound-text">
        Sorry, we did not find the page you were looking for. Please try again!
      </div>
      <img src={ERROR_PIC} alt="404-Page-Not-Found" className="NotFound-img"></img>
      <Link to={`/`} className="NotFound-backHome">Back home</Link>
    </div>
  );
}

export default NotFound;
