<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  code: string
}>()

const output = ref<string[]>([])
const running = ref(false)

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
    <button
      @click="run"
      :disabled="running"
      class="run-button"
    >
      <svg class="run-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      {{ running ? '运行中...' : '运行代码' }}
    </button>
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
  background: rgba(99, 102, 241, 0.25);
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
  background: #1a1a2e;
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
</style>
