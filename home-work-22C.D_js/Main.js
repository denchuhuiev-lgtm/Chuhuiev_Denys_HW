"use strict";

console.log("#22. JavaScript homework: closures, recursion, apply and bind");

const counter = (() => {
  let currentValue = 0;

  return (startValue) => {
    if (typeof startValue === "number") {
      currentValue = startValue;

      if (startValue === 0) {
        return currentValue;
      }

      return currentValue++;
    }

    return currentValue++;
  };
})();

const counterFactory = (() => {
  let currentValue = 0;

  return {
    value(newValue) {
      if (typeof newValue === "number") {
        currentValue = newValue;
      }

      return currentValue;
    },
    increment() {
      currentValue += 1;

      return currentValue;
    },
    decrement() {
      currentValue -= 1;

      return currentValue;
    },
  };
})();

const myPrint = (a, b, res) => `${a}^${b}=${res}`;

const getRecursivePow = (base, exponent) => {
  if (exponent === 0) {
    return 1;
  }

  if (exponent < 0) {
    return 1 / getRecursivePow(base, -exponent);
  }

  return base * getRecursivePow(base, exponent - 1);
};

const myPow = (a, b, printCallback) => {
  if (typeof printCallback !== "function") {
    throw new TypeError("Третім аргументом потрібно передати callback-функцію.");
  }

  const result = getRecursivePow(a, b);

  return printCallback(a, b, result);
};

const myMax = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Функція myMax очікує непорожній числовий масив.");
  }

  return Math.max.apply(null, arr);
};

const myMul = (a, b) => a * b;

const myDouble = myMul.bind(null, 2);

const myTriple = myMul.bind(null, 3);

const taskSources = {
  counter: `const counter = (() => {
  let currentValue = 0;

  return (startValue) => {
    if (typeof startValue === "number") {
      currentValue = startValue;

      if (startValue === 0) {
        return currentValue;
      }

      return currentValue++;
    }

    return currentValue++;
  };
})();`,
  counterFactory: `const counterFactory = (() => {
  let currentValue = 0;

  return {
    value(newValue) {
      if (typeof newValue === "number") {
        currentValue = newValue;
      }

      return currentValue;
    },
    increment() {
      currentValue += 1;

      return currentValue;
    },
    decrement() {
      currentValue -= 1;

      return currentValue;
    },
  };
})();`,
  myPow: `const myPrint = (a, b, res) => \`\${a}^\${b}=\${res}\`;

const getRecursivePow = (base, exponent) => {
  if (exponent === 0) {
    return 1;
  }

  if (exponent < 0) {
    return 1 / getRecursivePow(base, -exponent);
  }

  return base * getRecursivePow(base, exponent - 1);
};

const myPow = (a, b, printCallback) => {
  if (typeof printCallback !== "function") {
    throw new TypeError("Третім аргументом потрібно передати callback-функцію.");
  }

  const result = getRecursivePow(a, b);

  return printCallback(a, b, result);
};`,
  myMax: `const myMax = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("Функція myMax очікує непорожній числовий масив.");
  }

  return Math.max.apply(null, arr);
};`,
  bindTasks: `const myMul = (a, b) => a * b;

const myDouble = myMul.bind(null, 2);

const myTriple = myMul.bind(null, 3);`,
};

const createCounterDemo = () => {
  const demoCounter = (() => {
    let currentValue = 0;

    return (startValue) => {
      if (typeof startValue === "number") {
        currentValue = startValue;

        if (startValue === 0) {
          return currentValue;
        }

        return currentValue++;
      }

      return currentValue++;
    };
  })();

  const calls = [
    "counter()",
    "counter()",
    "counter(100)",
    "counter()",
    "counter()",
    "counter(500)",
    "counter()",
    "counter()",
    "counter(0)",
    "counter()",
    "counter()",
  ];

  const values = [
    demoCounter(),
    demoCounter(),
    demoCounter(100),
    demoCounter(),
    demoCounter(),
    demoCounter(500),
    demoCounter(),
    demoCounter(),
    demoCounter(0),
    demoCounter(),
    demoCounter(),
  ];

  return calls.map((label, index) => ({
    label,
    value: String(values[index]),
  }));
};

const createCounterFactoryDemo = () => {
  const demoFactory = (() => {
    let currentValue = 0;

    return {
      value(newValue) {
        if (typeof newValue === "number") {
          currentValue = newValue;
        }

        return currentValue;
      },
      increment() {
        currentValue += 1;

        return currentValue;
      },
      decrement() {
        currentValue -= 1;

        return currentValue;
      },
    };
  })();

  const steps = [
    { label: "counterFactory.value()", value: demoFactory.value() },
  ];

  demoFactory.increment();
  demoFactory.increment();
  demoFactory.increment();
  steps.push({ label: "Після трьох increment()", value: demoFactory.value() });

  demoFactory.decrement();
  demoFactory.decrement();
  steps.push({ label: "Після двох decrement()", value: demoFactory.value() });
  steps.push({ label: "counterFactory.value(100)", value: demoFactory.value(100) });

  demoFactory.decrement();
  steps.push({ label: "Після decrement()", value: demoFactory.value() });
  steps.push({ label: "counterFactory.value(200)", value: demoFactory.value(200) });

  demoFactory.increment();
  steps.push({ label: "Після increment()", value: demoFactory.value() });

  return steps.map(({ label, value }) => ({
    label,
    value: String(value),
  }));
};

const createErrorDemo = () => {
  try {
    myMax([]);
  } catch (error) {
    return error.message;
  } finally {
    console.log("myMax validation demo finished");
  }

  return "Помилка не виникла.";
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
          <span class="result-card__label">${label}</span>
          <span class="result-card__value">${value}</span>
        </div>
      `
    )
    .join("");
};

const setTextContent = (targetId, value) => {
  const element = document.getElementById(targetId);

  if (element) {
    element.textContent = value;
  }
};

const renderHomework = () => {
  const list = [12, 23, 100, 34, 56, 9, 233];

  setTextContent("counterCode", taskSources.counter);
  setTextContent("counterFactoryCode", taskSources.counterFactory);
  setTextContent("myPowCode", taskSources.myPow);
  setTextContent("myMaxCode", taskSources.myMax);
  setTextContent("bindTasksCode", taskSources.bindTasks);

  renderResultList("counterResults", createCounterDemo());
  renderResultList("counterFactoryResults", createCounterFactoryDemo());
  renderResultList("myPowResults", [
    { label: "myPow(3, 4, myPrint)", value: myPow(3, 4, myPrint) },
    { label: "myPow(2, 3, myPrint)", value: myPow(2, 3, myPrint) },
    { label: "myPow(2, 0, myPrint)", value: myPow(2, 0, myPrint) },
    { label: "myPow(2, -2, myPrint)", value: myPow(2, -2, myPrint) },
  ]);
  renderResultList("myMaxResults", [
    { label: "Масив", value: `[${list.join(", ")}]` },
    { label: "myMax(list)", value: String(myMax(list)) },
    { label: "Приклад try...catch", value: createErrorDemo() },
  ]);
  renderResultList("bindTasksResults", [
    { label: "myMul(6, 7)", value: String(myMul(6, 7)) },
    { label: "myDouble(3)", value: String(myDouble(3)) },
    { label: "myDouble(4)", value: String(myDouble(4)) },
    { label: "myTriple(3)", value: String(myTriple(3)) },
    { label: "myTriple(5)", value: String(myTriple(5)) },
  ]);
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderHomework);
}

export { counter, counterFactory, myPow, myMax, myMul, myDouble, myTriple };
