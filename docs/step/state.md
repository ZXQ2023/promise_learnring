---
title: 状态封装
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['state']

const examples = [
  {
    title: '示例一：resolve 后状态变为 fulfilled',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('Success!');
});
console.log('state:', p.state);`
  },
  {
    title: '示例二：reject 后状态变为 rejected',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Error!');
});
console.log('state:', p.state);`
  },
  {
    title: '示例三：状态只能变更一次',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('First');
  reject('Second'); // 不会生效
});
console.log('state:', p.state);
console.log('value:', p.value);`
  }
]
</script>

# 状态封装

Promise 有三种状态：pending、fulfilled、rejected。状态一旦变更就不可逆转，且增加异常捕获。

::: tip 本节要点
新增状态常量 PENDING / FULFILLED / REJECTED。resolve 和 reject 中加入状态守卫，确保只能变更一次。
同时用 try/catch 包裹 executor，捕获同步异常。
:::

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['resolve-reject']" title="my-promise.js" />

::: warning 注意
异步错误无法被 try/catch 捕获。例如 setTimeout 中抛出的错误不会被捕获，这是正常行为。
:::

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
