import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Navbar from "./NavBar";
import CompaniesList from "./Companies/CompaniesList";
import CompanyDetail from "./Companies/CompanyDetail";
import JobList from "./Jobs/JobList";
import LogIn from "./Login&Signup/LogIn";
import SignUp from "./Login&Signup/SignUp";
import Home from "./Home";
import NotFound from "./NotFound";
import Profile from "./Profile/Profile";

import UserInfoContext from "./UserInfoContext";
import JoblyApi from "./api";
import { useLocalStorageState } from "./hooks";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import "./css/Routes.css";

function Routes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [token, setToken] = useLocalStorageState("token", null);
  let username;

  if (token) {
    const decodedToken = jwt_decode(token.token);
    username = decodedToken.username;
  }

  useEffect(() => {
    async function getUser() {
      try {
        const user = await JoblyApi.getSingleInfo("users", username, token);
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
        }
      } catch (e) {
        swal("Oops, something's wrong");
        throw new Error(e);
      }
    }
    //if I do not check if there is token, I run into error. Is this okay/common to do?
    token ? getUser() : console.log("No logged in user");
  }, [token]);

  const signUp = async data => {
    try {
      const newUserToken = await JoblyApi.signUp(data);
      const user = await JoblyApi.getSingleInfo(
        "users",
        data.username,
        newUserToken
      );
      setToken(newUserToken);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const logIn = async data => {
    try {
      const token = await JoblyApi.authenticate(data);
      const user = await JoblyApi.getSingleInfo("users", data.username, token);
      setToken(token);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  const logOut = () => {
    setToken(null);
    setCurrentUser();
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <UserInfoContext.Provider
        value={{
          currentUser: currentUser,
          token: token,
          isLoggedIn: isLoggedIn,
        }}
      >
        <Navbar logOut={logOut} />
        <main className="Routes-main">
          <Switch>
            <Route exact path="/login">
              <LogIn logIn={logIn} />
            </Route>
            <Route exact path="/signup">
              <SignUp signup={signUp} />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/companies">
              <CompaniesList />
            </Route>
            <Route exact path="/companies/:handle">
              <CompanyDetail />
            </Route>
            <Route exact path="/jobs">
              <JobList />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </main>
      </UserInfoContext.Provider>
    </BrowserRouter>
  );
}

export default Routes;
