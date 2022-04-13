import React from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { Link } from "react-router-dom";
import "../css/CompanyCard.css";

function CompanyCard({ name, description, handle }) {
  return (
    <div className="CompanyCard">
      <Link to={`/companies/${handle}`} className="CompanyCard-Link">
        <Card className="CompanyCard-card">
          <CardBody>
            <CardTitle className="CompanyCard-title">{name}</CardTitle>
            <CardText>{description}</CardText>
          </CardBody>
        </Card>
      </Link>
    </div>
  );
}

export default CompanyCard;
