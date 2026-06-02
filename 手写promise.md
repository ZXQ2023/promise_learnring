[[手写_promise（过程梳理版）]]
A+规范
https://promisesaplus.com/
# 初始化构造函数

## 构建resolve、reject
```js
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
}


const p = new MyPromise((resolve, reject) => {
  resolve('Success!');
  reject('Failure!');
});
```

## 状态封装
```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
```

## 异常抛出处理


> [!info]
> 关键代码
> ```js
> try{
  executor(resolve, reject);
}
catch(err){
  reject(err);
} 

>[!warning]
>异步错误捕获不到，属于正常
>
>```js
>const p = new MyPromise((resolve, reject) => {
>  // resolve('Success!');
>  setTimeout(() => {
>    throw new Error('Something went wrong');
>  })
>});
>```



```js
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
}


const p = new MyPromise((resolve, reject) => {
  // resolve('Success!');
  throw new Error('Something went wrong');
});

console.log(p.state); // 'rejected'

```


## 将属性改为私有
>[!warning]
>可能存在兼容性问题

```js
#state = 'pending';
#value
```

## 状态变更封装
```js
  #setState(state,value){
    if(this.#state !== 'pending') return;
    this.#state = state;
    this.#value = value;
  }
  ```

```js

const PENDING = 'pending';
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

  #setState(state,value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
  }
}


const p = new MyPromise((resolve, reject) => {
  // resolve('Success!');
    throw new Error('Something went wrong');
  
});
```


# Then方法
```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      if(this.#state === FULFILLED){
        onFulfilled(this.#value);
      }else if(this.#state === REJECTED){
        onRejected(this.#value);
      }
    })
  }
  ```

### 异步resolve或reject
此时状态还是pending
```js
#handlers  
  ```

```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      if(this.#state === FULFILLED){
        onFulfilled(this.#value);
      }else if(this.#state === REJECTED){
        onRejected(this.#value);
      }else {
        this.#handlers = ()=>{
          if(this.#state === FULFILLED){
            onFulfilled(this.#value);
          }else {
            onRejected(this.#value);
          }
        }
      }
    })
  }

```

```js

  #setState(state,value){
    if(this.#state !== PENDING) return;
    this.#state = state;
    this.#value = value;
    this.#handlers && this.#handlers();
  }
  
```

### 重构一下then方法
```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers = ()=>{
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
  ```

### 多次then()调用，handlers 会被重置
```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(()=>{
        if(this.#state === FULFILLED){
          onFulfilled(this.#value);
        }else if(this.#state === REJECTED){
          onRejected(this.#value);
        }
      })
      this.#runHandlers();

    })
  }
  
  ```

```js
  #runHandlers(){
    if(this.#state === PENDING) return;
    this.#handlers.forEach((handler) => handler());
    this.#handlers = [];
  }

```

### 链式调用.then方法
```js
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Success!');
  }, 1000);
  // reject('Failed!');
})

p.then((value) => {
  console.log("success",value);
  return 2
}).then((value) => {
  console.log("success2",value);
})
```

```js
then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(()=>{
        try{
          if(this.#state === FULFILLED){
            const res = onFulfilled(this.#value);
            resolve(res);
          }else if(this.#state === REJECTED){
            const res = onRejected(this.#value);
            resolve(res);
          }
        }catch(err){
          reject(err);
        }
        
      })
      this.#runHandlers();
    })
  }
  ```

封装一下
```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(()=>{
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = cb(this.#value);
          resolve(returnValue);
         
        }catch(err){
          reject(err);
        }
        
      })
      this.#runHandlers();
    })
  }
  
  ```
![[Pasted image 20260106162100.png]]
```js
  then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(()=>{
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb==='function' ? cb(this.#value) : this.#value;
          resolve(returnValue);
         
        }catch(err){
          reject(err);
        }
        
      })
      this.#runHandlers();
    })
  }
  ```

# then 应该是异步执行，前面的结果为同步的
使用queueMicrotask注册一个微任务
>[!warning]
>queueMicrotas会有兼容性问题，这里暂不关心

```js
  #runHandlers(){
    queueMicrotask(() => {
      if(this.#state === PENDING) return;
      this.#handlers.forEach((handler) => handler());
      this.#handlers = [];
    });
  }
  ```

# then嵌套promise
```js
const p = new MyPromise((resolve, reject) => {
    resolve('Success!');
})

const p2 = p.then((value) => {
  return new MyPromise((resolve, reject) => {
    resolve(value + ' from p2');
  })
})


p2.then((value)=>{
  console.log("p2 success",value);
})
```

```js
function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}
```

```js
 then(onFulfilled, onRejected){
    return new MyPromise((resolve, reject) => {
      this.#handlers.push(()=>{
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb==='function' ? cb(this.#value) : this.#value;
          if (isPromiseLike(returnValue)){ //判断是不是符合promise A+规范
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
  ```

#   以下所有都不属于promise A+规范，属于es6的内容

## catch的实现
catch不属于A+规范的内容
```js
  catch(onRejected){
    return this.then(undefined, onRejected);
  }

```


## finally实现
```js
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
  ```


## 静态方法

### static resolve
```js
  static resolve(value){
    if(value instanceof Promise){
      return value;
    }
    return new Promise((resolve,reject) => {
      if(isPromiseLike(value)){
        value.then(resolve,reject);
      }else{
        resolve(value);
      }
    });
  }
  
  ```

### static reject
```js
  static reject(reason){
    return new Promise((_,reject) => {
      reject(reason);
    });
  }
  
  ```
### static try
```js
  static try(fn,...args){
    return new Promise((resolve,reject) => {
      resolve(fn(...args));
    });
  }
  ```

### static all
```js
static all(promises){
    promises = Array.from(promises);
    return new MyPromise((resolve,reject) => {
      const results = [];
      let count = 0
      if (promises.length === 0){
        resolve(results);
        return;
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p).then((res)=>{
          results[index] = res;
          count++;

          if (count === promises.length){
            resolve(results);
          }
        },reject)
      })
    })

  }
  ```


# 完整代码
```js

const PENDING = 'pending';
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

  #setState(state,value){
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
      this.#handlers.push(()=>{
        try{
          const cb = this.#state === FULFILLED ? onFulfilled : onRejected;
          const returnValue = typeof cb==='function' ? cb(this.#value) : this.#value;
          if (isPromiseLike(returnValue)){ //判断是不是符合promise A+规范
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
    if(value instanceof Promise){
      return value;
    }
    return new Promise((resolve,reject) => {
      if(isPromiseLike(value)){
        value.then(resolve,reject);
      }else{
        resolve(value);
      }
    });
  }

  static reject(reason){
    return new Promise((_,reject) => {
      reject(reason);
    });
  }

  static try(fn,...args){
    return new Promise((resolve,reject) => {
      resolve(fn(...args));
    });
  }

  static all(promises){
    promises = Array.from(promises);
    return new MyPromise((resolve,reject) => {
      const results = [];
      let count = 0
      if (promises.length === 0){
        resolve(results);
        return;
      }

      promises.forEach((p, index) => {
        MyPromise.resolve(p).then((res)=>{
          results[index] = res;
          count++;

          if (count === promises.length){
            resolve(results);
          }
        },reject)
      })
    })

  }
}


MyPromise.reject(1).then(null, (err) => {
  console.log('Rejected with reason:', err);
});



```