const {
  ageClassification,
  weekFn,
  ageExamples,
  weekExamples,
} = require('./main.js/main.js');

describe('ageClassification', () => {
  test.each(ageExamples)('повертає $expected для значення $value', ({ value, expected }) => {
    expect(ageClassification(value)).toBe(expected);
  });

  test.each([NaN, Infinity, -Infinity, '24', null, undefined])(
    'повертає null для некоректного значення %p',
    (value) => {
      expect(ageClassification(value)).toBeNull();
    },
  );
});

describe('weekFn', () => {
  test.each(weekExamples)('повертає $expected для значення $value', ({ value, expected }) => {
    expect(weekFn(value)).toBe(expected);
  });
});
