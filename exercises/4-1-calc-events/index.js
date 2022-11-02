import EventEmitter from 'events';
import add from './add.js';
import divide from './divide.js';
import multiply from './multiply.js';
import minus from './minus.js';

const mappingOperations = {
  add,
  multiply,
  divide,
  minus,
};

const [, , firstNumber, secondNumber, operation] = process.argv;

const emitter = new EventEmitter();

emitter.on(`${operation}`, (a, b) => {
  if (!a || !b) {
    return emitter.emit('result', 'переданные значения не являются числами');
  }
  if (!mappingOperations.hasOwnProperty(operation)) {
    return emitter.emit('result', 'такая операция в калькуляторе не реализована');
  }
  emitter.emit('result', mappingOperations[operation](a, b));
})

emitter.on('result', console.log);

emitter.emit(`${operation}`, +firstNumber, +secondNumber);
