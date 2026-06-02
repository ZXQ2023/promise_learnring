---
title: 静态方法
---

<script setup>
import { stepCodes } from '../shared/step-codes'

const code = stepCodes['static']

const runCode = code + `

// Test static methods
MyPromise.resolve(42).then(v => console.log('resolve:', v));
MyPromise.reject('error').catch(e => console.log('reject:', e));

MyPromise.all([
  MyPromise.resolve(1),
  MyPromise.resolve(2),
  MyPromise.resolve(3),
]).then((results) => console.log('all:', results));`
</script>

# 静态方法

ES6 扩展的静态方法：resolve、reject、try、all。这些不属于 Promise A+ 规范，但实际使用非常频繁。

::: tip 本节要点
**resolve**：将普通值转为 Promise，如果已经是 Promise 则直接返回。
**reject**：返回一个 rejected 状态的 Promise。
**try**：尝试执行函数并包装为 Promise。
**all**：等待所有 Promise 完成，有一个失败则整体失败。
:::

## static resolve

<CodeBlock code="static resolve(value){
  if(value instanceof MyPromise) return value;
  return new MyPromise((resolve, reject) => {
    if(isPromiseLike(value)){
      value.then(resolve, reject);
    }else{
      resolve(value);
    }
  });
}" title="static resolve" />

## static reject

<CodeBlock code="static reject(reason){
  return new MyPromise((_, reject) => {
    reject(reason);
  });
}" title="static reject" />

## static try

<CodeBlock code="static try(fn, ...args){
  return new MyPromise((resolve) => {
    resolve(fn(...args));
  });
}" title="static try" />

## static all

<CodeBlock code="static all(promises){
  promises = Array.from(promises);
  return new MyPromise((resolve, reject) => {
    const results = [];
    let count = 0;
    if(promises.length === 0){
      resolve(results);
      return;
    }
    promises.forEach((p, index) => {
      MyPromise.resolve(p).then((res) => {
        results[index] = res;
        count++;
        if(count === promises.length){
          resolve(results);
        }
      }, reject);
    });
  });
}" title="static all" />

## 完整代码

<CodeBlock :code="code" :previous-code="stepCodes['finally']" title="my-promise.js — 完整实现" />

<ResultBlock :code="runCode" />
