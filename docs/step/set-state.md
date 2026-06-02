---
title: 状态变更封装
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['set-state']

const examples = [
  {
    title: '示例一：resolve 后无法再 reject',
    code: `
const p = new MyPromise((resolve, reject) => {
  resolve('First');
  reject('Second'); // 不会执行
});
console.log('Promise created');`
  },
  {
    title: '示例二：reject 后无法再 resolve',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Error first');
  resolve('Success second'); // 不会执行
});
console.log('Promise created');`
  },
  {
    title: '示例三：抛出异常也走 #setState',
    code: `
const p = new MyPromise((resolve, reject) => {
  throw new Error('Crash!');
});
console.log('Error handled by #setState');`
  }
]
</script>

# 状态变更封装

将状态变更逻辑封装为私有方法 `#setState`，resolve 和 reject 统一调用它。

::: tip 本节要点
新增 `#setState(state, value)` 私有方法，统一处理状态变更和值设置。
resolve 和 reject 不再直接操作 #state 和 #value，而是通过 #setState 间接操作。
:::

## 新增 #setState 方法

<CodeBlock code="#setState(state, value){
  if(this.#state !== PENDING) return;
  this.#state = state;
  this.#value = value;
}" title="关键变更" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['private-fields']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
