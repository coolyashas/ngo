import React from "react";
import { useParams } from "react-router-dom";

const DetailedEvent = () => {
  const { id } = useParams();
  return <div>DetailedEvent for {id}</div>;
};

export default DetailedEvent;
