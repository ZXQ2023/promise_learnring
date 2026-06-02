export const chapters = [
  { id: 'resolve-reject', title: '构建 resolve、reject' },
  { id: 'state', title: '状态封装' },
  { id: 'try-catch', title: '异常抛出处理' },
  { id: 'private-fields', title: '将属性改为私有' },
  { id: 'set-state', title: '状态变更封装' },
  { id: 'then', title: 'Then 方法' },
  { id: 'async-resolve', title: '异步 resolve/reject' },
  { id: 'multiple-then', title: '多次 then 调用' },
  { id: 'chain-then', title: '链式调用 then' },
  { id: 'microtask', title: 'then 异步执行' },
  { id: 'resolve-promise', title: 'then 嵌套 promise' },
  { id: 'catch', title: 'catch 实现' },
  { id: 'finally', title: 'finally 实现' },
  { id: 'static', title: '静态方法' },
]

export const sections = [
  { label: '初始化构造函数', ids: ['resolve-reject', 'state', 'try-catch', 'private-fields', 'set-state'] },
  { label: 'Then 方法', ids: ['then', 'async-resolve', 'multiple-then', 'chain-then', 'microtask', 'resolve-promise'] },
  { label: 'ES6 扩展', ids: ['catch', 'finally', 'static'] },
]
