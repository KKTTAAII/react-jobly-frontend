import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpin from "react-loading-spin";
import { useFetch } from "../hooks";
import JobCard from "./JobCard";
import UserInfoContext from "../UserInfoContext";
import jwt_decode from "jwt-decode";
import JoblyApi from "../api";
import Pagination from "../Pagination";
import "../css/JobList.css";
import swal from "sweetalert";

const ERROR = "Oops, somthing's wrong";

function JobList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(20);
  const [applications, setApplications] = useState();
  const userInfo = useContext(UserInfoContext);
  const { isLoggedIn, token } = userInfo;
  const decodedToken = jwt_decode(token.token);
  //I have to extract username from token instead of using currentUser
  //from useContext because when I refresh the page, the currentUser.username
  //turns to undifined before it fetches data. Is there a better way to do this?
  const username = decodedToken.username;
  const [jobs, isLoading, setJobs] = useFetch(
    JoblyApi.getAll("jobs", {}, token)
  );
  let searchTerm;

  //Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

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

  const handleChange = e => {
    const { value } = e.target;
    searchTerm = value;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await JoblyApi.getAll("jobs", { title: searchTerm }, token);
      setJobs(res);
      const input = document.querySelector(".JobList-searchbox-input");
      input.value = "";
    } catch (e) {
      console.log(e);
      swal(ERROR);
    }
  };

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

  //Get current jobs
  const indexOfLastComp = currentPage * jobsPerPage;
  const indexOfFirstComp = indexOfLastComp - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstComp, indexOfLastComp);
  const goToPreviousPage = () => {
    setCurrentPage(currentPage => currentPage - 1);
  };
  const goToNextPage = () => {
    setCurrentPage(currentPage => currentPage + 1);
  };

  const allJobs = currentJobs.map(job => {
    const { title, salary, equity, id, companyName } = job;
    return (
      <JobCard
        title={title}
        companyName={companyName}
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
    <div className="JobList">
      <div>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            type="text"
            name="jobs"
            id="jobs"
            placeholder="Enter search term..."
            className="JobList-searchbox-input"
          ></input>
          <button className="JobList-searchbox-btn">Search</button>
        </form>
      </div>
      {allJobs}
      <div className="JobList-pages">
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          prev
        </button>
        <Pagination
          itemsPerPage={jobsPerPage}
          totalItems={jobs.length}
          paginate={paginate}
        />
        <button
          onClick={goToNextPage}
          className={`next ${
            currentPage === jobs.length / jobsPerPage ||
            jobs.length < jobsPerPage
              ? "disabled"
              : ""
          }`}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default JobList;
