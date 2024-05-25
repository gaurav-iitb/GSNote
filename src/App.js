import "./App.css";
import Home from "./Components/Home";
import LandingPage from "./Components/LandingPage";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Router>
          <Routes>
            <Route path="/note" exact element={<Home />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Router>
      </AnimatePresence>
      {/* <Home /> */}
    </>
  );
}

export default App;
