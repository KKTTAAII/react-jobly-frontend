import React, { useContext, useState } from "react";
import { useFetch } from "../hooks";
import { Link } from "react-router-dom";
import CompanyCard from "./CompanyCard";
import LoadingSpin from "react-loading-spin";
import JoblyApi from "../api";
import UserInfoContext from "../UserInfoContext";
import Pagination from "../Pagination";
import "../css/CompaniesList.css";
import swal from "sweetalert";

const ERROR = "Oops, somthing's wrong";

function CompaniesList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [compsPerPage] = useState(10);
  const userInfo = useContext(UserInfoContext);
  const { isLoggedIn, token } = userInfo;
  let searchTerm;

  //Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  if (isLoggedIn === false && !token) {
    return (
      <div>
        <p>Please log in to access this page</p>
        <Link to={`/login`}>Log in</Link>
      </div>
    );
  }

  const [companies, isLoading, setCompanies] = useFetch(
    JoblyApi.getAll("companies", {}, token)
  );

  if (isLoading) {
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
      const res = await JoblyApi.getAll(
        "companies",
        { name: searchTerm },
        token
      );
      setCompanies(res);
    } catch (e) {
      console.log(e);
      swal(ERROR);
    }
  };

  //Get current comp
  const indexOfLastComp = currentPage * compsPerPage;
  const indexOfFirstComp = indexOfLastComp - compsPerPage;
  const currentComps = companies.slice(indexOfFirstComp, indexOfLastComp);
  const goToPreviousPage = () => {
    setCurrentPage(currentPage => currentPage - 1);
  };
  const goToNextPage = () => {
    setCurrentPage(currentPage => currentPage + 1);
  };

  const allCompanies = currentComps.map(company => {
    const { name, description, handle } = company;
    return (
      <CompanyCard
        name={name}
        description={description}
        key={handle}
        handle={handle}
      />
    );
  });

  return (
    <div className="CompaniesList">
      <div>
        <form onSubmit={handleSubmit} className="CompaniesList-seachForm">
          <input
            onChange={handleChange}
            type="text"
            name="companies"
            id="companies"
            placeholder="Enter search term..."
            className="CompaniesList-searchBox"
          ></input>
          <button className="CompaniesList-btn">Search</button>
        </form>
      </div>
      {allCompanies}
      <div className="CompaniesList-pages">
        <button
          onClick={goToPreviousPage}
          className={`prev ${currentPage === 1 ? "disabled" : ""}`}
        >
          prev
        </button>
        <Pagination
          itemsPerPage={compsPerPage}
          totalItems={companies.length}
          paginate={paginate}
        />
        <button
          onClick={goToNextPage}
          className={`next ${
            currentPage === companies.length / compsPerPage ? "disabled" : ""
          }`}
        >
          next
        </button>
      </div>
    </div>
  );
}

export default CompaniesList;
