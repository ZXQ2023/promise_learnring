import { defineConfig } from 'vitepress'
import { sections, chapters } from '../shared/data'

export default defineConfig({
  title: '手写 Promise 学习之旅',
  description: '循序渐进实现 Promise',
  lang: 'zh-CN',
  base: '/promise_learnring/',

  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: '首页', link: '/' },
      { text: '使用场景', link: '/usage' },
      { text: '面试题', link: '/interview' },
      {
        text: 'MDN 文档',
        link: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise',
      },
    ],

    sidebar: [
      ...sections.map(section => ({
        text: section.label,
        items: section.ids.map(id => {
          const chapter = chapters.find(c => c.id === id)!
          const index = chapters.indexOf(chapter) + 1
          return {
            text: `${index}. ${chapter.title}`,
            link: `/step/${id}`,
          }
        }),
      })),
      {
        text: '扩展',
        items: [
          { text: '常见使用场景', link: '/usage' },
          { text: '面试题', link: '/interview' },
        ],
      },
    ],

    footer: {
      message: '循序渐进实现 Promise',
    },
  },
})
