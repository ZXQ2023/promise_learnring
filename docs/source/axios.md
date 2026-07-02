---
title: axios 源码解读
---

# axios 源码解读

axios 是一个很适合从 Promise 视角阅读的库：它暴露的是 `axios(config).then(...)` 这样的 Promise 接口，内部却要完成配置合并、请求拦截、响应拦截、适配浏览器和 Node.js、错误转换、取消请求等一整套流程。

本文以 axios `v1.x` 分支为阅读对象，重点看它如何用 Promise 链组织请求生命周期。

## 先抓主线

一次请求可以先简化成这条链路：

```txt
axios(config)
  -> Axios.prototype.request
  -> 合并默认配置和本次配置
  -> 收集 request interceptors
  -> dispatchRequest(config)
  -> adapter(config)
  -> 收集 response interceptors
  -> 返回最终 Promise
```

其中最关键的 Promise 分工是：

- **拦截器**：本质上是一组 `then(onFulfilled, onRejected)` 回调。
- **dispatchRequest**：把配置交给具体 adapter，并返回 adapter 产生的 Promise。
- **adapter**：真正发请求，浏览器可走 XHR/fetch，Node.js 可走 http。
- **settle**：根据 HTTP 状态码决定 `resolve(response)` 还是 `reject(error)`。

## axios 为什么既能调用又有方法

我们平时既可以这样用：

```js
axios('/api/user')
axios.get('/api/user')
axios.create({ baseURL: '/api' })
```

这是因为 axios 的默认导出不是一个普通对象，而是一个「绑定了上下文的函数对象」。

在 `lib/axios.js` 里，`createInstance` 大致做了三件事：

```js
function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig)
  const instance = bindRequestToContext(context)

  copyPrototypeMethods(instance, Axios.prototype, context)
  copyInstanceFields(instance, context)

  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig))
  }

  return instance
}
```

这样 `axios(config)` 调的是 `Axios.prototype.request`，`axios.get`、`axios.post` 等快捷方法也能复用同一个 `context`，所以它们共享 `defaults` 和 `interceptors`。

## InterceptorManager：拦截器只是回调仓库

axios 的拦截器管理器非常轻，核心就是维护一个 `handlers` 数组。每次调用 `use`，都会存入：

```js
{
  fulfilled,
  rejected,
  synchronous,
  runWhen,
}
```

这里的 `fulfilled` 和 `rejected` 正好对应 Promise 里的：

```js
promise.then(fulfilled, rejected)
```

`eject(id)` 并不会立刻压缩数组，而是把对应位置置为 `null`。遍历时跳过空位，这样已经返回出去的 id 仍然稳定。

## request：把拦截器拼成 Promise 链

`Axios.prototype.request` 会先进入 `_request`。这里先处理两种调用方式：

```js
axios('/users', { method: 'post' })
axios({ url: '/users', method: 'post' })
```

之后会合并默认配置、规范化 method、整理 headers，然后收集请求拦截器和响应拦截器。

异步拦截器场景下，它会把整条流程拼成一个 Promise 链：

```js
const chain = [
  ...requestInterceptors,
  dispatchRequest,
  undefined,
  ...responseInterceptors,
]

let promise = Promise.resolve(config)

while (chain.length) {
  promise = promise.then(chain.shift(), chain.shift())
}

return promise
```

这段结构就是 axios 最值得学的地方：所有步骤都被统一成 Promise 的成功回调和失败回调，任何一步 `throw` 或返回 rejected Promise，都会自然进入后续错误处理。

::: tip 请求拦截器顺序
axios `v1.x` 默认启用了 legacy 拦截器顺序，请求拦截器后注册的先执行，响应拦截器先注册的先执行。也就是说，请求阶段更像从外向内包裹，响应阶段再从内向外返回。
:::

## 同步请求拦截器为什么单独处理

如果所有 request interceptor 都标记了 `synchronous: true`，axios 不会先 `Promise.resolve(config)` 再一路 `.then`，而是先同步执行请求拦截器：

```js
let newConfig = config

for (const interceptor of requestInterceptors) {
  newConfig = interceptor.fulfilled(newConfig)
}

let promise = dispatchRequest(newConfig)

for (const interceptor of responseInterceptors) {
  promise = promise.then(interceptor.fulfilled, interceptor.rejected)
}

return promise
```

这样做的好处是：纯同步的配置改写不需要多排一轮微任务，真正异步的边界留给 `dispatchRequest` 和 adapter。

## dispatchRequest：Promise 链里的执行核心

`dispatchRequest(config)` 是请求真正发出去前后的总控。它主要做这些事：

