---
title: 异常抛出处理
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['try-catch']

const examples = [
  {
    title: '示例一：同步异常被捕获并自动 reject',
    code: `
const p = new MyPromise((resolve, reject) => {
  throw new Error('Something went wrong');
});
console.log('state:', p.state);
console.log('value:', p.value);`
  },
  {
    title: '示例二：正常 resolve 不受影响',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('All good!');
});
console.log('state:', p.state);
console.log('value:', p.value);`
  },
  {
    title: '示例三：异步异常无法被捕获',
    code: `
const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    throw new Error('Async error'); // 无法捕获
  }, 10);
});
console.log('state:', p.state);`
  }
]
</script>

# 异常抛出处理

用 try/catch 包裹 executor 的执行，同步异常会被捕获并自动调用 reject。

::: tip 本节要点
在 constructor 中，用 `try { executor(resolve, reject) } catch(err) { reject(err) }`
包裹 executor 调用。当 executor 内部抛出同步错误时，自动转为 reject 状态。
:::

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['state']" title="my-promise.js" />

::: warning 注意
异步错误（如 setTimeout 中的 throw）无法被捕获，属于正常行为。
:::

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
