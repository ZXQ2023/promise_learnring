---
title: 异步 resolve/reject
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['async-resolve']

const examples = [
  {
    title: '示例一：异步 resolve',
    code: `
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('Async Success!');
  }, 100);
});
p.then((value) => {
  console.log('Fulfilled:', value);
});`
  },
  {
    title: '示例二：异步 reject',
    code: `
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('Async Error!');
  }, 100);
});
p.then(
  (value) => console.log('Fulfilled:', value),
  (reason) => console.log('Rejected:', reason)
);`
  },
  {
    title: '示例三：先注册 then，后 resolve',
    code: `
const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('Late!'), 50);
});
p.then((v) => console.log('then 1:', v));
p.then((v) => console.log('then 2:', v));`
  }
]
</script>

# 异步 resolve/reject

当 resolve/reject 是异步调用时，then 执行时状态还是 pending，需要用 #handlers 存储回调，等状态变更后再执行。

::: tip 本节要点
新增 `#handlers` 属性存储回调函数。then 中如果状态为 pending，将回调存入 #handlers。
#setState 在变更状态后调用 #handlers() 执行存储的回调。
:::

## #setState 变更

<CodeBlock code="#setState(state, value){
  if(this.#state !== PENDING) return;
  this.#state = state;
  this.#value = value;
  this.#handlers && this.#handlers();
}" title="#setState 变更" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['then']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
