export const newSteps = [
  {
    id: "step1",
    attachTo: { element: ".indie-flower-regular", on: "bottom" },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
        action() {
          return this.next();
        },
      },
    ],
    classes: "custom-class-name-1 custom-class-name-2",
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Welcome to GS Note!",
    text: [
      "GS Note is a versatile tool for taking notes and organizing your thoughts. Let’s take a quick tour to get you started.",
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "step2",
    attachTo: { element: "#canvas", on: "bottom" },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Prev",
        type: "back",
        action() {
          return this.back();
        },
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
        action() {
          return this.next();
        },
      },
    ],
    classes: "custom-class-name-1 custom-class-name-2",
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Drawing Board",
    text: [
      "This is your drawing board. You can create, edit, and organize your notes and drawings here.",
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "step3",
    attachTo: { element: ".box1", on: "bottom" },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Prev",
        type: "back",
        action() {
          return this.back();
        },
      },
      {
        classes: "shepherd-button-primary",
        text: "Next",
        type: "next",
        action() {
          return this.next();
        },
      },
    ],
    classes: "custom-class-name-1 custom-class-name-2",
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Main Tools",
    text: [
      `Here are the main tools you will use:
      <ul>
        <li><strong>Hand Tool:</strong> Move shapes or drawings around the canvas.</li>
        <li><strong>Pencil Tool:</strong> Draw freehand notes and sketches.</li>
        <li><strong>Text Tool:</strong> Add text notes.</li>
        <li><strong>Line Tool:</strong> Draw straight lines.</li>
        <li><strong>Square/Rectangle Tool:</strong> Create square or rectangular shapes.</li>
        <li><strong>Circle Tool:</strong> Create circular shapes.</li>
        <li><strong>Eraser Tool:</strong> Erase the entire board.</li>
      </ul>`,
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "step4",
    attachTo: { element: ".box2", on: "bottom" },
    beforeShowPromise: function () {
      return new Promise(function (resolve) {
        setTimeout(function () {
          window.scrollTo(0, 0);
          resolve();
        }, 500);
      });
    },
    buttons: [
      {
        classes: "shepherd-button-primary",
        text: "Prev",
        type: "back",
        action() {
          return this.back();
        },
      },
      {
        classes: "shepherd-button-primary",
        text: "Finish",
        type: "next",
        action() {
          return this.complete();
        },
      },
    ],
    classes: "custom-class-name-1 custom-class-name-2",
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "Additional Tools",
    text: [
      `These are the additional tools available:
      <ul>
        <li><strong>Undo/Redo:</strong> Undo or redo your last actions.</li>
        <li><strong>Download:</strong> Download your current drawing.</li>
        <li><strong>Color Selector:</strong> Choose colors for your drawings and text.</li>
      </ul>`,
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },

  // ...
];
