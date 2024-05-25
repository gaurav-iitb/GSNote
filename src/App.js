import "./App.css";
import Home from "./Components/Home";
import MainPage from "./Components/MainPage";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/mainPage" element={<MainPage />} />
        </Routes>
      </Router>
      {/* <Home /> */}
    </>
  );
}

export default App;
