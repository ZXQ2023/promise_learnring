<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { codeToHtml } from 'shiki'
import { transformerNotationDiff } from '@shikijs/transformers'
import { diffLines } from 'diff'

const props = defineProps<{
  code: string
  previousCode?: string
  title?: string
}>()

const html = ref('')
const loaded = ref(false)

onMounted(async () => {
  let codeToRender = props.code

  if (props.previousCode) {
    const changes = diffLines(props.previousCode, props.code)
    const lines: string[] = []
    for (const change of changes) {
      const changeLines = change.value.replace(/\n$/, '').split('\n')
      for (const line of changeLines) {
        if (change.added) lines.push(line + ' // [!code ++]')
        else if (change.removed) lines.push(line + ' // [!code --]')
        else lines.push(line)
      }
    }
    codeToRender = lines.join('\n')
  }

  html.value = await codeToHtml(codeToRender, {
    lang: 'javascript',
    theme: 'one-dark-pro',
    transformers: [transformerNotationDiff()],
  })

  loaded.value = true
})
</script>

<template>
  <div class="code-block-wrapper">
    <div v-if="title" class="code-block-titlebar">
      <span class="dot dot-red" />
      <span class="dot dot-yellow" />
      <span class="dot dot-green" />
      <span class="code-block-title">{{ title }}</span>
    </div>
    <div class="code-block-content">
      <div v-if="loaded" class="code-block-output" v-html="html" />
      <div v-else class="code-block-loading">Loading code...</div>
    </div>
  </div>
</template>

<style scoped>
.code-block-wrapper {
  margin: 1rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}
.code-block-titlebar {
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
.code-block-title {
  margin-left: 0.5rem;
}
.code-block-content {
  background: #282c34;
}
.code-block-output {
  overflow-x: auto;
}
.code-block-output :deep(pre) {
  margin: 0 !important;
  padding: 1rem !important;
  background: transparent !important;
}
.code-block-output :deep(code) {
  font-size: 0.875rem !important;
  line-height: 1.625 !important;
}
.code-block-loading {
  padding: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.875rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
:deep(.diff.add) {
  background-color: rgba(34, 197, 94, 0.15);
  border-left: 3px solid rgba(74, 222, 128, 0.7);
  display: inline-block;
  width: 100%;
  margin: 0 -1rem;
  padding: 0 1rem 0 calc(1rem - 3px);
}
:deep(.diff.remove) {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 3px solid rgba(248, 113, 113, 0.5);
  display: inline-block;
  width: 100%;
  margin: 0 -1rem;
  padding: 0 1rem 0 calc(1rem - 3px);
  opacity: 0.6;
}
@keyframes pulse {
  50% { opacity: 0.5; }
}
</style>
