import React from "react";

function empty(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}

function createError(parentClass, resp) {
  const parent = document.querySelector(parentClass);
  const errorContainer = document.createElement("div");
  errorContainer.className = "err-container";
  resp.forEach(err => {
    const error = document.createElement("small");
    error.className = "APIErr";
    error.innerText = err;
    errorContainer.appendChild(error);
  });
  parent.appendChild(errorContainer);
}

function removeErrElement(ele) {
  if (ele) {
    empty(ele);
    ele.remove();
  }
}

function clearInputs(selecters) {
  const inputs = document.querySelectorAll(selecters);
  inputs.forEach(input => {
    input.value = "";
  });
}

function createInput(name, type, value, handleChange, label) {
  return (
    <>
      <label>{label}:</label>
      <input
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
      ></input>
    </>
  );
}

function clearPreviousActiveLink() {
  const allLinks = document.getElementsByClassName("page-link");
  if (allLinks) {
    for (let link of allLinks) {
      link.classList.remove("active");
    }
  } else {
    return;
  }
}

export { empty, createError, removeErrElement, clearInputs, createInput, clearPreviousActiveLink };
