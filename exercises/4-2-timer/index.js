const [, , ...rest] = process.argv;

const unitMapping = {
  h: (count) => count * 3600 * 1000,
  m: (count) => count * 60 * 1000,
  s: (count) => count * 1000,
}
const resultMs = rest.reduce((acc, value) => {
  if (+value) {
    return acc + Number(value);
  }
  const count = value.split('').slice(0, -1);
  const unit = value.split('').at(-1);
  return acc + unitMapping[unit](+count);
}, 0);
// Принимает аргументы типа *h *m *s и абсолютное значение в миллисекундах в любом порядке и наборе.
// Считает общее количество в миллисекундах и вызывает таймер
setTimeout(() => console.log('таймер сработал'), resultMs);