---
title: 多次 then 调用
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['multiple-then']

const examples = [
  {
    title: '示例一：异步 resolve 多次 then',
    code: `
const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('Hi!'), 100);
});
p.then((v) => console.log('then 1:', v));
p.then((v) => console.log('then 2:', v));
p.then((v) => console.log('then 3:', v));`
  },
  {
    title: '示例二：同步 resolve 多次 then',
    code: `
const p = new MyPromise((resolve) => {
  resolve('Sync!');
});
p.then((v) => console.log('then 1:', v));
p.then((v) => console.log('then 2:', v));`
  },
  {
    title: '示例三：异步 reject 多次 then',
    code: `
const p = new MyPromise((_, reject) => {
  setTimeout(() => reject('Boom!'), 100);
});
p.then(
  (v) => console.log('Fulfilled:', v),
  (r) => console.log('Rejected:', r)
);
p.then(
  (v) => console.log('Fulfilled2:', v),
  (r) => console.log('Rejected2:', r)
);`
  }
]
</script>

# 多次 then 调用

同一个 Promise 可以调用多次 then，每次的回调都应该被执行。将 #handlers 改为数组，新增 #runHandlers 方法来批量执行。

::: tip 本节要点
之前的 #handlers 是单个函数，多次 then 会覆盖。现在改为数组 `#handlers = []`，
每次 then 将回调 push 进数组。新增 `#runHandlers` 方法批量执行并清空。
:::

## 新增 #runHandlers 方法

<CodeBlock code="#runHandlers(){
  if(this.#state === PENDING) return;
  this.#handlers.forEach((handler) => handler());
  this.#handlers = [];
}" title="新增方法" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['async-resolve']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
