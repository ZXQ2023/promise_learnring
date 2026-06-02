---
title: then 嵌套 Promise
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['resolve-promise']

const examples = [
  {
    title: '示例一：then 回调返回 Promise',
    code: `
const p = new MyPromise((resolve) => resolve('Hello'));
const p2 = p.then((v) => {
  return new MyPromise((resolve) => resolve(v + ' from p2'));
});
p2.then((v) => console.log('result:', v));`
  },
  {
    title: '示例二：then 回调返回普通值',
    code: `
const p = new MyPromise((resolve) => resolve(10));
p.then((v) => {
  return v * 2;
}).then((v) => {
  console.log('doubled:', v);
});`
  },
  {
    title: '示例三：嵌套 Promise 链式调用',
    code: `
new MyPromise((resolve) => resolve(1))
  .then((v) => {
    console.log('step 1:', v);
    return new MyPromise((resolve) => resolve(v + 1));
  })
  .then((v) => {
    console.log('step 2:', v);
    return new MyPromise((resolve) => resolve(v + 1));
  })
  .then((v) => console.log('step 3:', v));`
  }
]
</script>

# then 嵌套 Promise

当 then 回调返回的是一个 Promise（thenable）时，需要等待它完成再 resolve，而不是直接 resolve 这个 Promise 对象。

::: tip 本节要点
新增 `isPromiseLike` 工具函数判断值是否为 thenable。
在 then 中，如果回调返回值是 thenable，调用 `returnValue.then(resolve, reject)` 等待其完成。
:::

## 新增 isPromiseLike

<CodeBlock code="function isPromiseLike(value){
  return typeof value && typeof value.then === 'function';
}" title="新增工具函数" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['microtask']" title="my-promise.js" />

## 运行示例

<ResultBlock
  v-for="(ex, i) in examples"
  :key="i"
  :code="code + ex.code"
  :example-code="ex.code.trim()"
  :title="ex.title"
/>