1. 检查请求是否已经取消。
2. 转换请求数据，比如把对象转换成可发送的 body。
3. 根据环境和配置拿到 adapter。
4. 调用 `adapter(config)`，得到一个 Promise。
5. 在 adapter fulfilled 时转换响应数据。
6. 在 adapter rejected 时转换错误响应，并继续 `Promise.reject(reason)`。

简化后是这样：

```js
function dispatchRequest(config) {
  throwIfCancellationRequested(config)
  transformRequestData(config)

  const adapter = getAdapter(config)

  return adapter(config).then(
    response => {
      throwIfCancellationRequested(config)
      transformResponseData(response)
      return response
    },
    reason => {
      if (reason.response) {
        transformResponseData(reason.response)
      }
      return Promise.reject(reason)
    }
  )
}
```

注意最后的 `Promise.reject(reason)`：axios 不会把失败吞掉，而是把错误继续交给调用方的 `.catch` 或后续响应拦截器。

## adapter：把环境差异藏到 Promise 后面

adapter 是 axios 的环境适配层。浏览器、Node.js、fetch API 的底层请求方式不同，但只要 adapter 遵守同一个约定即可：

```js
function adapter(config) {
  return new Promise((resolve, reject) => {
    // 发起真实请求
    // 成功时 resolve(response)
    // 失败时 reject(error)
  })
}
```

这就是 Promise 在工程抽象里的价值：调用方不需要关心 XHR、fetch、http 模块分别怎么工作，只要等待同一个 Promise 结果。

## settle：HTTP 状态码如何影响 Promise 状态

HTTP 请求本身成功返回，不代表业务上应该进入 fulfilled。axios 会用 `validateStatus` 判断状态码：

```js
if (!response.status || !validateStatus || validateStatus(response.status)) {
  resolve(response)
} else {
  reject(createAxiosError(response))
}
```

默认情况下，`2xx` 状态进入 fulfilled，`4xx`、`5xx` 会进入 rejected。因此下面的 `catch` 能接到 HTTP 错误：

```js
axios('/missing').catch(error => {
  console.log(error.response.status)
})
```

## 取消请求：把取消也接进异步链

axios 同时支持 `AbortController` 的 `signal` 和旧版 `CancelToken`。从 Promise 视角看，取消不是特殊通道，而是让请求链进入 rejected。

请求开始前，`dispatchRequest` 会检查取消状态；adapter 完成后，转换响应前也会再检查一次。这样可以覆盖两种情况：

- 请求还没发出就取消。
- 请求已经返回，但在处理结果前被取消。

旧版 `CancelToken` 内部维护了一个 Promise。调用 `cancel()` 时，这个 Promise 被 resolve，订阅者收到取消原因，adapter 再把请求中止并 reject。

## 一张心智图

```txt
                 request interceptor
                         |
axios(config) -> Promise.resolve(config)
                         |
                 request interceptor
                         |
                  dispatchRequest
                         |
                      adapter
                         |
                    settle 状态
                         |
                response interceptor
                         |
                response interceptor
                         |
                    then / catch
```

如果只记一句话：axios 的源码主线就是把「配置处理、拦截器、真实请求、响应处理、错误处理」全部规整成一条 Promise 链。

## 可以带走的设计经验

- **统一异步出口**：无论内部经历多少分支，最终都返回 Promise。
- **插件机制可以基于 then 链实现**：请求/响应拦截器就是成对的成功和失败回调。
- **环境差异交给 adapter**：上层流程稳定，底层实现可替换。
- **错误不要提前吞掉**：转换、包装之后继续 reject，让调用方决定如何处理。
- **取消也是状态流转**：取消请求本质上是把异步任务推向失败分支。

## 源码入口

- [axios 默认实例：lib/axios.js](https://github.com/axios/axios/blob/v1.x/lib/axios.js)
- [Axios 请求主流程：lib/core/Axios.js](https://github.com/axios/axios/blob/v1.x/lib/core/Axios.js)
- [拦截器管理器：lib/core/InterceptorManager.js](https://github.com/axios/axios/blob/v1.x/lib/core/InterceptorManager.js)
- [请求分发：lib/core/dispatchRequest.js](https://github.com/axios/axios/blob/v1.x/lib/core/dispatchRequest.js)
- [状态决议：lib/core/settle.js](https://github.com/axios/axios/blob/v1.x/lib/core/settle.js)
- [取消令牌：lib/cancel/CancelToken.js](https://github.com/axios/axios/blob/v1.x/lib/cancel/CancelToken.js)
