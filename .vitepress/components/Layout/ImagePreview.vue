<template>
  <!-- #region img preview -->
  <div
    v-show="preview.visible"
    class="tn-preview"
    @click.self="closePreview"
    @wheel.prevent="onWheel"
  >
    <!-- 左侧切换按钮 -->
    <button
      v-if="preview.images.length > 1"
      class="tn-preview__nav tn-preview__nav--left"
      @click.stop="prevImage"
    >
      <img :src="icon__prev" alt="prev" />
    </button>
    <!-- 右侧切换按钮 -->
    <button
      v-if="preview.images.length > 1"
      class="tn-preview__nav tn-preview__nav--right"
      @click.stop="nextImage"
    >
      <img :src="icon__next" alt="next" />
    </button>

    <div class="tn-preview__toolbar">
      <button @click.stop="zoomOut" title="缩小">
        <img :src="icon__zoom_out" alt="zoom out" />
      </button>
      <button @click.stop="resetTransform" title="还原">
        <img :src="icon__restore" alt="restore" />
      </button>
      <button @click.stop="zoomIn" title="放大">
        <img :src="icon__zoom_in" alt="zoom in" />
      </button>
      <button class="tn-preview__close" @click.stop="closePreview" title="关闭">
        <img :src="icon__close" alt="close" />
      </button>
    </div>

    <img
      ref="previewImg"
      class="tn-preview__img"
      :src="preview.src"
      :style="previewStyle"
      @pointerdown="onPointerDown"
      draggable="false"
    />

    <!-- 底部页码指示器 -->
    <div v-if="preview.images.length > 1" class="tn-preview__counter">
      {{ preview.index + 1 }} / {{ preview.images.length }}
    </div>
  </div>
  <!-- #endregion -->
</template>

<script setup>
import icon__close from '/icon__close.svg'
import icon__next from '/icon__next.svg'
import icon__prev from '/icon__prev.svg'
import icon__restore from '/icon__restore.svg'
import icon__zoom_in from '/icon__zoom_in.svg'
import icon__zoom_out from '/icon__zoom_out.svg'

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const preview = ref({
  visible: false,
  src: '',
  scale: 1,
  tx: 0,
  ty: 0,
  images: [], // 当前文档里的所有图片 src
  index: -1, // 当前打开的索引
})

const previewImg = ref(null)

const previewStyle = computed(() => ({
  transform: `translate(${preview.value.tx}px, ${preview.value.ty}px) scale(${preview.value.scale})`,
  cursor: 'grab',
}))

function openPreview(src) {
  // 收集当前文档区所有 img
  const imgs = Array.from(document.querySelectorAll('.vp-doc img'))
    .filter(
      (img) =>
        !(img.dataset?.preview === 'false' || img.closest('.tn-preview-ignore'))
    )
    .map((img) => img.currentSrc || img.src)

  preview.value.images = imgs
  preview.value.index = imgs.indexOf(src)

  preview.value.visible = true
  preview.value.src = src
  preview.value.scale = 1
  preview.value.tx = 0
  preview.value.ty = 0
  // 锁滚动（可选）
  document.documentElement.style.overflow = 'hidden'
}

function prevImage() {
  if (preview.value.images.length <= 1) return
  preview.value.index =
    (preview.value.index - 1 + preview.value.images.length) %
    preview.value.images.length
  preview.value.src = preview.value.images[preview.value.index]
  resetTransform()
}

function nextImage() {
  if (preview.value.images.length <= 1) return
  preview.value.index = (preview.value.index + 1) % preview.value.images.length
  preview.value.src = preview.value.images[preview.value.index]
  resetTransform()
}

function closePreview() {
  preview.value.visible = false
  document.documentElement.style.overflow = ''
}

function zoomIn() {
  preview.value.scale = Math.min(3, preview.value.scale + 0.1)
}

function zoomOut() {
  preview.value.scale = Math.max(0.2, preview.value.scale - 0.1)
}

function resetTransform() {
  preview.value.scale = 1
  preview.value.tx = 0
  preview.value.ty = 0
}

// 滚轮缩放（以视口中心为参考，简单好用）
function onWheel(e) {
  const delta = -e.deltaY
  const factor = delta > 0 ? 1.1 : 1 / 1.1
  const next = Math.min(6, Math.max(0.2, preview.value.scale * factor))
  preview.value.scale = next
}

// 拖拽（Pointer Events，兼容鼠标/触屏）
let dragging = false
let startX = 0
let startY = 0
let baseX = 0
let baseY = 0

function onPointerDown(e) {
  dragging = true
  e.target.setPointerCapture?.(e.pointerId)
  startX = e.clientX
  startY = e.clientY
  baseX = preview.value.tx
  baseY = preview.value.ty
  previewImg.value?.classList.add('dragging')
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onPointerMove(e) {
  if (!dragging) return
  preview.value.tx = baseX + (e.clientX - startX)
  preview.value.ty = baseY + (e.clientY - startY)
}

function onPointerUp() {
  dragging = false
  previewImg.value?.classList.remove('dragging')
  window.removeEventListener('pointermove', onPointerMove)
}

// 键盘 ESC 关闭
function onKeydown(e) {
  if (!preview.value.visible) return
  if (e.key === 'Escape') closePreview()
  else if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'ArrowRight') nextImage()
  else if (e.key === 'Enter') toggleZoom()
  else if (e.key === 'ArrowUp') zoomIn()
  else if (e.key === 'ArrowDown') zoomOut()
}

// 事件委托：拦截正文区域的 <img> 点击
function onDocClick(e) {
  if (preview.value.visible) return // 预览层打开时忽略底下点击
  const target = e.target
  if (!target) return

  // 只处理正文：VitePress 主文档区常见容器：.vp-doc / .VPDoc .main
  const img = target.closest?.('img')
  if (!img) return
  const inDoc =
    img.closest('.vp-doc') || img.closest('.VPDoc') || img.closest('.main')

  if (!inDoc) return

  // 明确排除：带 data-preview="false" 或 .tn-preview-ignore 的图片
  if (img.dataset?.preview === 'false' || img.closest('.tn-preview-ignore'))
    return

  // 如果图片包了链接，阻止跳转
  const a = img.closest('a')
  if (a) {
    e.preventDefault()
    e.stopPropagation()
  }

  const src = img.currentSrc || img.src
  if (src) openPreview(src)
}

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* #region img preview */
/* 预览遮罩层 */
.tn-preview {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 工具栏 */
.tn-preview__toolbar {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 2;
}

.tn-preview__toolbar button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 42, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tn-preview__toolbar button img {
  width: 18px;
  height: 18px;
}

.tn-preview__toolbar button:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 左右切换按钮 */
.tn-preview__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.tn-preview__nav img {
  width: 2rem;
  height: 2rem;
}

.tn-preview__nav--left {
  left: 24px;
}

.tn-preview__nav--right {
  right: 24px;
}

.tn-preview__nav:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: translateY(-50%) scale(1.1);
}

/* 底部页码指示器 */
.tn-preview__counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  z-index: 2;
  user-select: none;
}
/* #endregion */
</style>
