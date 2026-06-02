---
title: Then 方法
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['then']

const examples = [
  {
    title: '示例一：同步 resolve + then',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('Hello Promise!');
});
p.then((value) => {
  console.log('Fulfilled:', value);
});`
  },
  {
    title: '示例二：同步 reject + then',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Something wrong');
});
p.then(
  (value) => console.log('Fulfilled:', value),
  (reason) => console.log('Rejected:', reason)
);`
  },
  {
    title: '示例三：then 返回新 Promise',
    code: `
const p = new MyPromise((resolve) => {
  resolve('Hello');
});
const p2 = p.then((value) => {
  console.log('Got:', value);
  return value + ' World';
});
console.log('p2 is MyPromise:', p2 instanceof MyPromise);`
  }
]
</script>

# Then 方法

实现 `then` 方法，它返回一个新的 MyPromise，根据当前状态执行对应的回调。

::: tip 本节要点
then 方法接收 onFulfilled 和 onRejected 两个回调。如果状态已确定，立即执行对应回调。
此时只能处理同步 resolve/reject 的情况，异步场景在下一节解决。
:::

## 新增 then 方法

<CodeBlock code="then(onFulfilled, onRejected){
  return new MyPromise((resolve, reject) => {
    if(this.#state === FULFILLED){
      onFulfilled(this.#value);
    }else if(this.#state === REJECTED){
      onRejected(this.#value);
    }
  })
}" title="关键变更" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['set-state']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
