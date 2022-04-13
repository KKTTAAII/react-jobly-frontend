import React from "react";
import { clearPreviousActiveLink } from "./helper";
import "./css/Pagination.css";

function Pagination({ itemsPerPage, totalItems, paginate }) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className="pagination-nav">
      <ul className="pagination">
        {pageNumbers.map(number => {
          return (
            <li key={number} className="page-item">
              <a
                onClick={e => {
                  paginate(number);
                  clearPreviousActiveLink();
                  e.target.classList.add("active");
                }}
                href={`#${number}`}
                className="page-link"
              >
                {number}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Pagination;
