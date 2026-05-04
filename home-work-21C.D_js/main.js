import { curriedAdd } from "./base (1)/curriedAdd.js";
import { curriedDomain } from "./base (1)/curriedDomain.js";
import { originalFunction, modifyFunction } from "./base (1)/modifyFunction.js";
import { outerFunction } from "./base (1)/nestedFunctions.js";

const curriedAddSource = `function curriedAdd(a) {
  return function addSecond(b) {
    return function addThird(c) {
      return a + b + c;
    };
  };
}`;

const curriedDomainSource = `function curriedDomain(protocol) {
  return function setDomainName(domainName) {
    return function setTld(tld) {
      return \`\${protocol}://\${domainName}.\${tld}\`;
    };
  };
}`;

const modifyFunctionSource = `function originalFunction(num) {
  return num * num;
}

function modifyFunction(originalFunc, multiplier) {
  return function modifiedFunction(num) {
    return originalFunc(num) * multiplier;
  };
}`;

const outerFunctionSource = `function outerFunction(arg1) {
  function innerFunction(arg2) {
    function deepInnerFunction(arg3) {
      return arg1 * arg2 * arg3;
    }

    return deepInnerFunction;
  }

  return innerFunction;
}`;

function renderResultList(targetId, items) {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = items
    .map(
      ({ label, value }) => `
        <div class="result-item">
          <span class="result-item__label">${label}</span>
          <span>${value}</span>
        </div>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("curriedAddCode").textContent = curriedAddSource;
  document.getElementById("curriedDomainCode").textContent = curriedDomainSource;
  document.getElementById("modifyFunctionCode").textContent = modifyFunctionSource;
  document.getElementById("outerFunctionCode").textContent = outerFunctionSource;

  const addFirst = curriedAdd(1);
  const addSecond = addFirst(2);

  renderResultList("curriedAddResults", [
    { label: "curriedAdd(1)(2)(3)", value: String(curriedAdd(1)(2)(3)) },
    { label: "Покроковий виклик", value: `addFirst(2)(3) = ${addFirst(2)(3)}` },
    { label: "Окремий третій крок", value: `addSecond(3) = ${addSecond(3)}` },
  ]);

  const protocolSetter = curriedDomain("https");
  const domainNameSetter = protocolSetter("example");

  renderResultList("curriedDomainResults", [
    {
      label: "curriedDomain('https')('example')('com')",
      value: curriedDomain("https")("example")("com"),
    },
    {
      label: "Покроковий виклик",
      value: `domainNameSetter('org') = ${domainNameSetter("org")}`,
    },
    {
      label: "Інший приклад",
      value: curriedDomain("http")("mywebsite")("net"),
    },
  ]);

  const modifiedFunc = modifyFunction(originalFunction, 3);

  renderResultList("modifyFunctionResults", [
    { label: "originalFunction(4)", value: String(originalFunction(4)) },
    { label: "modifiedFunc(4)", value: String(modifiedFunc(4)) },
    { label: "modifiedFunc(6)", value: String(modifiedFunc(6)) },
  ]);

  const firstStep = outerFunction(2);
  const secondStep = firstStep(3);

  renderResultList("outerFunctionResults", [
    { label: "outerFunction(2)(3)(4)", value: String(outerFunction(2)(3)(4)) },
    { label: "Проміжний крок", value: `secondStep(5) = ${secondStep(5)}` },
    { label: "Інший приклад", value: String(outerFunction(4)(5)(2)) },
  ]);
});
