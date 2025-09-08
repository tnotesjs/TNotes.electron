<template></template>

<script setup>
import { useData } from 'vitepress'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

import 'swiper/css'

const vpData = useData()

const swiperInstances = ref([])

const initSwiper = () => {
  // 先清理旧实例
  destroySwiper()

  // 只在客户端动态加载
  import('swiper').then(({ default: Swiper }) => {
    import('swiper/modules').then(({ Navigation, Pagination }) => {
      const wrappers = document.querySelectorAll('.tn-swiper')
      wrappers.forEach((wrap) => {
        const container = wrap.querySelector('.swiper-container')
        const tabsEl = wrap.querySelector('.tn-swiper-tabs')
        if (!container || !tabsEl) return

        const instance = new Swiper(container, {
          loop: false,
          // TODO 可配置
          // effect: 'fade',
          speed: 0, // 禁用动画
          on: {
            slideChange: () => {
              updateActiveTab(wrap, instance.activeIndex)
              updateContainerHeight(container, instance.activeIndex)
            },
            // 在初始化时也设置一次高度
            afterInit: () => {
              setTimeout(() => {
                updateContainerHeight(container, instance.activeIndex)
              }, 0)
            },
          },
        })

        // 生成 tabs（文案来自 data-title；为空则为 'img'）
        const slides = wrap.querySelectorAll('.swiper-slide')
        tabsEl.innerHTML = ''
        slides.forEach((slide, i) => {
          const label = slide.getAttribute('data-title') || 'img'
          const btn = document.createElement('button')
          btn.type = 'button'
          btn.className = 'tn-tab' + (i === 0 ? ' active' : '')
          btn.textContent = label
          btn.addEventListener('click', () => {
            instance.slideTo(i)
            // 点击tab时更新高度
            setTimeout(() => {
              updateContainerHeight(container, i)
            }, 0)
          })
          tabsEl.appendChild(btn)
        })

        swiperInstances.value.push(instance)
      })
    })
  })
}

function updateActiveTab(wrap, activeIndex) {
  const btns = wrap.querySelectorAll('.tn-swiper-tabs .tn-tab')
  btns.forEach((b, i) => b.classList.toggle('active', i === activeIndex))
}

// 新增函数：根据当前slide中的图片高度更新容器高度
function updateContainerHeight(container, activeIndex) {
  const slides = container.querySelectorAll('.swiper-slide')
  if (slides[activeIndex]) {
    const img = slides[activeIndex].querySelector('img')
    if (img && img.complete) {
      // 如果图片已加载完成，直接设置高度
      container.style.height = img.offsetHeight + 'px'
    } else if (img) {
      // 如果图片未加载完成，等待加载完成后设置高度
      img.onload = () => {
        container.style.height = img.offsetHeight + 'px'
      }
    }
  }
}

function destroySwiper() {
  swiperInstances.value.forEach((inst) => {
    try {
      inst.destroy(true, true)
    } catch {}
  })
  swiperInstances.value = []
}

onBeforeUnmount(destroySwiper)

onMounted(() => {
  initSwiper()
})

watch(
  () => vpData.page.value.relativePath,
  () => {
    initSwiper()
  }
)
</script>

<style>
/* 顶部 tabs（随页面滚动吸顶，兼容 VitePress 顶栏） */
.tn-swiper-tabs {
  position: sticky;
  top: var(--vp-nav-height);
  z-index: 20;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 0.5rem;
  padding: 0 0.8rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  border-radius: 8px 8px 0 0;
  background-color: var(--vp-code-tab-bg);
  box-shadow: inset 0 -1px var(--vp-code-tab-divider);
}

/* tab 按钮 */
.tn-tab {
  position: relative;
  padding: 0.25rem 0.75rem;
  line-height: 2rem;
  border-bottom: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;
  color: var(--vp-code-tab-text-color);
}
.tn-tab::after {
  position: absolute;
  right: 8px;
  bottom: -1px;
  left: 8px;
  z-index: 1;
  height: 2px;
  border-radius: 2px;
  content: '';
  background-color: transparent;
  transition: background-color 0.25s;
}
.tn-tab.active {
  color: var(--vp-code-tab-active-text-color);
}
.tn-tab.active::after {
  background-color: var(--vp-code-tab-active-bar-color);
}

/* 修改 swiper-container 样式以支持动态高度 */
.swiper-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
  /* 添加高度变化的过渡动画 */
  transition: height 0.3s ease;
}

.swiper-container img {
  display: block;
  width: 100%;
  /* 改为auto以保持图片原始比例 */
  height: auto;
  object-fit: contain;
}
</style>
