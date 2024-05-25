// src/components/LandingPage.js
import React from "react";
import "./LandingPage.css"; // Make sure to create this file for styles
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ParticlesComponent from "./particles";
import transition from "../transition";

const LandingPage = () => {

  function HandleRedirect(){
    window.location.href = "/note"
  }

  return (
    <div className="landing-page">
      <ParticlesComponent />
      <h1 className="title">
        GS Note:
        <br /> Elevate Your Note-Taking Experience
      </h1>
      <p className="description">
        Welcome to GS Note, your ultimate solution for efficient and organized
        note-taking. With a sleek and intuitive interface, GS Note helps you
        capture your thoughts, manage your tasks, and boost your productivity
        effortlessly. Enjoy seamless synchronization across all your devices and
        ensure your notes are always secure and private. Start your journey
        towards better organization and enhanced productivity with GS Note
        today!
      </p>
      <Button onClick={()=>{HandleRedirect()}} className="start_button" variant="outlined">
        Get Started
      </Button>
    </div>
  );
};

export default transition(LandingPage);
