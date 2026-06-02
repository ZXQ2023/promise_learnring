---
title: 链式调用 then
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['chain-then']

const runCode = code + `

const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('Success!'), 100);
});
p.then((value) => {
  console.log('success', value);
  return 2;
}).then((value) => {
  console.log('success2', value);
});`
</script>

# 链式调用 then

then 返回新的 MyPromise，回调的返回值作为下一个 then 的参数，实现链式调用。同时处理回调不是函数的情况（值透传）。

::: tip 本节要点
then 方法中的回调执行后，将返回值通过 `resolve(returnValue)` 传给下一个 Promise。
如果回调不是函数，则直接透传当前值。同时用 try/catch 包裹，异常通过 reject 传递。
:::

<CodeBlock :code="code" :previous-code="stepCodes['multiple-then']" title="my-promise.js" />

<ResultBlock :code="runCode" />
