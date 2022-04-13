import React, { useState } from "react";
import { Card, CardBody, CardTitle, CardText, CardSubtitle } from "reactstrap";
import "../css/JobCard.css";

function JobCard({
  title,
  companyName,
  salary,
  equity,
  buttonValue,
  addJob,
  id,
}) {
  const [btnValue, setBtnValue] = useState(buttonValue);
  const [btnStatus, setBtnStatus] = useState(false);
  const changeBtnValue = value => {
    setBtnValue(value);
    if (value === "Applied") {
      setBtnStatus(true);
    }
  };

  return (
    <div className="JobCard">
      <Card className="JobCard-card">
        <CardBody>
          <CardTitle className="JobCard-title">{title}</CardTitle>
          <CardSubtitle>{companyName}</CardSubtitle>
          <CardText>Salary: {salary}</CardText>
          <CardText>Equity: {equity}</CardText>
        </CardBody>
        {buttonValue === "Applied" ? (
          <button disabled={true} className="JobCard-btn">
            {btnValue}
          </button>
        ) : (
          <button
            onClick={() => {
              addJob(id);
              changeBtnValue("Applied");
            }}
            disabled={btnStatus}
            className="JobCard-btn applied"
          >
            {btnValue}
          </button>
        )}
      </Card>
    </div>
  );
}

export default JobCard;
