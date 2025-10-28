import React from "react";
import "./Card.css";

export default function Card({ tag, title, description, dueDate }) {
  return (
    <div className="card">
      <div className="card--type">{tag}</div>
      <div className="card--title">{title}</div>
      <div className="card--description">{description}</div>
      <div className="card--deadline">
        Deadline:
        <span className="card--deadline--date">{dueDate}</span>
      </div>
    </div>
  );
}
