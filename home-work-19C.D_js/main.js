const greetByNameSource = `function greetByName(msg, name) {
  return \`\${msg}, \${name}\`;
}`;

const getRandomIntSource = `function getRandomInt(min, max) {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}`;

const sumBigIntegersSource = `function sumBigIntegers(numStr1, numStr2) {
  return BigInt(numStr1) + BigInt(numStr2);
}`;

function greetByName(msg, name) {
  return `${msg}, ${name}`;
}

function getRandomInt(min, max) {
  const lowerBound = Math.ceil(Math.min(min, max));
  const upperBound = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound;
}

function sumBigIntegers(numStr1, numStr2) {
  return BigInt(numStr1) + BigInt(numStr2);
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
  document.getElementById("code-greet").textContent = greetByNameSource;
  document.getElementById("code-random").textContent = getRandomIntSource;
  document.getElementById("code-bigint").textContent = sumBigIntegersSource;

  renderResultList("results-greet", [
    { label: "Приклад 1:", value: greetByName("Hi", "John") },
    { label: "Приклад 2:", value: greetByName("Hey", "Bob") },
    { label: "Приклад 3:", value: greetByName("Hello", "Mary") },
  ]);

  renderResultList("results-random", [
    { label: "Від 1 до 10:", value: getRandomInt(1, 10) },
    { label: "Від 40 до 50:", value: getRandomInt(40, 50) },
    { label: "Від 1 до 100:", value: getRandomInt(1, 100) },
  ]);

  renderResultList("results-bigint", [
    {
      label: "Сума великих чисел:",
      value: `${sumBigIntegers("9007199254740991", "9007199254740991")}n`,
    },
    {
      label: "Ще один приклад:",
      value: `${sumBigIntegers("123456789123456789", "111111111111111111")}n`,
    },
  ]);
});
