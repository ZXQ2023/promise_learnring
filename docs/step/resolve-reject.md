---
title: 构建 resolve、reject
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['resolve-reject']

const runCode = code + `

const p = new MyPromise((resolve, reject) => {
  resolve('Success!');
});
const p2 = new MyPromise((resolve, reject) => {
  reject('Failure!');
});`
</script>

# 构建 resolve、reject

Promise 的核心是一个接收 executor 函数的构造函数，executor 立即执行并传入 resolve 和 reject 两个回调。

::: tip 本节要点
创建 MyPromise 类，接收 executor 函数，内部定义 resolve 和 reject 方法。
executor 会立即执行，resolve 和 reject 用于设置 Promise 的值。
:::

<CodeBlock :code="code" title="my-promise.js" />

::: info
本节所有代码都是新增内容，为后续知识点的基石。
:::

<ResultBlock :code="runCode" />
