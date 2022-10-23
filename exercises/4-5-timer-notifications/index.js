import notifier from 'node-notifier';

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
setTimeout(() => {
  console.log('таймер сработал');
  notifier.notify(
    {
      title: 'My awesome title',
      message: 'Hello from node, Mr. User!',
      sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },)
}, resultMs);