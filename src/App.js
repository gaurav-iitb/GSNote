
import { createElement, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

import "./App.css";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";

function App() {

  return (
    <>
      {/* <Navbar getval={updater} /> */}
      <Home />
    </>
  );
}

export default App;
