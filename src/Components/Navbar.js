import React, { useState, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "/node_modules/font-awesome/css/font-awesome.min.css";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import PanToolIcon from "@mui/icons-material/PanTool";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { ColorPicker, useColor } from "react-color-palette";

import FavoriteIcon from "@mui/icons-material/Favorite";
import NavigationIcon from "@mui/icons-material/Navigation";

function Navbar({
  getval,
  undohandler,
  redohandler,
  downloadhandler,
  setswitchon,
  switchon,
  color,
  setColor,
  undo,
  redo,
}) {
  const [pen, setpen] = useState(false);
  const [line, setline] = useState(false);
  const [rect, setrect] = useState(false);
  const [circ, setcirc] = useState(false);
  const [select, setselect] = useState(false);
  const [Delete, setDelete] = useState(false);
  const [text, setText] = useState(false);

  useLayoutEffect(() => {
    if (pen) {
      getval("pencil");
    } else if (line) {
      getval("line");
    } else if (rect) {
      getval("rectangle");
    } else if (circ) {
      getval("circle");
    } else if (select) {
      getval("selection");
    } else if (Delete) {
      getval("deleteall");
    } else if (text) {
      getval("text");
    }
  }, [pen, line, rect, circ, select, Delete, text]);

  function pencall() {
    setpen(true);
    setline(false);
    setrect(false);
    setcirc(false);
    setselect(false);
    setDelete(false);
    setText(false);
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
    <div className="upperdiv">
      <div className="alignRow">
        <h1 className="indie-flower-regular">GS Note</h1>
        <Box style={{flex: 1}} sx={{ "& > :not(style)": { m: 1 } }}>
          <Fab
            className={select ? "active" : "inactive"}
            onClick={selectcall}
            color="extended"
            aria-label="add"
          >
            <PanToolIcon />
          </Fab>
          <Fab
            className={pen ? "active" : "inactive"}
            onClick={pencall}
            color="extended"
            aria-label="edit"
          >
            <EditIcon />
          </Fab>
          <Fab
            className={text ? "active" : "inactive"}
            onClick={textcall}
            color="extended"
            aria-label="edit"
          >
            <TextFormatIcon />
          </Fab>
          <Fab
            className={line ? "active" : "inactive"}
            onClick={linecall}
            color="extended"
            aria-label="edit"
          >
            <i className="bi bi-slash" style={{ fontSize: "35px" }}></i>
          </Fab>
          <Fab
            className={rect ? "active" : "inactive"}
            onClick={rectcall}
            color="extended"
            aria-label="edit"
          >
            <CropSquareIcon />
          </Fab>
          <Fab
            className={circ ? "active" : "inactive"}
            onClick={circcall}
            color="extended"
            aria-label="edit"
          >
            <CircleOutlinedIcon />
          </Fab>
          <Fab
            className={Delete ? "active" : "inactive"}
            onClick={deletecall}
            color="extended"
            aria-label="edit"
          >
            <DeleteOutlineOutlinedIcon />
          </Fab>
        </Box>
        <Box style={{flex: 1}} sx={{ "& > :not(style)": { m: 1 } }}>
          <Fab
            className={"inactive"}
            onClick={undohandler}
            color="extended"
            aria-label="add"
          >
            <UndoIcon />
          </Fab>
          <Fab
            className={"inactive"}
            onClick={redohandler}
            color="extended"
            aria-label="edit"
          >
            <RedoIcon />
          </Fab>
          <Fab
            className={"inactive"}
            onClick={downloadhandler}
            color="extended"
            aria-label="edit"
          >
            <CloudDownloadIcon />
          </Fab>
          <Fab
            className={switchon ? "active" : "inactive"}
            color="extended"
            aria-label="edit"
          >
            {/* <CropSquareIcon /> */}
            <div className="picker">
              <div
                className="color-pick"
                onClick={() => setswitchon(!switchon)}
                style={{ backgroundColor: color.hex }}
              />
              {switchon && (
                <div className="main-picker">
                  <ColorPicker
                    width={
                      window.innerWidth < 456 ? window.innerWidth - 50 : 456
                    }
                    height={228}
                    color={color}
                    onChange={setColor}
                    hideHSV
                    dark
                  />
                </div>
              )}
            </div>
          </Fab>
        </Box>
      </div>
    </div>
  );
}

export default Navbar;
