import { useLayoutEffect, useEffect, useState, useRef } from "react";
import getStroke from "perfect-freehand";
import rough from "roughjs/bundled/rough.esm";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "/node_modules/font-awesome/css/font-awesome.min.css";
import { faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";
import { act } from "react-dom/test-utils";
import "./Home.css";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

function adjustElementCoordinates(element) {
  const { cursortype, x1, y1, x2, y2 } = element;
  if (cursortype === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else if (cursortype === "line") {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  } else if (cursortype === "circle") {
    return { x1, y1, x2, y2 };
  }
}

function cursorForPosition(position) {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
    case "bound":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
}

function resizedCoordinates(clientX, clientY, position, coordinates) {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    case "bound":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
}

function useHistory(initialstate) {
  const [index, setindex] = useState(0);
  const [history, Sethistory] = useState([initialstate]);

  const setState = (action, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      Sethistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      // Sethistory(prevstate => [...prevstate, newState]);
      Sethistory([...updatedState, newState]);
      setindex((prevstate) => prevstate + 1);
    }
  };

  const undo = () => index > 0 && setindex((prevval) => prevval - 1);
  const redo = () =>
    index < history.length - 1 && setindex((prevval) => prevval + 1);

  return [history[index], setState, undo, redo];
}

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}



const adjustmentRequired = (cursortype) =>
  ["line", "rectangle"].includes[cursortype];

