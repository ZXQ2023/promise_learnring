import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import CodeBlock from './components/CodeBlock.vue'
import ResultBlock from './components/ResultBlock.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CodeBlock', CodeBlock)
    app.component('ResultBlock', ResultBlock)
  },
} satisfies Theme
