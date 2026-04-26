console.log('JS #1. Домашнє завдання. Основи JavaScript: Працюємо зі змінними, типами даних');

/*
 * #1
 *
 * Створюю змінні зі значеннями.
 */

// ім'я змінної: myNum, значення: 10
let myNum = 10;

// ім'я змінної: myStr, значення: 'some string'
let myStr = 'some string';

// ім'я змінної: myBool, значення: true
let myBool = true;

// ім'я змінної: myArr, значення: 1, 2, 3, 4, 5
let myArr = [1, 2, 3, 4, 5];

// ім'я змінної: myObj, значення: first: 'First Name', last: 'Last Name'
let myObj = { first: 'First Name', last: 'Last Name' };

/*
 * #2
 *
 * Відформатовую ціле число, яке зберігається в змінній myNum, щоб отримати результат з 2 знаками після коми.
 * Результат зберігаю у змінній decimal2.
 */

// decimal2
let decimal2 = myNum.toFixed(2);

/*
 * #3
 *
 * Створюю змінну myBigInt і записую в неї число 123n (BigInt).
 * Потім збільшую його на 1 та записую в цю ж саму змінну.
 */

// myBigInt
let myBigInt = 123n;
myBigInt++;