function downloadhandler() {
  var canvas = document.getElementById("canvas");
  var image = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.
  //   var dataURL = canvas.toDataURL();
  var newTab = window.open("about:blank");
  newTab.window.location.href = image;
  // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

function Home() {
  const [cursortype, setcursortype] = useState("");
  const [Elements, SetElements, undo, redo] = useHistory([]);
  const [action, Setaction] = useState("none");
  const [SelectedElement, SetSelectedElement] = useState(null);
  const [switchon, setswitchon] = useState(false);
  const textAreaRef = useRef();
  const [color, setColor] = useColor("hex", "#121212");
  // const [activecolor,setactivecolor] = useState("black")
  // console.log(color)

  function drawElement(roughCanvas, context, element) {
    switch (element.cursortype) {
      case "line":
      case "rectangle":
      case "circle":
        roughCanvas.draw(element.roughElement);
        break;
      case "pencil":
        const myStroke = getSvgPathFromStroke(
          getStroke(element.points, { size: 8 })
        );
        
        context.fillStyle=color.hex;
        context.fill(new Path2D(myStroke));
        break;
      case "text":
        context.textBaseline = "top";
        // context.font = "24px 'Monaco', monospace";
        context.font = "24px 'Gochi Hand', monospace";
        // context.font = "24px 'Patrick Hand SC', monospace";
        context.fillStyle=color.hex;
        context.fillText(element.text, element.x1, element.y1);
        break;
      default:
        throw new Error(`type not recognized: ${element.cursortype}`);
    }
  }

  const generator = rough.generator();

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    if (cursortype === "deleteall") {
      SetElements([]);
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [cursortype]);

  useEffect(() => {
    if (action === "writing") {
      const textArea = textAreaRef.current;
      setTimeout(function () {
        textArea.focus();
      }, 50);
      textArea.value = SelectedElement.text;
      // textArea.focus();
    }
  }, [action, SelectedElement]);

  function createelement(id, x1, y1, x2, y2, cursortype, roughElement) {
    if (cursortype === "rectangle") {
      roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
        roughness: 0,
        stroke: color.hex,
        strokeWidth: 3,
      });
    } else if (cursortype === "line") {
      roughElement = generator.line(x1, y1, x2, y2, {
        roughness: 0,
        stroke: color.hex,
        strokeWidth: 3,
      });
    } else if (cursortype === "circle") {
      roughElement = generator.circle(
        x1,
        y1,
        (2 *Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))), 
          {
            roughness: 0,
            stroke: color.hex,
            strokeWidth: 3,
          }
      );
    } else if (cursortype === "pencil") {
      return { id, cursortype, points: [{ x: x1, y: y1 }] };
    } else if (cursortype === "text") {
      return { id, cursortype, x1, y1, x2, y2, text: "" };
    } else {
      throw new Error(`type not recognized: ${cursortype}`);
    }
    return { id, x1, y1, x2, y2, cursortype, roughElement };
  }

  function updater(s) {
    setcursortype(s);
  }

  function nearPoint(x, y, x1, y1, name) {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  }

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  function onLine(x1, y1, x2, y2, x, y, maxdist) {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x: x, y: y };
    const val = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(val) < maxdist ? "inside" : null;
  }

  function positionWithinElement(x, y, element) {
    const { cursortype, x1, y1, x2, y2 } = element;
    if (cursortype === "rectangle") {
      const topleft = nearPoint(x, y, x1, y1, "tl");
      const topright = nearPoint(x, y, x2, y1, "tr");
      const bottomleft = nearPoint(x, y, x1, y2, "bl");
      const bottomright = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topleft || topright || bottomleft || bottomright || inside;
    } else if (cursortype === "line") {
      const on = onLine(x1, y1, x2, y2, x, y, 1);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    } else if (cursortype === "circle") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x: x, y: y };
      var dist = distance(a, c) - distance(a, b);
      var dist1 = distance(a, b) - distance(a, c);
      const boundary = dist >= 0 && dist <= 7 ? "bound" : null;
      const inside = dist < 0 ? "inside" : null;
      return boundary || inside;
    } else if (cursortype === "pencil") {
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1];
        if (!nextPoint) {
          return false;
        }
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5);
      });
      return betweenAnyPoint ? "inside" : null;
    } else if (cursortype === "text") {
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    }
  }

  function getelementatposition(x, y, elements) {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
      }))
      .find((element) => element.position !== null);
  }

  function handlemousedown(event) {
    if (action === "writing") return;

    const { clientX, clientY } = event;
    if (cursortype === "selection") {
      const element1 = getelementatposition(clientX, clientY, Elements);
      if (element1) {
        if (element1.cursortype === "pencil") {
          const xoffsets = element1.points.map((point) => clientX - point.x);
          const yoffsets = element1.points.map((point) => clientY - point.y);
          SetSelectedElement({ ...element1, xoffsets, yoffsets });
        } else {
          const offsetx = clientX - element1.x1;
          const offsety = clientY - element1.y1;

          SetSelectedElement({ ...element1, offsetx, offsety });
        }
        SetElements((prevstate) => prevstate);
        // SetSelectedElement(element1);

        if (element1.position === "inside") {
          Setaction("moving");
        } else {
          Setaction("resize");
        }
      }
    } else if (
      cursortype === "circle" ||
      cursortype === "line" ||
      cursortype === "rectangle" ||
      cursortype === "pencil" ||
      cursortype === "text"
    ) {
      const id = Elements.length;
      if (cursortype === "text") {
        Setaction("writing");
      } else {
        Setaction("drawing");
      }
      var roughElement = null;
      const element = createelement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        cursortype,
        roughElement
      );
      SetElements((prevstate) => [...prevstate, element]);
      SetSelectedElement(element);
    }
  }

  function updateElement(
    id,
    x1,
    y1,
    x2,
    y2,
    cursortype,
    roughElement,
    options
  ) {
    const elementsCopy = [...Elements];
    switch (cursortype) {
      case "line":
      case "rectangle":
      case "circle":
        elementsCopy[id] = createelement(
          id,
          x1,
          y1,
          x2,
          y2,
          cursortype,
          roughElement
        );
        break;
      case "pencil":
        elementsCopy[id].points = [
          ...elementsCopy[id].points,
          { x: x2, y: y2 },
        ];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas")
          .getContext("2d")
          .measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[id] = {
          ...createelement(
            id,
            x1,
            y1,
            x1 + textWidth,
            y1 + textHeight,
            cursortype
          ),
          text: options.text,
        };
        break;
      default:
        throw new Error(`type not recognized: ${cursortype}`);
    }
    SetElements(elementsCopy, true);
  }

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  function handlemousemove(event) {
    const { clientX, clientY } = event;

    if (cursortype === "selection") {
      const element = getelementatposition(clientX, clientY, Elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }
    if (action === "drawing") {
      const index = Elements.length - 1;
      const { x1, y1 } = Elements[index];
      var roughElement = null;
      updateElement(index, x1, y1, clientX, clientY, cursortype, roughElement);
    } else if (action === "moving") {
      if (SelectedElement.cursortype === "pencil") {
        const newPoints = SelectedElement.points.map((_, index) => ({
          x: clientX - SelectedElement.xoffsets[index],
          y: clientY - SelectedElement.yoffsets[index],
        }));
        //now updating it now itself without using any function.
        const { id } = SelectedElement;
        const elementsCopy = [...Elements];
        // elementsCopy[id].points = newPoints;
        elementsCopy[id] = {
          ...elementsCopy[id],
          points: newPoints,
        };
        SetElements(elementsCopy, true);
      } else {
        const {
          id,
          x1,
          x2,
          y1,
          y2,
          cursortype,
          roughElement,
          offsetx,
          offsety,
        } = SelectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newx = clientX - offsetx;
        const newy = clientY - offsety;
        const options =
          cursortype === "text" ? { text: SelectedElement.text } : {};
        updateElement(
          id,
          newx,
          newy,
          newx + width,
          newy + height,
          cursortype,
          roughElement,
          options
        );
      }
    } else if (action === "resize") {
      const { id, cursortype, roughElement, position, ...coordinates } =
        SelectedElement;

      // const coordinates = { x1, x2, y1, y2 };
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, cursortype, roughElement);
    }
  }

  function handlemouseup(event) {
    const { clientX, clientY } = event;
    if (SelectedElement) {
      if (
        SelectedElement.cursortype === "text" &&
        clientX - SelectedElement.offsetx === SelectedElement.x1 &&
        clientY - SelectedElement.offsety === SelectedElement.y1
      ) {
        Setaction("writing");
        return;
      }

      const index = SelectedElement.id;
      const { id, cursortype } = Elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(cursortype)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(Elements[index]);
        var roughElement = null;
        updateElement(id, x1, y1, x2, y2, cursortype, roughElement);
      }
    }

    if (action === "writing") return;

    Setaction("none");
    SetSelectedElement(null);
  }

  useLayoutEffect(() => {
    if (
      action === "drawing" ||
      action === "moving" ||
      action === "resize" ||
      action === "redo" ||
      action === "undo" ||
      action === "writing" ||
      action === "none"
    ) {
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);
      Elements.forEach((element) => {
        if (element) {
          if (action === "writing" && SelectedElement.id === element.id) {
            //  return;
          } else {
            drawElement(roughCanvas, context, element);
          }
        }
      });
    }
  }, [Elements, action, SelectedElement]); //changed here

  function undohandler(event) {
    Setaction("undo");
    return undo(event);
  }
  function redohandler(event) {
    Setaction("redo");
    return redo(event);
  }

  function handleblur(event) {
    const { id, x1, y1, cursortype } = SelectedElement;
    Setaction("none");
    SetSelectedElement(null);
    updateElement(id, x1, y1, null, null, cursortype, null, {
      text: event.target.value,
    });
  }

  return (
    <div className="home">
      <div
        onDragStart={(e) => {
          e.preventDefault();
        }}
        style={{ position: "fixed", backgroundColor: "#f0ff69" }}
      >
        <Navbar getval={updater} />
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: "23px",
            display: "flex",
          }}
        >
          <FontAwesomeIcon onClick={undohandler} icon={faUndo} />
          <FontAwesomeIcon onClick={redohandler} icon={faRedo} />
          <i
            onClick={downloadhandler}
            style={{ marginLeft: "20px" }}
            className="bi bi-cloud-download-fill"
          ></i>
          <div className="picker">
            <div
              className="color-pick"
              onClick={() => setswitchon(!switchon)}
              style={{ backgroundColor: color.hex }}
            />
            {switchon && (
              <div className="main-picker">
                <ColorPicker
                  width={456}
                  height={228}
                  color={color}
                  onChange={setColor}
                  hideHSV
                  dark
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {action === "writing" && (
        <textarea
          id="txt"
          ref={textAreaRef}
          onBlur={handleblur}
          className="txtarea"
          style={{
            color: color.hex,
            position: "fixed",
            top: SelectedElement.y1 - 5,
            left: SelectedElement.x1,
            font: "24px 'Gochi Hand', monospace",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
          }}
        />
      )}
      <canvas
        onDragStart={(e) => {
          e.preventDefault();
        }}
        id="canvas"
        width={window.outerWidth}
        height={window.outerHeight}
        onMouseDown={handlemousedown}
        onMouseMove={handlemousemove}
        onMouseUp={handlemouseup}
        onPointerDown={handlemousedown}
        onPointerMove={handlemousemove}
        onPointerUp={handlemouseup}
      >
        hello
      </canvas>
    </div>
  );
}

export default Home;
