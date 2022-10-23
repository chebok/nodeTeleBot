import { parentPort, workerData }  from 'worker_threads';


parentPort.postMessage(workerData.chunk.filter((n) => n % 3 === 0).length);