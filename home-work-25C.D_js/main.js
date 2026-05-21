"use strict";

console.log("#25. JavaScript homework: Window, DOM, BOM and Events");

function createDomElement(tagName, textContent, container) {
  const element = document.createElement(tagName);

  element.textContent = textContent;
  container.appendChild(element);

  return element;
}

function setUserInfoCookie(key, value) {
  const encodedValue = encodeURIComponent(`${key}=${value}`);
  const expiresDate = new Date(Date.now() + 10 * 1000);

  document.cookie = `userInfo=${encodedValue}; expires=${expiresDate.toUTCString()}; path=/`;
  console.log(`Saved userInfo cookie: ${key}=${value}`);
}

function saveUserInfo(key, value) {
  sessionStorage.setItem(key, value);
  console.log(`Saved ${key}: ${value}`);
}

function getUserInfo(key) {
  const value = sessionStorage.getItem(key);

  console.log(`Retrieved ${key}: ${value}`);

  return value;
}

const sourceExamples = {
  createDomElement: `function createDomElement(tagName, textContent, container) {
  const element = document.createElement(tagName);

  element.textContent = textContent;
  container.appendChild(element);

  return element;
}`,
  setUserInfoCookie: `function setUserInfoCookie(key, value) {
  const encodedValue = encodeURIComponent(\`\${key}=\${value}\`);
  const expiresDate = new Date(Date.now() + 10 * 1000);

  document.cookie = \`userInfo=\${encodedValue}; expires=\${expiresDate.toUTCString()}; path=/\`;
  console.log(\`Saved userInfo cookie: \${key}=\${value}\`);
}`,
  storage: `function saveUserInfo(key, value) {
  sessionStorage.setItem(key, value);
  console.log(\`Saved \${key}: \${value}\`);
}

function getUserInfo(key) {
  const value = sessionStorage.getItem(key);

  console.log(\`Retrieved \${key}: \${value}\`);

  return value;
}`,
  events: `document
  .querySelector(".dom-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    createDomElement("p", "Новий DOM-елемент", container);
  });`,
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getCookieValue = (name) => {
  const cookiePrefix = `${name}=`;
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();

    if (trimmedCookie.startsWith(cookiePrefix)) {
      return decodeURIComponent(trimmedCookie.slice(cookiePrefix.length));
    }
  }

  return null;
};

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

const renderBrowserInfo = () => {
  renderResultList("browserInfoResults", [
    { label: "window.innerWidth", value: `${window.innerWidth}px` },
    { label: "screen.width", value: `${window.screen.width}px` },
    { label: "navigator.language", value: window.navigator.language },
    { label: "location.pathname", value: window.location.pathname },
  ]);
};

const renderCookieState = () => {
  const cookieValue = getCookieValue("userInfo") ?? "Cookie userInfo ще не встановлено.";

  renderResultList("cookieResults", [
    { label: "document.cookie", value: document.cookie || "Порожньо" },
    { label: "userInfo", value: cookieValue },
  ]);
};

const renderStorageState = (key = "username") => {
  const value = sessionStorage.getItem(key);

  renderResultList("storageResults", [
    { label: `sessionStorage.getItem('${key}')`, value: value ?? "Значення ще не збережено." },
    { label: "Кількість записів у sessionStorage", value: sessionStorage.length },
  ]);
};

const handleDomFormSubmit = (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const tagName = form.elements.namedItem("tagName").value;
  const textContent =
    form.elements.namedItem("textContent").value.trim() || "Новий DOM-елемент";
  const container = document.getElementById("domSandbox");

  const element = createDomElement(tagName, textContent, container);

  element.className = "created-node";
  element.setAttribute("data-created-by", "createDomElement");

  renderResultList("domResults", [
    { label: "Створений тег", value: `<${element.tagName.toLowerCase()}>` },
    { label: "Текст елемента", value: element.textContent },
    { label: "Кількість дочірніх елементів", value: container.children.length },
  ]);

  form.reset();
};

const handleCookieFormSubmit = (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const key = form.elements.namedItem("cookieKey").value.trim() || "language";
  const value = form.elements.namedItem("cookieValue").value.trim() || "uk";

  setUserInfoCookie(key, value);
  renderCookieState();
};

const handleStorageFormSubmit = (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const key = form.elements.namedItem("storageKey").value.trim() || "username";
  const value = form.elements.namedItem("storageValue").value.trim() || "Denys";

  saveUserInfo(key, value);
  renderStorageState(key);
};

const handleStorageRead = () => {
  const keyInput = document.getElementById("storageKey");
  const key = keyInput.value.trim() || "username";
  const value = getUserInfo(key);

  renderResultList("storageResults", [
    { label: `getUserInfo('${key}')`, value: value ?? "Значення не знайдено." },
    { label: "Кількість записів у sessionStorage", value: sessionStorage.length },
  ]);
};

const registerEvents = () => {
  const domForm = document.getElementById("domForm");
  const cookieForm = document.getElementById("cookieForm");
  const storageForm = document.getElementById("storageForm");
  const storageReadButton = document.getElementById("storageReadButton");
  const clearSandboxButton = document.getElementById("clearSandboxButton");

  domForm.addEventListener("submit", handleDomFormSubmit);
  cookieForm.addEventListener("submit", handleCookieFormSubmit);
  storageForm.addEventListener("submit", handleStorageFormSubmit);
  storageReadButton.addEventListener("click", handleStorageRead);
  clearSandboxButton.addEventListener("click", () => {
    document.getElementById("domSandbox").innerHTML = "";
    renderResultList("domResults", [
      { label: "DOM-контейнер", value: "Очищено через подію click" },
    ]);
  });

  window.addEventListener("resize", renderBrowserInfo);
};

const renderHomework = () => {
  setTextContent("createDomElementCode", sourceExamples.createDomElement);
  setTextContent("cookieCode", sourceExamples.setUserInfoCookie);
  setTextContent("storageCode", sourceExamples.storage);
  setTextContent("eventsCode", sourceExamples.events);

  renderBrowserInfo();
  renderCookieState();
  renderStorageState();
  registerEvents();
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderHomework);
}

export { createDomElement, setUserInfoCookie, saveUserInfo, getUserInfo };
