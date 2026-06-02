---
title: catch 实现
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['catch']

const runCode = code + `

const p = new MyPromise((resolve, reject) => {
  reject('Something went wrong');
});
p.catch((err) => console.log('Caught:', err));`
</script>

# catch 实现

catch 是 then 的语法糖，等价于 `then(undefined, onRejected)`。不属于 Promise A+ 规范，是 ES6 的扩展。

::: tip 本节要点
新增 `catch(onRejected)` 方法，内部调用 `this.then(undefined, onRejected)`。
这是 ES6 规范的内容，不是 Promise A+ 规范的一部分。
:::

## 新增 catch 方法

<CodeBlock code="catch(onRejected){
  return this.then(undefined, onRejected);
}" title="新增方法" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['resolve-promise']" title="my-promise.js" />

<ResultBlock :code="runCode" />
