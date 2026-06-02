---
title: 将属性改为私有
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['private-fields']

const examples = [
  {
    title: '示例一：正常创建 Promise',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('Success!');
});
console.log('Promise created successfully');`
  },
  {
    title: '示例二：reject 场景',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Failed!');
});
console.log('Promise rejected successfully');`
  },
  {
    title: '示例三：抛出异常被捕获',
    code: `
const p = new MyPromise((resolve, reject) => {
  throw new Error('Oops!');
});
console.log('Error caught by constructor');`
  }
]
</script>

# 将属性改为私有

使用 ES2022 私有字段语法 `#` 将 state 和 value 设为私有，外部无法直接访问。

::: tip 本节要点
将 `state` 改为 `#state`，将 `value` 改为 `#value`。
私有字段只能在类内部访问，确保状态不被外部篡改。
:::

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['try-catch']" title="my-promise.js" />

::: warning 注意
私有字段 `#field` 是 ES2022 特性，可能存在兼容性问题。
:::

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
