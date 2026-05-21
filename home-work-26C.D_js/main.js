"use strict";

console.log("#26. JavaScript homework: Events and event delegation");

let mousePositionHandler = null;

function handleButtonClick(buttonId, message) {
  const button = document.getElementById(buttonId);

  if (!button) {
    return null;
  }

  const clickHandler = () => {
    console.log(message);
  };

  button.addEventListener("click", clickHandler);

  return clickHandler;
}

function trackMousePosition() {
  if (mousePositionHandler) {
    return mousePositionHandler;
  }

  mousePositionHandler = (event) => {
    console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
  };

  document.addEventListener("mousemove", mousePositionHandler);

  return mousePositionHandler;
}

function setupEventDelegation(selector) {
  const list = document.querySelector(selector);

  if (!list) {
    return null;
  }

  const delegationHandler = (event) => {
    const item = event.target.closest("li");

    if (!item || !list.contains(item)) {
      return;
    }

    console.log(`Item clicked: ${item.textContent.trim()}`);
  };

  list.addEventListener("click", delegationHandler);

  return delegationHandler;
}

const sourceExamples = {
  buttonClick: `function handleButtonClick(buttonId, message) {
  const button = document.getElementById(buttonId);

  if (!button) {
    return null;
  }

  const clickHandler = () => {
    console.log(message);
  };

  button.addEventListener("click", clickHandler);

  return clickHandler;
}`,
  mousePosition: `function trackMousePosition() {
  if (mousePositionHandler) {
    return mousePositionHandler;
  }

  mousePositionHandler = (event) => {
    console.log(\`Mouse X: \${event.clientX}, Mouse Y: \${event.clientY}\`);
  };

  document.addEventListener("mousemove", mousePositionHandler);

  return mousePositionHandler;
}`,
  eventDelegation: `function setupEventDelegation(selector) {
  const list = document.querySelector(selector);

  if (!list) {
    return null;
  }

  const delegationHandler = (event) => {
    const item = event.target.closest("li");

    if (!item || !list.contains(item)) {
      return;
    }

    console.log(\`Item clicked: \${item.textContent.trim()}\`);
  };

  list.addEventListener("click", delegationHandler);

  return delegationHandler;
}`,
  propagation: `parent.addEventListener("click", () => {
  console.log("Capturing phase");
}, true);

child.addEventListener("click", (event) => {
  console.log("Target phase");
  event.stopPropagation();
});`,
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const setTextContent = (targetId, value) => {
  const element = document.getElementById(targetId);

  if (element) {
    element.textContent = value;
  }
};

const renderResultList = (targetId, items) => {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = items
    .map(
      ({ label, value }) => `
        <div class="result-card">
          <span class="result-card__label">${escapeHtml(label)}</span>
          <span class="result-card__value">${escapeHtml(value)}</span>
        </div>
      `
    )
    .join("");
};

const addLogEntry = (targetId, message) => {
  const log = document.getElementById(targetId);

  if (!log) {
    return;
  }

  const item = document.createElement("li");
  item.className = "event-log__item";
  item.textContent = message;

  log.prepend(item);
};

const setupButtonDemo = () => {
  const button = document.getElementById("demoButton");
  let clickCount = 0;

  handleButtonClick("demoButton", "Button clicked!");

  button.addEventListener("click", (event) => {
    clickCount += 1;
    addLogEntry("buttonLog", `${event.type}: Button clicked! Натискань: ${clickCount}`);
    renderResultList("buttonResults", [
      { label: "Тип події", value: event.type },
      { label: "Ціль події", value: event.target.id },
      { label: "Кількість кліків", value: clickCount },
    ]);
  });
};

const setupMouseDemo = () => {
  const position = document.getElementById("mousePosition");

  trackMousePosition();

  document.addEventListener("mousemove", (event) => {
    position.textContent = `X: ${event.clientX}, Y: ${event.clientY}`;
  });
};

const setupDelegationDemo = () => {
  const list = document.getElementById("delegationList");
  const addItemButton = document.getElementById("addDelegationItem");
  let newItemCount = 4;

  setupEventDelegation("#delegationList");

  list.addEventListener("click", (event) => {
    const item = event.target.closest("li");

    if (!item || !list.contains(item)) {
      return;
    }

    const text = item.textContent.trim();

    list
      .querySelectorAll(".delegation-list__item")
      .forEach((listItem) => listItem.classList.remove("delegation-list__item--active"));

    item.classList.add("delegation-list__item--active");
    addLogEntry("delegationLog", `Item clicked: ${text}`);
    renderResultList("delegationResults", [
      { label: "event.target", value: item.tagName.toLowerCase() },
      { label: "Текст елемента", value: text },
      { label: "Кількість пунктів", value: list.children.length },
    ]);
  });

  addItemButton.addEventListener("click", () => {
    const item = document.createElement("li");
    item.className = "delegation-list__item";
    item.textContent = `Динамічний пункт ${newItemCount}`;
    list.appendChild(item);
    newItemCount += 1;
  });
};

const setupPropagationDemo = () => {
  const parent = document.getElementById("propagationParent");
  const child = document.getElementById("propagationChild");

  parent.addEventListener(
    "click",
    () => {
      addLogEntry("propagationLog", "Фаза захоплення: parent");
    },
    true
  );

  child.addEventListener("click", (event) => {
    addLogEntry("propagationLog", "Цільова фаза: child, stopPropagation()");
    event.stopPropagation();
  });

  parent.addEventListener("click", () => {
    addLogEntry("propagationLog", "Фаза спливання: parent");
  });
};

const renderHomework = () => {
  setTextContent("buttonClickCode", sourceExamples.buttonClick);
  setTextContent("mousePositionCode", sourceExamples.mousePosition);
  setTextContent("eventDelegationCode", sourceExamples.eventDelegation);
  setTextContent("propagationCode", sourceExamples.propagation);

  renderResultList("buttonResults", [
    { label: "Обробник", value: "Очікує click на #demoButton" },
  ]);
  renderResultList("delegationResults", [
    { label: "Делегування", value: "Очікує click на пунктах списку" },
  ]);

  setupButtonDemo();
  setupMouseDemo();
  setupDelegationDemo();
  setupPropagationDemo();
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderHomework);
}

export { handleButtonClick, trackMousePosition, setupEventDelegation };
