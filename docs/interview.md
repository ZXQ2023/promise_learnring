---
title: Promise 面试题
---

<script setup>
const examples = [
  {
    title: '题 1：执行顺序',
    code: `
console.log('start');

new Promise((resolve) => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('then1');
});

console.log('end');`
  },
  {
    title: '题 2：setTimeout vs Promise',
    code: `
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

new Promise((resolve) => {
  console.log('3');
  resolve();
}).then(() => {
  console.log('4');
}).then(() => {
  console.log('5');
});

console.log('6');`
  },
  {
    title: '题 3：resolve 的值',
    code: `
new Promise((resolve) => {
  resolve(new Promise((resolve2) => {
    resolve2(42);
  }));
}).then((v) => {
  console.log('value:', v);
});`
  },
  {
    title: '题 4：then 返回值与链式调用',
    code: `
new Promise((resolve) => {
  resolve(1);
})
.then((v) => {
  console.log('first then:', v);
  return v + 1;
})
.then((v) => {
  console.log('second then:', v);
  return new Promise((resolve) => resolve(v * 10));
})
.then((v) => {
  console.log('third then:', v);
});`
  },
  {
    title: '题 5：错误捕获',
    code: `
new Promise((resolve, reject) => {
  resolve('ok');
})
.then((v) => {
  console.log('then1:', v);
  throw new Error('boom');
})
.then((v) => {
  console.log('then2: 不会执行');
  return v;
})
.catch((e) => {
  console.log('catch:', e.message);
  return 'recovered';
})
.then((v) => {
  console.log('then3:', v);
});`
  },
  {
    title: '题 6：Promise.all 错误处理',
    code: `
Promise.all([
  Promise.resolve(1),
  new Promise((_, reject) => setTimeout(() => reject('fail'), 50)),
  Promise.resolve(3),
]).then(
  (results) => console.log('成功:', results),
  (e) => console.log('失败:', e)
);`
  },
  {
    title: '题 7：async/await 与微任务',
    code: `
function asyncTask() {
  return new Promise((resolve) => {
    console.log('asyncTask executor');
    resolve('result');
  });
}

console.log('before');

asyncTask().then((v) => {
  console.log('await 得到:', v);
  return v + '!';
}).then((v) => {
  console.log('继续处理:', v);
});

console.log('after');`
  },
  {
    title: '题 8：Promise 状态不可变',
    code: `
const p = new Promise((resolve, reject) => {
  resolve('第一次');
  resolve('第二次');
  reject('error');
});

p.then(
  (v) => console.log('fulfilled:', v),
  (e) => console.log('rejected:', e)
);

console.log('状态一旦确定就不可更改');`
  },
  {
    title: '题 9：嵌套 Promise 执行顺序',
    code: `
console.log('1');

new Promise((resolve) => {
  console.log('2');
  resolve();
}).then(() => {
  console.log('3');
  new Promise((resolve) => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5');
  }).then(() => {
    console.log('6');
  });
}).then(() => {
  console.log('7');
});

console.log('8');`
  },
  {
    title: '题 10：综合题',
    code: `
setTimeout(() => console.log('A'), 0);

new Promise((resolve) => {
  console.log('B');
  for (let i = 0; i < 1000; i++) {}
  resolve();
}).then(() => {
  console.log('C');
}).then(() => {
  console.log('D');
});

new Promise((resolve) => {
  console.log('E');
  resolve();
}).then(() => {
  console.log('F');
}).then(() => {
  console.log('G');
});

console.log('H');`
  }
]
</script>

# Promise 面试题

收集了 Promise 相关的高频面试题，涵盖执行顺序、状态机制、错误处理、链式调用等核心知识点。每道题都可以运行查看实际输出。

::: tip 答题技巧
- 同步代码先执行，微任务（Promise.then）在宏任务（setTimeout）之前
- Promise 状态一旦确定（fulfilled / rejected）就不可变
- then 返回的是新的 Promise，不是原来的
- catch 本质上是 `.then(null, onRejected)` 的语法糖
:::

## 题 1：执行顺序

经典事件循环入门题。考查同步代码与微任务的执行顺序。

**答案：** `start → promise1 → end → then1`

同步代码（`start`、`promise1`、`end`）先执行，`then` 回调作为微任务在同步代码之后执行。

<ResultBlock :code="examples[0].code" :example-code="examples[0].code.trim()" :title="examples[0].title" />

## 题 2：setTimeout vs Promise

考查宏任务与微任务的优先级。

**答案：** `1 → 3 → 6 → 4 → 5 → 2`

同步代码先输出 1、3、6；微任务输出 4、5；宏任务最后输出 2。

<ResultBlock :code="examples[1].code" :example-code="examples[1].code.trim()" :title="examples[1].title" />

## 题 3：resolve 的值

resolve 一个 Promise 时，最终值是什么？

**答案：** `value: 42`

当 resolve 的值是一个 Promise 时，会"解包"——等待内部 Promise 完成后取其值。

<ResultBlock :code="examples[2].code" :example-code="examples[2].code.trim()" :title="examples[2].title" />

## 题 4：then 返回值与链式调用

then 回调返回普通值 vs 返回 Promise 的区别。

**答案：** `first then: 1 → second then: 2 → third then: 20`

返回普通值会自动包装为 `Promise.resolve(value)`；返回 Promise 则等待它完成。

<ResultBlock :code="examples[3].code" :example-code="examples[3].code.trim()" :title="examples[3].title" />

## 题 5：错误捕获

catch 如何捕获链中的错误，catch 之后还能继续 then 吗？

**答案：** `then1: ok → catch: boom → then3: recovered`

throw 会被最近的 catch 捕获；catch 返回的值会传递给后续的 then。

<ResultBlock :code="examples[4].code" :example-code="examples[4].code.trim()" :title="examples[4].title" />

## 题 6：Promise.all 错误处理

Promise.all 中有一个失败会怎样？

**答案：** `失败: fail`

Promise.all 只要有一个 Promise 失败，整体就失败，返回第一个失败的原因。

<ResultBlock :code="examples[5].code" :example-code="examples[5].code.trim()" :title="examples[5].title" />

## 题 7：async/await 与微任务

await 后面的代码相当于在 then 中执行。

**答案：** `before → asyncTask executor → after → await 得到: result → 继续处理: result!`

<ResultBlock :code="examples[6].code" :example-code="examples[6].code.trim()" :title="examples[6].title" />

## 题 8：Promise 状态不可变

resolve/reject 只会生效第一次调用。

**答案：** `fulfilled: 第一次` + `状态一旦确定就不可更改`

状态从 pending 变为 fulfilled 后，后续的 resolve/reject 调用都会被忽略。

<ResultBlock :code="examples[7].code" :example-code="examples[7].code.trim()" :title="examples[7].title" />

## 题 9：嵌套 Promise 执行顺序

多层嵌套的 Promise 回调执行顺序。

**答案：** `1 → 2 → 8 → 3 → 4 → 7 → 5 → 6`

注意第 7 步：外层第一个 then 返回的 Promise 在内层第一个 then 之后 resolve。

<ResultBlock :code="examples[8].code" :example-code="examples[8].code.trim()" :title="examples[8].title" />

## 题 10：综合题

综合考查同步代码、微任务队列、多个 Promise 链的执行顺序。

**答案：** `B → E → H → C → F → D → G → A`

<ResultBlock :code="examples[9].code" :example-code="examples[9].code.trim()" :title="examples[9].title" />
