"use strict";

console.log("#23. JavaScript homework: Map, Set and classes");

class CalorieCalculator {
  constructor() {
    this.products = new Map();
  }

  addProduct(productName, calories) {
    this.products.set(productName, calories);

    return this;
  }

  getProductCalories(productName) {
    if (!this.products.has(productName)) {
      return "Product not found";
    }

    return this.products.get(productName);
  }

  removeProduct(productName) {
    return this.products.delete(productName);
  }

  getProductsList() {
    return Array.from(this.products.entries());
  }
}

class UniqueUsernames {
  constructor() {
    this.usernames = new Set();
  }

  addUser(username) {
    this.usernames.add(username);

    return this;
  }

  exists(username) {
    return this.usernames.has(username);
  }

  count() {
    return this.usernames.size;
  }

  getUsersList() {
    return Array.from(this.usernames.values());
  }
}

const sourceExamples = {
  calorieCalculator: `class CalorieCalculator {
  constructor() {
    this.products = new Map();
  }

  addProduct(productName, calories) {
    this.products.set(productName, calories);

    return this;
  }

  getProductCalories(productName) {
    if (!this.products.has(productName)) {
      return "Product not found";
    }

    return this.products.get(productName);
  }

  removeProduct(productName) {
    return this.products.delete(productName);
  }
}`,
  uniqueUsernames: `class UniqueUsernames {
  constructor() {
    this.usernames = new Set();
  }

  addUser(username) {
    this.usernames.add(username);

    return this;
  }

  exists(username) {
    return this.usernames.has(username);
  }

  count() {
    return this.usernames.size;
  }
}`,
  lessonConcepts: `const mapExample = new Map([
  ["Apple", 52],
  ["Banana", 89],
]);

const setExample = new Set([
  "john_doe",
  "jane_doe",
  "john_doe",
]);

console.log(mapExample.get("Apple")); // 52
console.log(setExample.size); // 2`,
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

const renderProductsTable = (targetId, rows) => {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = rows
    .map(
      ([name, calories]) => `
        <tr class="data-table__row">
          <td class="data-table__cell">${escapeHtml(name)}</td>
          <td class="data-table__cell">${escapeHtml(calories)} ккал</td>
        </tr>
      `
    )
    .join("");
};

const renderUserBadges = (targetId, users) => {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = users
    .map((username) => `<span class="user-badge">${escapeHtml(username)}</span>`)
    .join("");
};

const renderHomework = () => {
  const calorieCalculator = new CalorieCalculator();

  calorieCalculator
    .addProduct("Apple", 52)
    .addProduct("Banana", 89)
    .addProduct("Orange", 43);

  const caloriesBeforeDelete = calorieCalculator.getProductCalories("Apple");
  const bananaCalories = calorieCalculator.getProductCalories("Banana");
  calorieCalculator.removeProduct("Apple");
  const caloriesAfterDelete = calorieCalculator.getProductCalories("Apple");

  const uniqueUsernames = new UniqueUsernames();

  uniqueUsernames
    .addUser("john_doe")
    .addUser("jane_doe")
    .addUser("john_doe")
    .addUser("denys_dev");

  setTextContent("calorieCalculatorCode", sourceExamples.calorieCalculator);
  setTextContent("uniqueUsernamesCode", sourceExamples.uniqueUsernames);
  setTextContent("lessonConceptsCode", sourceExamples.lessonConcepts);

  renderProductsTable("productsTableBody", calorieCalculator.getProductsList());
  renderUserBadges("userBadges", uniqueUsernames.getUsersList());

  renderResultList("calorieCalculatorResults", [
    { label: "calorieCalculator.getProductCalories('Apple')", value: caloriesBeforeDelete },
    { label: "calorieCalculator.getProductCalories('Banana')", value: bananaCalories },
    { label: "Після removeProduct('Apple')", value: caloriesAfterDelete },
    { label: "Внутрішнє сховище", value: "new Map()" },
  ]);

  renderResultList("uniqueUsernamesResults", [
    { label: "uniqueUsernames.exists('john_doe')", value: uniqueUsernames.exists("john_doe") },
    { label: "uniqueUsernames.exists('guest')", value: uniqueUsernames.exists("guest") },
    { label: "uniqueUsernames.count()", value: uniqueUsernames.count() },
    { label: "Внутрішнє сховище", value: "new Set()" },
  ]);
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderHomework);
}

export { CalorieCalculator, UniqueUsernames };
