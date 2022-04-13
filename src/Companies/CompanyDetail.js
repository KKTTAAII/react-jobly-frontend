import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../hooks";
import JoblyApi from "../api";
import LoadingSpin from "react-loading-spin";
import JobCard from "../Jobs/JobCard";
import UserInfoContext from "../UserInfoContext";
import jwt_decode from "jwt-decode";
import "../css/CompanyDetail.css";
import swal from "sweetalert";

const ERROR = "Oops, somthing's wrong";

function CompanyDetail() {
  const [applications, setApplications] = useState();
  const userInfo = useContext(UserInfoContext);
  const { isLoggedIn, token } = userInfo;
  const decodedToken = jwt_decode(token.token);
  const username = decodedToken.username;
  //I have to extract username from token instead of using currentUser
  //from useContext because when I refresh the page, the currentUser.username
  //turns to undifined before it fetches data. Is there a better way to do this?
  const { handle } = useParams();
  const [companyJobs, isLoading] = useFetch(
    JoblyApi.getSingleInfo("companies", handle, token)
  );
  const { jobs, name, description } = companyJobs;

  useEffect(() => {
    try {
      async function getUsersJobs() {
        const resp = await JoblyApi.getSingleInfo("users", username, token);
        setApplications(resp.applications);
      }
      getUsersJobs();
    } catch (e) {
      console.log(e);
      swal(ERROR);
    }
  }, [token]);

  if (isLoggedIn === false && !token) {
    return (
      <div>
        <p>Please log in to access this page</p>
        <Link to={`/login`}>Log in</Link>
      </div>
    );
  }

  if (isLoading || !applications) {
    return (
      <div className="loading">
        <LoadingSpin />
      </div>
    );
  }

  const addJob = async jobId => {
    try {
      const newApplication = jobId;
      setApplications(applications => [...applications, newApplication]);
      await JoblyApi.appliedJob(username, jobId, token);
    } catch (e) {
      console.log(e);
      swal(ERROR);
    }
  };

  const allJobs = jobs.map(job => {
    const { title, id, salary, equity } = job;
    return (
      <JobCard
        title={title}
        salary={salary}
        equity={equity}
        id={id}
        key={id}
        buttonValue={applications.includes(id) ? "Applied" : "Apply"}
        addJob={addJob}
      />
    );
  });

  return (
    <div className="CompaniesDetail">
      <div className="CompaniesDetail-title">{name}</div>
      <div>{description}</div>
      <div>{allJobs}</div>
    </div>
  );
}

export default CompanyDetail;
