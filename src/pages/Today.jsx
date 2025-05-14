import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Today() {
  const navigate = useNavigate();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    navigate(`/calendar?date=${today}`); // Redirect to the calendar with today's date as a query parameter
  }, [navigate]);

  return null; // No UI needed since it redirects immediately
}
