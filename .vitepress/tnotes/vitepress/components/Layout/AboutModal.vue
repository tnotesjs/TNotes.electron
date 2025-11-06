<template>
  <!-- 使用 teleport 将 modal 放到 body 之下（避免父容器样式影响） -->
  <teleport to="body">
    <div v-if="modelValue" :class="$style.modalBackdrop" @click.self="close">
      <div
        :class="$style.modal"
        role="dialog"
        :aria-labelledby="titleId"
        aria-modal="true"
        ref="modalRef"
      >
        <header :class="$style.modalHeader">
          <h3 :id="titleId" :class="$style.modalTitle">
            <!-- 标题通过 slot #title 提供，未提供则使用 prop title -->
            <slot name="title">
              {{ title }}
            </slot>
          </h3>
          <button
            :class="$style.closeBtn"
            @click="close"
            aria-label="Close"
            title="Close"
            type="button"
          >
            ✕
          </button>
        </header>

        <section :class="$style.modalBody">
          <!-- 默认插槽用于传入内容 -->
          <slot>
            <!-- fallback 内容（如果父组件没有传入插槽） -->
            <p>No content provided.</p>
          </slot>
        </section>

        <footer :class="$style.modalFooter" v-if="$slots.footer">
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

<style module src="./AboutModal.module.scss"></style>
