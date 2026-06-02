---
title: then 异步执行
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['microtask']

const examples = [
  {
    title: '示例一：then 回调在同步代码之后执行',
    code: `
console.log('1. sync');
const p = new MyPromise((resolve) => resolve('3. microtask'));
p.then((v) => console.log(v));
console.log('2. sync');`
  },
  {
    title: '示例二：多个 then 的执行顺序',
    code: `
console.log('A');
const p1 = new MyPromise((resolve) => resolve('C'));
p1.then((v) => console.log(v));
console.log('B');
const p2 = new MyPromise((resolve) => resolve('D'));
p2.then((v) => console.log(v));
console.log('E');`
  },
  {
    title: '示例三：异步 resolve + 微任务',
    code: `
console.log('1. start');
const p = new MyPromise((resolve) => {
  setTimeout(() => {
    console.log('2. setTimeout resolve');
    resolve('3. then callback');
  }, 50);
});
p.then((v) => console.log(v));
console.log('4. end');`
  }
]
</script>

# then 异步执行

then 的回调应该异步执行（微任务），使用 `queueMicrotask` 确保 then 回调在当前同步代码之后执行。

::: tip 本节要点
将 `#runHandlers` 的执行用 `queueMicrotask` 包裹，
确保 then 的回调不会同步执行，而是注册为微任务。这样 Promise.then 的回调一定在同步代码之后执行。
:::

## #runHandlers 变更

<CodeBlock code="#runHandlers(){
  queueMicrotask(() => {
    if(this.#state === PENDING) return;
    this.#handlers.forEach((handler) => handler());
    this.#handlers = [];
  });
}" title="关键变更" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['chain-then']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
