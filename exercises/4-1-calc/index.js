import add from './add.js';
import divide from './divide.js';
import multiply from './multiply.js';
import minus from './minus.js';

const [, , firstNumber, secondNumber, operation] = process.argv;
const mappingOperations = {
  add,
  multiply,
  divide,
  minus,
};
const result = mappingOperations[operation](+firstNumber, +secondNumber);
console.log(result);