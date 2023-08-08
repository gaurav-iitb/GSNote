import React, { useState, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "/node_modules/font-awesome/css/font-awesome.min.css";
import {
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

function Navbar(props) {
  const [pen, setpen] = useState(false);
  const [line, setline] = useState(false);
  const [rect, setrect] = useState(false);
  const [circ, setcirc] = useState(false);
  const [select, setselect] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [text, setText] = useState(false);

  useLayoutEffect(() => {
    if (pen) {
      props.getval("pencil");
    } else if (line) {
      props.getval("line");
    } else if (rect) {
      props.getval("rectangle");
    } else if (circ) {
      props.getval("circle");
    } else if (select) {
      props.getval("selection");
    } else if (Delete) {
      props.getval("deleteall");
    } else if (text) {
      props.getval("text");
    }
  }, [pen, line, rect, circ, select, Delete, text]);

  function pencall() {
    setpen(true);
    setline(false);
    setrect(false);
    setcirc(false);
    setselect(false);
    setDelete(false);
  }
  function linecall() {
    setpen(false);
    setline(true);
    setrect(false);
    setcirc(false);
    setselect(false);
    setDelete(false);
    setText(false);
  }
  function rectcall() {
    setpen(false);
    setline(false);
    setrect(true);
    setcirc(false);
    setselect(false);
    setDelete(false);
    setText(false);
  }
  function circcall() {
    setpen(false);
    setline(false);
    setrect(false);
    setcirc(true);
    setselect(false);
    setDelete(false);
    setText(false);
  }
  function selectcall() {
    setpen(false);
    setline(false);
    setrect(false);
    setcirc(false);
    setselect(true);
    setDelete(false);
    setText(false);
  }
  function deletecall() {
    setpen(false);
    setline(false);
    setrect(false);
    setcirc(false);
    setselect(false);
    setDelete(true);
    setText(false);
  }
  function textcall() {
    setpen(false);
    setline(false);
    setrect(false);
    setcirc(false);
    setselect(false);
    setDelete(false);
    setText(true);
  }

  return (
    <>
      <div className="upperdiv">Welcome to GSNote!!</div>
      <div className="seconddiv">
        {select ? (
          <i
            onClick={selectcall}
            style={{ fontSize: "35px", color: "white" }}
            className="bi bi-arrows-move"
          ></i>
        ) : (
          <i
            onClick={selectcall}
            style={{ fontSize: "35px" }}
            className="bi bi-arrows-move"
          ></i>
        )}
        {pen ? (
          <FontAwesomeIcon
            onClick={pencall}
            style={{ fontSize: "35px", color: "white" }}
            icon={faPencil}
          />
        ) : (
          <FontAwesomeIcon
            onClick={pencall}
            style={{ fontSize: "35px" }}
            icon={faPencil}
          />
        )}
        {line ? (
          <i
            onClick={linecall}
            className="bi bi-slash"
            style={{ fontSize: "60px", marginLeft: "-20px", color: "white" }}
          ></i>
        ) : (
          <i
            onClick={linecall}
            className="bi bi-slash"
            style={{ fontSize: "60px", marginLeft: "-20px" }}
          ></i>
        )}
        {text ? (
          <i
            className="bi bi-fonts"
            onClick={textcall}
            style={{ fontSize: "42px", marginLeft: "-20px", color: "white" }}
          />
        ) : (
          <i
            className="bi bi-fonts"
            onClick={textcall}
            style={{ fontSize: "42px", marginLeft: "-20px" }}
          />
        )}
        {rect ? (
          <i
            onClick={rectcall}
            className="bi bi-square"
            style={{ fontWeight: "bold", color: "white" }}
          />
        ) : (
          <i
            onClick={rectcall}
            className="bi bi-square"
            style={{ fontWeight: "bold" }}
          />
        )}
        {circ ? (
          <i
            onClick={circcall}
            style={{ color: "white" }}
            className="bi bi-circle"
          />
        ) : (
          <i onClick={circcall} className="bi bi-circle" />
        )}
        {Delete ? (
          <FontAwesomeIcon
            onClick={deletecall}
            style={{ color: "white" }}
            icon={faTrash}
          />
        ) : (
          <FontAwesomeIcon onClick={deletecall} icon={faTrash} />
        )}
      </div>
    </>
  );
}

export default Navbar;
