---
title: 构建 resolve、reject
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['resolve-reject']

const examples = [
  {
    title: '示例一：resolve 成功',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('Success!');
});`
  },
  {
    title: '示例二：reject 失败',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Failure!');
});`
  },
  {
    title: '示例三：先 resolve 后 reject',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('First!');
  reject('Second!');
});`
  }
]
</script>

# 构建 resolve、reject

Promise 的核心是一个接收 executor 函数的构造函数，executor 立即执行并传入 resolve 和 reject 两个回调。

::: tip 本节要点
创建 MyPromise 类，接收 executor 函数，内部定义 resolve 和 reject 方法。
executor 会立即执行，resolve 和 reject 用于设置 Promise 的值。
:::

## 完整代码

<CodeBlock :code="code" title="my-promise.js" />

::: info
本节所有代码都是新增内容，为后续知识点的基石。
:::

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
