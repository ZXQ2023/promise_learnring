<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { codeToHtml } from 'shiki'

const props = defineProps<{
  code: string
  exampleCode?: string
  title?: string
}>()

const exampleHtml = ref('')
const output = ref<string[]>([])
const running = ref(false)
const loaded = ref(false)

onMounted(async () => {
  if (props.exampleCode) {
    exampleHtml.value = await codeToHtml(props.exampleCode, {
      lang: 'javascript',
      theme: 'one-dark-pro',
    })
  }
  loaded.value = true
})

function run() {
  output.value = []
  running.value = true

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  document.body.appendChild(iframe)

  const win = iframe.contentWindow as any
  const logs: string[] = []

  win.console.log = (...args: any[]) => {
    logs.push(args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
  }
  win.console.error = (...args: any[]) => {
    logs.push('Error: ' + args.map((a: any) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '))
  }

  try {
    win.eval(props.code)
  } catch (err: any) {
    logs.push('Error: ' + err.message)
  }

  setTimeout(() => {
    output.value = logs
    running.value = false
    document.body.removeChild(iframe)
  }, 100)
}
</script>

<template>
  <div class="result-block-wrapper">
    <div v-if="title" class="example-title">{{ title }}</div>
    <div v-if="exampleCode && loaded" class="example-code-wrapper">
      <div class="example-code-header">
        <span class="dot dot-red" />
        <span class="dot dot-yellow" />
        <span class="dot dot-green" />
        <span class="example-code-label">示例代码</span>
      </div>
      <div class="example-code-content">
        <div class="example-code-output" v-html="exampleHtml" />
      </div>
    </div>
    <div v-else-if="exampleCode && !loaded" class="example-code-wrapper">
      <div class="example-code-header">
        <span class="dot dot-red" />
        <span class="dot dot-yellow" />
        <span class="dot dot-green" />
        <span class="example-code-label">示例代码</span>
      </div>
      <div class="example-code-content">
        <div class="example-code-loading">Loading...</div>
      </div>
    </div>
    <div class="run-row">
      <button
        @click="run"
        :disabled="running"
        class="run-button"
      >
        <svg class="run-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        {{ running ? '运行中...' : '运行代码' }}
      </button>
    </div>
    <div v-if="output.length" class="result-output">
      <div class="result-header">运行结果</div>
      <div class="result-content">
        <div v-for="(line, i) in output" :key="i" class="result-line">{{ line }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-block-wrapper {
  margin: 1rem 0;
}
.example-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}
.example-code-wrapper {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 0.75rem;
}
.example-code-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}
.dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}
.dot-red { background: rgba(239, 68, 68, 0.6); }
.dot-yellow { background: rgba(234, 179, 8, 0.6); }
.dot-green { background: rgba(34, 197, 94, 0.6); }
.example-code-label {
  margin-left: 0.5rem;
}
.example-code-content {
  background: #282c34;
}
.example-code-output {
  overflow-x: auto;
}
.example-code-output :deep(pre) {
  margin: 0 !important;
  padding: 1rem !important;
  background: transparent !important;
}
.example-code-output :deep(code) {
  font-size: 0.875rem !important;
  line-height: 1.625 !important;
}
.example-code-loading {
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.run-row {
  margin-bottom: 0.5rem;
}
.run-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.run-button:hover {
  opacity: 0.85;
}
.run-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.run-icon {
  width: 1rem;
  height: 1rem;
}
.result-output {
  margin-top: 0.75rem;
  border-radius: 0.75rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}
.result-header {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
}
.result-content {
  padding: 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.875rem;
}
.result-line {
  padding: 0.125rem 0;
  color: #4ade80;
}
@keyframes pulse {
  50% { opacity: 0.5; }
}
</style>
