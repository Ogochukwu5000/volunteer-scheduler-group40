const createTimeout = (ms) => {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Operation timed out after ${ms} ms`));
      }, ms);
    });
  };
  
  module.exports = createTimeout;