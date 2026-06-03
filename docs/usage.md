---
title: Promise 常见使用场景
---

<script setup>
const examples = [
  {
    title: '场景一：封装 AJAX 请求',
    code: `
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error('HTTP ' + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error('Network Error'));
    xhr.send();
  });
}

const fakeFetch = (data, delay = 50) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

fakeFetch({ name: 'Tom', age: 20 }).then(user => {
  console.log('用户数据:', JSON.stringify(user));
});`
  },
  {
    title: '场景二：异步操作超时控制',
    code: `
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('操作超时 (' + ms + 'ms)')), ms);
  });
  return Promise.race([promise, timeout]);
}

const fastTask = new Promise(resolve => {
  setTimeout(() => resolve('快速完成'), 50);
});

const slowTask = new Promise(resolve => {
  setTimeout(() => resolve('完成'), 500);
});

// 快速任务：100ms 内完成，正常拿到结果
withTimeout(fastTask, 100).then(
  v => console.log('快速任务成功:', v),
  e => console.log('快速任务失败:', e.message)
);

// 慢任务：超过 100ms 还没完成，触发超时
withTimeout(slowTask, 100).then(
  v => console.log('慢任务成功:', v),
  e => console.log('慢任务失败:', e.message)
);`
  },
  {
    title: '场景三：按顺序执行异步任务',
    code: `
function sequential(tasks) {
  let result = Promise.resolve([]);
  tasks.forEach(task => {
    result = result.then(arr => {
      return task().then(val => arr.concat(val));
    });
  });
  return result;
}

sequential([
  () => new Promise(r => setTimeout(() => { console.log('任务 1'); r(1); }, 20)),
  () => new Promise(r => setTimeout(() => { console.log('任务 2'); r(2); }, 20)),
  () => new Promise(r => setTimeout(() => { console.log('任务 3'); r(3); }, 20)),
]).then(results => {
  console.log('全部完成:', results);
});`
  },
  {
    title: '场景四：并发请求并合并结果',
    code: `
function fetchMultiple(urls) {
  const promises = urls.map(url =>
    new Promise(resolve => {
      const delay = Math.random() * 30 + 10;
      setTimeout(() => resolve({ url, data: '来自 ' + url + ' 的数据' }), delay);
    })
  );
  return Promise.all(promises);
}

fetchMultiple(['/api/users', '/api/posts', '/api/comments']).then(results => {
  results.forEach(r => console.log(r.url, '->', r.data));
});`
  },
  {
    title: '场景五：异步重试机制',
    code: `
function retry(fn, times = 3, delay = 100) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function attempt() {
      attempts++;
      fn().then(resolve, err => {
        console.log('第 ' + attempts + ' 次失败:', err.message || err);
        if (attempts < times) {
          setTimeout(attempt, delay);
        } else {
          reject(new Error('重试 ' + times + ' 次后仍然失败'));
        }
      });
    }

    attempt();
  });
}

let callCount = 0;
const unstableTask = () => new Promise((resolve, reject) => {
  callCount++;
  if (callCount < 3) {
    reject(new Error('随机失败'));
  } else {
    resolve('终于成功了！');
  }
});

retry(unstableTask, 5, 20).then(
  v => console.log('重试结果:', v),
  e => console.log('彻底失败:', e.message)
);`
  },
  {
    title: '场景六：图片预加载',
    code: `
function preloadImage(name, delay) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('预加载完成: ' + name);
      resolve({ name, loaded: true });
    }, delay);
  });
}

Promise.all([
  preloadImage('logo.png', 60),
  preloadImage('banner.jpg', 90),
  preloadImage('icon.svg', 40),
]).then(images => {
  console.log('所有图片预加载完成，共', images.length, '张');
});`
  },
  {
    title: '场景七：防抖异步操作',
    code: `
function debounceAsync(fn, ms) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer);

    return new Promise((resolve, reject) => {
      timer = setTimeout(() => {
        fn(...args).then(resolve, reject);
      }, ms);
    });
  };
}

let searchCount = 0;
const search = (keyword) => new Promise(resolve => {
  searchCount++;
  setTimeout(() => resolve('搜索 \"' + keyword + '\" 的结果 (第' + searchCount + '次)'), 20);
});

const debouncedSearch = debounceAsync(search, 80);

debouncedSearch('he').then(r => console.log(r));
debouncedSearch('hel').then(r => console.log(r));
debouncedSearch('hello').then(r => console.log(r));`
  },
  {
    title: '场景八：缓存异步结果',
    code: `
function memoizeAsync(fn) {
  const cache = new Map();
  return function (key) {
    if (cache.has(key)) {
      console.log('命中缓存:', key);
      return cache.get(key);
    }
    const promise = fn(key);
    cache.set(key, promise);
    return promise;
  };
}

const getUser = memoizeAsync((id) => new Promise(resolve => {
  console.log('发起请求: user/' + id);
  setTimeout(() => resolve({ id, name: 'User-' + id }), 30);
}));

getUser('001').then(u => console.log('结果:', JSON.stringify(u)));
setTimeout(() => {
  getUser('001').then(u => console.log('缓存结果:', JSON.stringify(u)));
}, 60);`
  }
]
</script>

# Promise 常见使用场景

Promise 在日常开发中有非常多实用的场景。本页列举了最常见的几种模式，配合可运行的示例代码。

::: tip 要点
掌握这些模式能帮助你更自如地处理异步逻辑，写出更清晰、更健壮的代码。
:::

## 场景一：封装 AJAX 请求

Promise 最经典的用途——将回调风格的异步操作转为链式调用。

<ResultBlock :code="examples[0].code" :example-code="examples[0].code.trim()" :title="examples[0].title" />

## 场景二：异步操作超时控制

利用 `Promise.race` 实现超时中断。设定一个超时 Promise，与原任务竞争——任务先完成则正常返回，超时先到则拒绝。

<ResultBlock :code="examples[1].code" :example-code="examples[1].code.trim()" :title="examples[1].title" />

## 场景三：按顺序执行异步任务

通过 `then` 链将多个异步任务串行执行，前一个完成后再开始下一个。

<ResultBlock :code="examples[2].code" :example-code="examples[2].code.trim()" :title="examples[2].title" />

## 场景四：并发请求并合并结果

使用 `Promise.all` 同时发起多个请求，全部完成后合并结果。

<ResultBlock :code="examples[3].code" :example-code="examples[3].code.trim()" :title="examples[3].title" />

## 场景五：异步重试机制

网络不稳定时自动重试，直到成功或达到最大重试次数。

<ResultBlock :code="examples[4].code" :example-code="examples[4].code.trim()" :title="examples[4].title" />

## 场景六：图片预加载

预先加载图片资源，确保渲染时能立即显示。

<ResultBlock :code="examples[5].code" :example-code="examples[5].code.trim()" :title="examples[5].title" />

## 场景七：防抖异步操作

输入框搜索等场景中，快速连续输入时只触发最后一次请求。

<ResultBlock :code="examples[6].code" :example-code="examples[6].code.trim()" :title="examples[6].title" />

## 场景八：缓存异步结果

对相同参数的异步调用做缓存，避免重复请求。

<ResultBlock :code="examples[7].code" :example-code="examples[7].code.trim()" :title="examples[7].title" />
