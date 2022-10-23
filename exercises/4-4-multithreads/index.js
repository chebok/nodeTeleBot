import { Worker } from 'worker_threads';
import perf_hooks from 'perf_hooks';

const generate = () => {
  const arr = [];
  for (let i = 1 ; i <= 30000000; i += 1) {
    arr.push(i);
  }
  return arr;
};

const numbers = generate();

function singleFunc(arr) {
  const result = arr.filter((n) => n % 3 === 0).length;
  return result;
}

async function workerFunc(arr) {
  const chunks = [arr.slice(0, 75000), arr.slice(75000, 150000), arr.slice(150000, 225000), arr.slice(225000)];
  console.log(performance.now());
  const promises = chunks.map(((chunk) => {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./exercises/4-4-multithreads/worker.js', {
        workerData: { chunk }
      });
      worker.on('message', (msg) => {
        resolve(msg);
      });
    })
  }));
  const result = await Promise.all(promises);
  console.log(performance.now());
  return result.reduce((acc, value) => acc + value, 0);
};


workerFunc = perf_hooks.performance.timerify(workerFunc);
singleFunc = perf_hooks.performance.timerify(singleFunc);

const performanceObserver = new perf_hooks.PerformanceObserver((items, observer) => {
  const entries = items.getEntries()
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}`);
  });
});
performanceObserver.observe({entryTypes: ['function']});

await workerFunc(numbers);
singleFunc(numbers);

// На моём ноутбуке без использования воркеров перебор массива происходит в 4-5  раз быстрее чем с воркерами.
// Возможно функцию для воркеров писать надо по-другому.
