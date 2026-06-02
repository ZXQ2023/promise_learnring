---
title: catch 实现
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['catch']

const examples = [
  {
    title: '示例一：catch 捕获 reject',
    code: `
const p = new MyPromise((resolve, reject) => {
  reject('Something went wrong');
});
p.catch((err) => console.log('Caught:', err));`
  },
  {
    title: '示例二：catch 捕获链中的异常',
    code: `
new MyPromise((resolve) => resolve('ok'))
  .then((v) => {
    throw new Error('chain error');
  })
  .catch((e) => console.log('Caught error:', e.message));`
  },
  {
    title: '示例三：catch 后继续链式调用',
    code: `
new MyPromise((_, reject) => reject('fail'))
  .catch((e) => {
    console.log('Caught:', e);
    return 'recovered';
  })
  .then((v) => console.log('Continue:', v));`
  }
]
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

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
