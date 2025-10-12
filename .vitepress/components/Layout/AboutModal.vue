<template>
  <!-- 使用 teleport 将 modal 放到 body 之下（避免父容器样式影响） -->
  <teleport to="body">
    <div v-if="modelValue" class="tm-modal-backdrop" @click.self="close">
      <div
        class="tm-modal"
        role="dialog"
        :aria-labelledby="titleId"
        aria-modal="true"
        ref="modalRef"
      >
        <header class="tm-modal-header">
          <h3 :id="titleId" class="tm-modal-title">
            <!-- 标题通过 slot #title 提供，未提供则使用 prop title -->
            <slot name="title">
              {{ title }}
            </slot>
          </h3>
          <button
            class="tm-close-btn"
            @click="close"
            aria-label="Close"
            title="Close"
            type="button"
          >
            ✕
          </button>
        </header>

        <section class="tm-modal-body">
          <!-- 默认插槽用于传入内容 -->
          <slot>
            <!-- fallback 内容（如果父组件没有传入插槽） -->
            <p>No content provided.</p>
          </slot>
        </section>

        <footer class="tm-modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'close'])

const modalRef = ref(null)
const titleId = `tm-title-${Math.random().toString(36).slice(2, 8)}`

// close modal (emit update and close)
function close() {
  emit('update:modelValue', false)
  emit('close')
}

// handle ESC to close
function onKeyDown(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    close()
  }
}

// focus trap: basic - focus modal when opened
watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      // small timeout to ensure element exists
      setTimeout(() => {
        if (modalRef.value) modalRef.value.focus && modalRef.value.focus()
      }, 0)
      document.addEventListener('keydown', onKeyDown)
      // prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  },
  { immediate: false }
)

onMounted(() => {
  if (props.modelValue) {
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.tm-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(16, 24, 32, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1200;
  padding: 1rem;
}

/* modal box */
.tm-modal {
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  border-radius: 12px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  outline: none;
}

/* header */
.tm-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: transparent;
}
.tm-modal-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
}

/* close btn */
.tm-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 6px;
}
.tm-close-btn:hover {
  background: var(--vp-c-bg-alt);
}

/* body */
.tm-modal-body {
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
}

/* footer (optional) */
.tm-modal-footer {
  padding: 0.6rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  text-align: right;
}
</style>
