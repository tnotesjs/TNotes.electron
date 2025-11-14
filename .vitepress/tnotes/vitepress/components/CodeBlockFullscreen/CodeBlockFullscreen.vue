<template>
  <Teleport to="body">
    <Transition name="fullscreen-fade">
      <div
        v-if="isFullscreen"
        class="code-fullscreen-overlay"
        :class="{ 'is-landscape': isLandscape }"
        @click.self="closeFullscreen"
      >
        <div class="code-fullscreen-container">
          <!-- 工具栏 -->
          <div class="code-fullscreen-toolbar">
            <div class="code-fullscreen-title">
              <span v-if="language" class="language-tag">{{ language }}</span>
              <span v-if="filename" class="filename">{{ filename }}</span>
            </div>
            <div class="code-fullscreen-actions">
              <!-- 旋转按钮（仅移动端） -->
              <button
                class="action-btn rotate-btn mobile-only"
                @click="toggleOrientation"
                :title="isLandscape ? '切换为竖屏' : '切换为横屏'"
              >
                <img :src="icon__rotate" alt="旋转" />
              </button>
              <!-- 复制按钮 -->
              <button
                class="action-btn copy-btn"
                @click="copyCode"
                :title="copied ? '已复制' : '复制代码'"
              >
                <img v-if="!copied" :src="icon__copy" alt="复制" />
                <img v-else :src="icon__check" alt="已复制" />
              </button>
              <!-- 关闭按钮 -->
              <button
                class="action-btn close-btn"
                @click="closeFullscreen"
                title="退出全屏 (ESC)"
              >
                <img :src="icon__close" alt="关闭" />
              </button>
            </div>
          </div>

          <!-- 代码内容 -->
          <div class="code-fullscreen-content" ref="contentRef">
            <div v-html="codeHtml"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import icon__copy from '/icon__copy.svg'
import icon__check from '/icon__check.svg'
import icon__close from '/icon__close.svg'
import icon__rotate from '/icon__rotate.svg'

const ORIENTATION_KEY = 'code-fullscreen-orientation'

interface Props {
  isFullscreen: boolean
  codeHtml: string
  language?: string
  filename?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:isFullscreen': [value: boolean]
}>()

const contentRef = ref<HTMLElement | null>(null)
const copied = ref(false)
const isLandscape = ref(false)

// 检测是否为移动端
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
}

// 切换横竖屏
function toggleOrientation() {
  isLandscape.value = !isLandscape.value
  // 保存用户偏好
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      ORIENTATION_KEY,
      isLandscape.value ? 'landscape' : 'portrait'
    )
  }
}

function closeFullscreen() {
  emit('update:isFullscreen', false)
}

function copyCode() {
  if (!contentRef.value) return

  const codeElement = contentRef.value.querySelector('pre code')
  if (!codeElement) return

  const text = codeElement.textContent || ''
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isFullscreen) {
    closeFullscreen()
  }
}

watch(
  () => props.isFullscreen,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
      // 读取用户上次选择的方向
      if (typeof window !== 'undefined') {
        const savedOrientation = localStorage.getItem(ORIENTATION_KEY)
        // 如果有保存的偏好，使用保存的值；否则默认为竖屏
        if (savedOrientation) {
          isLandscape.value = savedOrientation === 'landscape'
        } else {
          isLandscape.value = false
        }
      }
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.code-fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-fullscreen-container {
  width: 100%;
  height: 100%;
  background-color: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s ease;
}

/* 横屏模式 */
.code-fullscreen-overlay.is-landscape {
  overflow: hidden;
}

.code-fullscreen-overlay.is-landscape .code-fullscreen-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 关键：宽度取视口高度，高度取视口宽度 */
  /* 这样旋转90度后，宽度（原高度100vh）会填满屏幕宽度 */
  width: 100vh;
  height: 100vw;
  /* 以左上角为中心旋转，然后平移到正确位置 */
  transform-origin: top left;
  transform: rotate(90deg) translateY(-100%);
  max-width: none;
  max-height: none;
}

.code-fullscreen-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.code-fullscreen-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.language-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.filename {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
}

.code-fullscreen-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn img {
  width: 16px;
  height: 16px;
  filter: var(--vp-icon-filter, none);
}

.action-btn:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.close-btn img {
  width: 20px;
  height: 20px;
}

/* 旋转按钮仅移动端显示 */
.mobile-only {
  display: none;
}

.code-fullscreen-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background-color: var(--vp-code-block-bg);
}

.code-fullscreen-content :deep(pre) {
  margin: 0 !important;
  background-color: transparent !important;
  padding: 0 !important;
}

.code-fullscreen-content :deep(code) {
  font-size: 14px !important;
  line-height: 1.7 !important;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .mobile-only {
    display: flex;
  }

  .code-fullscreen-overlay {
    padding: 0;
  }

  .code-fullscreen-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .code-fullscreen-toolbar {
    padding: 10px 16px;
  }

  .code-fullscreen-title {
    font-size: 13px;
  }

  .language-tag {
    font-size: 11px;
    padding: 3px 6px;
  }

  .filename {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
  }

  .code-fullscreen-content {
    padding: 16px;
  }

  .code-fullscreen-content :deep(code) {
    font-size: 12px !important;
  }

  /* 横屏模式下的字体调整 */
  .code-fullscreen-overlay.is-landscape .code-fullscreen-content :deep(code) {
    font-size: 14px !important;
  }
}

/* 过渡动画 */
.fullscreen-fade-enter-active,
.fullscreen-fade-leave-active {
  transition: opacity 0.3s ease;
}

.fullscreen-fade-enter-from,
.fullscreen-fade-leave-to {
  opacity: 0;
}

.fullscreen-fade-enter-active .code-fullscreen-container,
.fullscreen-fade-leave-active .code-fullscreen-container {
  transition: transform 0.3s ease;
}

.fullscreen-fade-enter-from .code-fullscreen-container {
  transform: scale(0.95);
}

.fullscreen-fade-leave-to .code-fullscreen-container {
  transform: scale(0.95);
}

/* 暗色模式图标适配 */
.dark .action-btn img {
  filter: invert(1);
}
</style>
