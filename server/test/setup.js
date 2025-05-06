import { webcrypto } from 'node:crypto';

// Polyfill crypto for Node.js environment
if (!global.crypto) {
  global.crypto = webcrypto;
}

// Ensure getRandomValues is available
if (!global.crypto.getRandomValues) {
  const getRandomValues = (array) => {
    const bytes = webcrypto.getRandomValues(new Uint8Array(array.length));
    array.set(bytes);
    return array;
  };
  
  Object.defineProperty(global.crypto, 'getRandomValues', {
    value: getRandomValues,
    writable: true,
    configurable: true
  });
}

// Add any other global test setup here
process.env.NODE_ENV = 'test'; 