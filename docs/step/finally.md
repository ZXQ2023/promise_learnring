---
title: finally 实现
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['finally']

const examples = [
  {
    title: '示例一：resolve 时执行 finally',
    code: `
const p = new MyPromise((resolve) => resolve('Done!'));
p.finally(() => console.log('Cleanup!'))
 .then((v) => console.log('Value:', v));`
  },
  {
    title: '示例二：reject 时也执行 finally',
    code: `
const p = new MyPromise((_, reject) => reject('Error!'));
p.finally(() => console.log('Cleanup!'))
 .catch((e) => console.log('Caught:', e));`
  },
  {
    title: '示例三：finally 不改变传递的值',
    code: `
new MyPromise((resolve) => resolve(42))
  .finally(() => console.log('side effect'))
  .then((v) => console.log('value unchanged:', v));`
  }
]
</script>

# finally 实现

finally 无论 Promise 成功还是失败都会执行，且不改变最终的值。也是 ES6 扩展，不属于 A+ 规范。

::: tip 本节要点
新增 `finally(onFinally)` 方法，基于 then 实现。
在 fulfilled 路径中：执行 onFinally，然后返回原值。
在 rejected 路径中：执行 onFinally，然后重新 throw 原因。
:::

## 新增 finally 方法

<CodeBlock code="finally(onFinally){
  return this.then(
    (value) => {
      onFinally();
      return value;
    },
    (reason) => {
      onFinally();
      throw reason;
    }
  )
}" title="新增方法" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['catch']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
