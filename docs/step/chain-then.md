---
title: 链式调用 then
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['chain-then']

const examples = [
  {
    title: '示例一：then 返回值传递给下一个 then',
    code: `
const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('Success!'), 100);
});
p.then((value) => {
  console.log('step 1:', value);
  return 2;
}).then((value) => {
  console.log('step 2:', value);
});`
  },
  {
    title: '示例二：值透传（回调不是函数）',
    code: `
const p = new MyPromise((resolve) => {
  resolve('Hello');
});
p.then(null).then((v) => {
  console.log('passthrough:', v);
});`
  },
  {
    title: '示例三：链中异常传递',
    code: `
const p = new MyPromise((resolve) => {
  resolve('ok');
});
p.then((v) => {
  console.log('step 1:', v);
  throw new Error('chain error');
}).then(
  (v) => console.log('step 2 fulfilled:', v),
  (e) => console.log('step 2 rejected:', e.message)
);`
  }
]
</script>

# 链式调用 then

then 返回新的 MyPromise，回调的返回值作为下一个 then 的参数，实现链式调用。同时处理回调不是函数的情况（值透传）。

::: tip 本节要点
then 方法中的回调执行后，将返回值通过 `resolve(returnValue)` 传给下一个 Promise。
如果回调不是函数，则直接透传当前值。同时用 try/catch 包裹，异常通过 reject 传递。
:::

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['multiple-then']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
