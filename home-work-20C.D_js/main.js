const userObjSource = `const userObj = {
  firstName: "Denys",
  lastName: "Chuhuiev",
  age: 29,
  fullName() {
    return \`\${this.firstName} \${this.lastName}\`;
  },
};`;

const defUpperStrSource = `function defUpperStr(str) {
  return (str || "default text").toUpperCase();
}`;

const evenFnSource = `function evenFn(n) {
  const result = [];

  for (let i = 0; i <= n; i += 1) {
    if (i !== 0 && i % 2 === 0) {
      result.push(i);
    }
  }

  return result;
}`;

const weekFnSource = `function weekFn(n) {
  if (!Number.isInteger(n) || n < 1 || n > 7) {
    return null;
  }

  switch (n) {
    case 1:
      return "Понеділок";
    case 2:
      return "Вівторок";
    case 3:
      return "Середа";
    case 4:
      return "Четвер";
    case 5:
      return "П'ятниця";
    case 6:
      return "Субота";
    case 7:
      return "Неділя";
    default:
      return null;
  }
}`;

const ageClassificationSource = `function ageClassification(n) {
  return n < 0
    ? null
    : n <= 24
      ? "Дитинство"
      : n <= 44
        ? "Молодість"
        : n <= 65
          ? "Зрілість"
          : n <= 75
            ? "Старість"
            : n <= 90
              ? "Довголіття"
              : n <= 122
                ? "Рекорд"
                : null;
}`;

const oddFnSource = `function oddFn(n) {
  const result = [];
  let i = 1;

  while (i <= n) {
    if (i % 2 !== 0) {
      result.push(i);
    }

    i += 1;
  }

  return result;
}`;

const mainFuncSource = `function mainFunc(a, b, callback) {
  return typeof callback === "function" ? callback(a, b) : false;
}`;

const callbacksSource = `function cbRandom(min, max) {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

function cbPow(num, pow) {
  return Math.pow(num, pow);
}

function cbAdd(a, b) {
  return a + b;
}`;

const userObj = {
  firstName: "Denys",
  lastName: "Chuhuiev",
  age: 29,
  fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
};

function defUpperStr(str) {
  return (str || "default text").toUpperCase();
}

function evenFn(n) {
  const result = [];

  for (let i = 0; i <= n; i += 1) {
    if (i !== 0 && i % 2 === 0) {
      result.push(i);
    }
  }

  return result;
}

function weekFn(n) {
  if (!Number.isInteger(n) || n < 1 || n > 7) {
    return null;
  }

  switch (n) {
    case 1:
      return "Понеділок";
    case 2:
      return "Вівторок";
    case 3:
      return "Середа";
    case 4:
      return "Четвер";
    case 5:
      return "П'ятниця";
    case 6:
      return "Субота";
    case 7:
      return "Неділя";
    default:
      return null;
  }
}

function ageClassification(n) {
  return n < 0
    ? null
    : n <= 24
      ? "Дитинство"
      : n <= 44
        ? "Молодість"
        : n <= 65
          ? "Зрілість"
          : n <= 75
            ? "Старість"
            : n <= 90
              ? "Довголіття"
              : n <= 122
                ? "Рекорд"
                : null;
}

function oddFn(n) {
  const result = [];
  let i = 1;

  while (i <= n) {
    if (i % 2 !== 0) {
      result.push(i);
    }

    i += 1;
  }

  return result;
}

function mainFunc(a, b, callback) {
  return typeof callback === "function" ? callback(a, b) : false;
}

function cbRandom(min, max) {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

function cbPow(num, pow) {
  return Math.pow(num, pow);
}

function cbAdd(a, b) {
  return a + b;
}

function renderResultList(containerId, items) {
  const container = document.getElementById(containerId);

  items.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.className = "result-item";
    resultItem.innerHTML = `<span class="result-item__label">${item.label}</span>${item.value}`;
    container.appendChild(resultItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("code-user").textContent = userObjSource;
  document.getElementById("code-upper").textContent = defUpperStrSource;
  document.getElementById("code-even").textContent = evenFnSource;
  document.getElementById("code-week").textContent = weekFnSource;
  document.getElementById("code-age").textContent = ageClassificationSource;
  document.getElementById("code-odd").textContent = oddFnSource;
  document.getElementById("code-main").textContent = mainFuncSource;
  document.getElementById("code-callbacks").textContent = callbacksSource;

  renderResultList("results-user", [
    { label: "Ім'я:", value: userObj.firstName },
    { label: "Прізвище:", value: userObj.lastName },
    { label: "Вік:", value: userObj.age },
    { label: "Повне ім'я:", value: userObj.fullName() },
  ]);

  renderResultList("results-upper", [
    { label: "З текстом:", value: defUpperStr("My text") },
    { label: "Без параметра:", value: defUpperStr() },
  ]);

  renderResultList("results-even", [
    { label: "evenFn(10):", value: `[${evenFn(10).join(", ")}]` },
    { label: "evenFn(15):", value: `[${evenFn(15).join(", ")}]` },
    { label: "evenFn(20):", value: `[${evenFn(20).join(", ")}]` },
  ]);

  renderResultList("results-week", [
    { label: "weekFn(1):", value: String(weekFn(1)) },
    { label: "weekFn(3):", value: String(weekFn(3)) },
    { label: "weekFn(7):", value: String(weekFn(7)) },
    { label: "weekFn(9):", value: String(weekFn(9)) },
    { label: "weekFn('2'):", value: String(weekFn("2")) },
  ]);

  renderResultList("results-age", [
    { label: "ageClassification(1):", value: String(ageClassification(1)) },
    { label: "ageClassification(24.01):", value: String(ageClassification(24.01)) },
    { label: "ageClassification(65.1):", value: String(ageClassification(65.1)) },
    { label: "ageClassification(90.01):", value: String(ageClassification(90.01)) },
    { label: "ageClassification(150):", value: String(ageClassification(150)) },
  ]);

  renderResultList("results-odd", [
    { label: "oddFn(10):", value: `[${oddFn(10).join(", ")}]` },
    { label: "oddFn(15):", value: `[${oddFn(15).join(", ")}]` },
    { label: "oddFn(20):", value: `[${oddFn(20).join(", ")}]` },
  ]);

  renderResultList("results-main", [
    { label: "mainFunc(2, 5, cbPow):", value: String(mainFunc(2, 5, cbPow)) },
    { label: "mainFunc(2, 5, cbAdd):", value: String(mainFunc(2, 5, cbAdd)) },
    { label: "mainFunc(2, 5, 'not a func'):", value: String(mainFunc(2, 5, "not a func")) },
  ]);

  renderResultList("results-callbacks", [
    { label: "cbRandom(2, 5):", value: String(cbRandom(2, 5)) },
    { label: "cbPow(2, 5):", value: String(cbPow(2, 5)) },
    { label: "cbAdd(2, 5):", value: String(cbAdd(2, 5)) },
  ]);
});
