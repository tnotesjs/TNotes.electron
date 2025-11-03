<template>
  <!-- #region img preview -->
  <div
    v-show="preview.visible"
    :class="$style.tnPreview"
    @click.self="closePreview"
    @wheel.prevent="onWheel"
  >
    <!-- 左侧切换按钮 -->
    <button
      v-if="preview.images.length > 1"
      :class="[$style.nav, $style.navLeft]"
      @click.stop="prevImage"
    >
      <img :src="icon__prev" alt="prev" />
    </button>
    <!-- 右侧切换按钮 -->
    <button
      v-if="preview.images.length > 1"
      :class="[$style.nav, $style.navRight]"
      @click.stop="nextImage"
    >
      <img :src="icon__next" alt="next" />
    </button>

    <div :class="$style.toolbar">
      <button @click.stop="zoomOut" title="缩小">
        <img :src="icon__zoom_out" alt="zoom out" />
      </button>
      <button @click.stop="resetTransform" title="还原">
        <img :src="icon__restore" alt="restore" />
      </button>
      <button @click.stop="zoomIn" title="放大">
        <img :src="icon__zoom_in" alt="zoom in" />
      </button>
      <button :class="$style.close" @click.stop="closePreview" title="关闭">
        <img :src="icon__close" alt="close" />
      </button>
    </div>

    <img
      ref="previewImg"
      :class="[$style.img, { [$style.dragging]: isDragging }]"
      :src="preview.src"
      :style="previewStyle"
      @pointerdown="onPointerDown"
      draggable="false"
    />

    <!-- 底部页码指示器 -->
    <div v-if="preview.images.length > 1" :class="$style.counter">
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

const isDragging = ref(false)

const previewStyle = computed(() => ({
  transform: `translate(${preview.value.tx}px, ${preview.value.ty}px) scale(${preview.value.scale})`,
  cursor: 'grab',
}))

function openPreview(src) {
  // 收集当前文档区所有 img，排除：
  // 1. data-preview="false" 的图片
  // 2. .tn-preview-ignore 容器内的图片
  // 3. 组件工具栏按钮内的图标 (button > img)
  // 4. 导航按钮内的图标
  const imgs = Array.from(document.querySelectorAll('.vp-doc img'))
    .filter((img) => {
      // 排除明确标记不预览的
      if (
        img.dataset?.preview === 'false' ||
        img.closest('.tn-preview-ignore')
      ) {
        return false
      }

      // 排除按钮内的图标 (工具栏图标)
      if (img.closest('button')) {
        return false
      }

      // 排除小尺寸图标 (通常是图标而非内容图片)
      if (img.naturalWidth < 50 && img.naturalHeight < 50) {
        return false
      }

      return true
    })
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

// 拖拽(Pointer Events,兼容鼠标/触屏)
let dragging = false
let startX = 0
let startY = 0
let baseX = 0
let baseY = 0

function onPointerDown(e) {
  dragging = true
  isDragging.value = true
  e.target.setPointerCapture?.(e.pointerId)
  startX = e.clientX
  startY = e.clientY
  baseX = preview.value.tx
  baseY = preview.value.ty
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
  isDragging.value = false
  window.removeEventListener('pointermove', onPointerMove)
}

let downX = 0
function onPointerDownSwiper(e) {
  downX = e.clientX
}

// 事件委托：拦截正文区域的 <img> 点击
function onDocClick(e) {
  if (preview.value.visible) return // 预览层打开时忽略底下点击
  const target = e.target
  if (!target) return

  // 只处理正文：VitePress 主文档区常见容器：.vp-doc / .VPDoc .main
  const img = target.closest?.('img')
  if (!img) return
  const inDoc = img.closest('.main')
  if (!inDoc) return

  // 判断是否在 swiper 中切换图片
  const inSwiper = img.closest('.swiper-container')
  if (inSwiper) {
    const diffX = Math.abs(e.clientX - downX)
    // 只要水平位移超过阈值，就认为是滑动，而不是点击
    if (diffX > 5) {
      return
    }
  }

  // 明确排除：带 data-preview="false" 或 .tn-preview-ignore 的图片
  if (img.dataset?.preview === 'false' || img.closest('.tn-preview-ignore'))
    return

  // 排除按钮内的图标 (组件工具栏)
  if (img.closest('button')) return

  // 排除小尺寸图标
  if (img.naturalWidth < 50 && img.naturalHeight < 50) return

  // !禁止图片包含超链接
  // TODO
  // 做法 1：包含超链接的图片不支持 preview；
  // 做法 2：如果图片包了链接，阻止跳转，支持 preview；【当前的方案】
  // 做法 3：维护一个白名单，对特定类型的图片进行特殊处理；
  const a = img.closest('a')
  if (a) {
    e.preventDefault()
    e.stopPropagation()
  }

  const src = img.currentSrc || img.src
  if (src) openPreview(src)
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

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('pointerdown', onPointerDownSwiper, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('pointerdown', onPointerDownSwiper, true)
})
</script>

<style module src="./ImagePreview.module.scss"></style>
