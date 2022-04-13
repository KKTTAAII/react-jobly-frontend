import React, { useContext } from "react";
import UserInfoContext from "./UserInfoContext";
import { Link } from "react-router-dom";
import CompaniesList from "./Companies/CompaniesList";
import "./css/Home.css";

function Home() {
  const userInfo = useContext(UserInfoContext);
  const { isLoggedIn } = userInfo;
  
  return (
    <div className="Jobly">
      {isLoggedIn ? (
        <CompaniesList />
      ) : (
        <>
          <div className="Jobly-header">Jobly</div>
          <div className="Jobly-description">
            All the jobs in one, convenient place.
          </div>
          <div className="Jobly-btn-container">
            <Link to={`/login`}>
              <button className="Jobly-btn">Log in</button>
            </Link>
            <Link to={`/signup`}>
              <button className="Jobly-btn">Sign up</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
