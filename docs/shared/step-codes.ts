export const stepCodes: Record<string, string> = {
  'resolve-reject': `
class MyPromise{
  value
  constructor(executor) {
    const resolve = (value) => {
      this.value = value;
      console.log('Resolved with value:', this.value);
    }
    const reject = (reason) => {
      this.value = reason;
      console.log('Rejected with reason:', this.value);
    }
    executor(resolve, reject);
  }
}`,

  'state': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  state = 'pending';
  value
  constructor(executor) {
    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.value = value;
      this.state = 'fulfilled';
    }
    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.value = reason;
      this.state = 'rejected';
    }
    executor(resolve, reject);
  }
}`,

  'try-catch': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  state = 'pending';
  value
  constructor(executor) {
    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.value = value;
      this.state = 'fulfilled';
    }
    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.value = reason;
      this.state = 'rejected';
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }
}`,

  'private-fields': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  constructor(executor) {
    const resolve = (value) => {
      if (this.state !== 'pending') return;
      this.value = value;
      this.state = 'fulfilled';
    }
    const reject = (reason) => {
      if (this.state !== 'pending') return;
      this.value = reason;
      this.state = 'rejected';
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }
}`,

  'set-state': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
  }
}`,

  'then': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      if(this.#state === FULFILLED){
        onFulfilled(this.#value);
      }else if(this.#state === REJECTED){
        onRejected(this.#value);
      }
    })
  }
}`,

  'async-resolve': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#handlers && this.#handlers();
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers = () => {
        if(this.#state === FULFILLED){
          onFulfilled(this.#value);
        }else {
          onRejected(this.#value);
        }
      }
      if(this.#state !== PENDING){
        this.#handlers();
      }
    })
  }
}`,

  'multiple-then': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    if(this.#state === PENDING) return;
    this.#handlers.forEach((handler) => handler());
    this.#handlers = [];
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        if(this.#state === FULFILLED){
          onFulfilled(this.#value);
        }else if(this.#state === REJECTED){
          onRejected(this.#value);
        }
      })
      this.#runHandlers();
    })
  }
}`,

  'chain-then': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    if(this.#state === PENDING) return;
    this.#handlers.forEach((handler) => handler());
    this.#handlers = [];
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }
}`,

  'microtask': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }
}`,

  'resolve-promise': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          if(isPromiseLike(returnValue)){
            returnValue.then(resolve, reject);
            return;
          }
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }
}`,

  'catch': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          if(isPromiseLike(returnValue)){
            returnValue.then(resolve, reject);
            return;
          }
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }

  catch(onRejected){
    return this.then(undefined, onRejected);
  }
}`,

  'finally': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          if(isPromiseLike(returnValue)){
            returnValue.then(resolve, reject);
            return;
          }
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }

  catch(onRejected){
    return this.then(undefined, onRejected);
  }

  finally(onFinally){
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    )
  }
}`,

  'static': `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}

class MyPromise{
  #state = PENDING;
  #value
  #handlers = []
  constructor(executor) {
    const resolve = (value) => {
      this.#setState(FULFILLED, value);
    }
    const reject = (reason) => {
      this.#setState(REJECTED, reason);
    }
    try{
      executor(resolve, reject);
    }
    catch(err){
      reject(err);
    }
  }

  #setState(state, value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#runHandlers();
  }

  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }

  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(() => {
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb === 'function' ? cb(this.#value) : this.#value;
          if(isPromiseLike(returnValue)){
            returnValue.then(resolve, reject);
            return;
          }
          resolve(returnValue);
        }catch(err){
          reject(err);
        }
      })
      this.#runHandlers();
    })
  }

  catch(onRejected){
    return this.then(undefined, onRejected);
  }

  finally(onFinally){
    return this.then(
      (value) => {
        onFinally();
        return value;
      },
      (reason) => {
        onFinally();
        throw reason;
      }
    )
  }

  static resolve(value){
    if(value instanceof MyPromise) return value;
    return new MyPromise((resolve, reject) => {
      if(isPromiseLike(value)){
        value.then(resolve, reject);
      }else{
        resolve(value);
      }
    });
  }

  static reject(reason){
    return new MyPromise((_, reject) => {
      reject(reason);
    });
  }

  static try(fn, ...args){
    return new MyPromise((resolve) => {
      resolve(fn(...args));
    });
  }

  static all(promises){
    promises = Array.from(promises);
    return new MyPromise((resolve, reject) => {
      const results = [];
      let count = 0;
      if(promises.length === 0){
        resolve(results);
        return;
      }
      promises.forEach((p, index) => {
        MyPromise.resolve(p).then((res) => {
          results[index] = res;
          count++;
          if(count === promises.length){
            resolve(results);
          }
        }, reject);
      });
    });
  }
}`,
}
