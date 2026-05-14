"use strict";

console.log("#24. JavaScript homework: method chaining, arrays and dates");

function sumArray(numbers) {
  if (!Array.isArray(numbers)) {
    return 0;
  }

  return numbers.reduce((sum, number) => sum + number, 0);
}

function doubleArrayElements(numbers) {
  if (!Array.isArray(numbers)) {
    return [];
  }

  return numbers.map((number) => number * 2);
}

class SkillsManager {
  constructor() {
    this.skills = [];
  }

  addSkill(skill) {
    if (typeof skill !== "string") {
      return null;
    }

    const normalizedSkill = skill.trim();

    if (normalizedSkill.length < 2) {
      return null;
    }

    this.skills.push(normalizedSkill);

    return normalizedSkill;
  }

  getAllSkills() {
    return [...this.skills];
  }
}

const createDateFromInput = (initialDate) => {
  if (initialDate instanceof Date) {
    return new Date(initialDate.getTime());
  }

  if (typeof initialDate === "string" && initialDate.trim()) {
    const normalizedDate = initialDate.includes("T")
      ? initialDate
      : `${initialDate}T00:00:00`;

    return new Date(normalizedDate);
  }

  return new Date(initialDate);
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function DateCalculator(initialDate) {
  const parsedDate = createDateFromInput(initialDate);

  this.currentDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  this.addDays = function(days) {
    if (Number.isFinite(days)) {
      this.currentDate.setDate(this.currentDate.getDate() + days);
    }

    return this;
  };

  this.subtractDays = function(days) {
    if (Number.isFinite(days)) {
      this.currentDate.setDate(this.currentDate.getDate() - days);
    }

    return this;
  };

  this.getResult = function() {
    return formatDate(this.currentDate);
  };
}

const sourceExamples = {
  sumArray: `function sumArray(numbers) {
  if (!Array.isArray(numbers)) {
    return 0;
  }

  return numbers.reduce((sum, number) => sum + number, 0);
}`,
  doubleArrayElements: `function doubleArrayElements(numbers) {
  if (!Array.isArray(numbers)) {
    return [];
  }

  return numbers.map((number) => number * 2);
}`,
  skillsManager: `class SkillsManager {
  constructor() {
    this.skills = [];
  }

  addSkill(skill) {
    if (typeof skill !== "string") {
      return null;
    }

    const normalizedSkill = skill.trim();

    if (normalizedSkill.length < 2) {
      return null;
    }

    this.skills.push(normalizedSkill);

    return normalizedSkill;
  }

  getAllSkills() {
    return [...this.skills];
  }
}`,
  dateCalculator: `function DateCalculator(initialDate) {
  const parsedDate = createDateFromInput(initialDate);

  this.currentDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

  this.addDays = function(days) {
    if (Number.isFinite(days)) {
      this.currentDate.setDate(this.currentDate.getDate() + days);
    }

    return this;
  };

  this.subtractDays = function(days) {
    if (Number.isFinite(days)) {
      this.currentDate.setDate(this.currentDate.getDate() - days);
    }

    return this;
  };

  this.getResult = function() {
    return formatDate(this.currentDate);
  };
}`,
  methodChaining: `const processedNumbers = numbers
  .filter((number) => number > 5)
  .sort((a, b) => a - b)
  .map((number) => number * 2)
  .reduce((sum, number) => sum + number, 0);`,
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatArray = (items) => `[${items.join(", ")}]`;

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

const renderSkillBadges = (targetId, skills) => {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = skills
    .map((skill) => `<span class="skill-badge">${escapeHtml(skill)}</span>`)
    .join("");
};

const renderDateTimeline = (targetId, steps) => {
  const container = document.getElementById(targetId);

  if (!container) {
    return;
  }

  container.innerHTML = steps
    .map(
      ({ label, value }) => `
        <li class="date-timeline__item">
          <span class="date-timeline__label">${escapeHtml(label)}</span>
          <time class="date-timeline__value" datetime="${escapeHtml(value)}">${escapeHtml(value)}</time>
        </li>
      `
    )
    .join("");
};

const createMethodChainingDemo = () => {
  const numbers = [1, 6, 3, 8, 4, 2, 7];
  const filteredSortedDoubled = numbers
    .filter((number) => number > 5)
    .sort((a, b) => a - b)
    .map((number) => number * 2);

  return {
    numbers,
    filteredSortedDoubled,
    total: sumArray(filteredSortedDoubled),
  };
};

const createSkillsDemo = () => {
  const skillsManager = new SkillsManager();

  const addedSkills = [
    skillsManager.addSkill("JavaScript"),
    skillsManager.addSkill("CSS"),
    skillsManager.addSkill("Array"),
    skillsManager.addSkill("Date"),
  ];
  const invalidSkill = skillsManager.addSkill("A");

  return {
    addedSkills,
    invalidSkill,
    allSkills: skillsManager.getAllSkills(),
  };
};

const createDateDemo = () => {
  const dateCalculator = new DateCalculator("2023-01-01");
  const steps = [{ label: "Початкова дата", value: dateCalculator.getResult() }];

  dateCalculator.addDays(5);
  steps.push({ label: "Після addDays(5)", value: dateCalculator.getResult() });

  dateCalculator.subtractDays(3);
  steps.push({ label: "Після subtractDays(3)", value: dateCalculator.getResult() });

  dateCalculator.addDays(10).subtractDays(2);
  steps.push({
    label: "Після addDays(10).subtractDays(2)",
    value: dateCalculator.getResult(),
  });

  return steps;
};

const renderHomework = () => {
  const sumNumbers = [1, 2, 3, 4, 5];
  const doubledNumbers = [3, 6, 9, 12];
  const chainingDemo = createMethodChainingDemo();
  const skillsDemo = createSkillsDemo();

  setTextContent("sumArrayCode", sourceExamples.sumArray);
  setTextContent("doubleArrayElementsCode", sourceExamples.doubleArrayElements);
  setTextContent("skillsManagerCode", sourceExamples.skillsManager);
  setTextContent("dateCalculatorCode", sourceExamples.dateCalculator);
  setTextContent("methodChainingCode", sourceExamples.methodChaining);

  renderResultList("sumArrayResults", [
    { label: "Масив", value: formatArray(sumNumbers) },
    { label: "sumArray(numbers)", value: sumArray(sumNumbers) },
    { label: "sumArray([])", value: sumArray([]) },
  ]);

  renderResultList("doubleArrayElementsResults", [
    { label: "Початковий масив", value: formatArray(doubledNumbers) },
    {
      label: "doubleArrayElements(numbers)",
      value: formatArray(doubleArrayElements(doubledNumbers)),
    },
  ]);

  renderResultList("skillsManagerResults", [
    { label: "Додані навички", value: formatArray(skillsDemo.addedSkills) },
    { label: "skillsManager.addSkill('A')", value: skillsDemo.invalidSkill },
    { label: "skillsManager.getAllSkills()", value: formatArray(skillsDemo.allSkills) },
  ]);
  renderSkillBadges("skillsList", skillsDemo.allSkills);

  renderDateTimeline("dateCalculatorTimeline", createDateDemo());

  renderResultList("methodChainingResults", [
    { label: "Початковий масив", value: formatArray(chainingDemo.numbers) },
    {
      label: "Після filter().sort().map()",
      value: formatArray(chainingDemo.filteredSortedDoubled),
    },
    { label: "Фінальна сума через reduce()", value: chainingDemo.total },
  ]);
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", renderHomework);
}

export { doubleArrayElements, sumArray, SkillsManager, DateCalculator };
