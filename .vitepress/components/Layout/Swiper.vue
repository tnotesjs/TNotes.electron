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
          // loop: false,
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
        const isTnTabNavVisible = slides.length >= 2
        tabsEl.innerHTML = ''

        // 微调 tabs 容器样式
        if (isTnTabNavVisible) {
          tabsEl.style.padding = '0 0.8rem 0 3rem'
        } else {
          tabsEl.style.padding = '0 0.8rem'
        }

        // 左按钮 - 上一页
        if (isTnTabNavVisible) {
          const prevBtn = document.createElement('button')
          prevBtn.type = 'button'
          prevBtn.className = 'tn-tab-nav tn-tab-prev'
          prevBtn.textContent = '<'
          prevBtn.title = '上一页'
          prevBtn.addEventListener('click', () => {
            if (instance.activeIndex === 0) {
              // 到头 -> 跳到最后一张
              instance.slideTo(slides.length - 1)
            } else {
              instance.slidePrev()
            }
            setTimeout(() => {
              updateContainerHeight(container, instance.activeIndex)
            }, 0)
          })
          tabsEl.appendChild(prevBtn)

          const line = document.createElement('span')
          line.className = 'tn-tab-nav tab-tab-line'
          line.textContent = '/'
          tabsEl.appendChild(line)
        }

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

        // 右按钮 - 下一页
        if (isTnTabNavVisible) {
          const nextBtn = document.createElement('button')
          nextBtn.type = 'button'
          nextBtn.className = 'tn-tab-nav tn-tab-next'
          nextBtn.textContent = '>'
          nextBtn.title = '下一页'
          nextBtn.addEventListener('click', () => {
            if (instance.activeIndex === slides.length - 1) {
              // 到头 -> 跳到第一张
              instance.slideTo(0)
            } else {
              instance.slideNext()
            }
            setTimeout(() => {
              updateContainerHeight(container, instance.activeIndex)
            }, 0)
          })
          tabsEl.appendChild(nextBtn)
        }

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
  position: relative;
  /* position: sticky;
  top: var(--vp-nav-height); */
  z-index: 20;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 0.5rem;
  /* 
  通过 JS 控制 padding
  tab 数大于等于 2，预留出左右两侧的 padding 给 tab-nav 按钮
  padding: 0 0.8rem 0 3rem;
  tab 数小于 2，减少 padding
  padding: 0 0.8rem;
  */
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

/* tab 左右导航按钮 */
.tn-tab-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--vp-code-tab-text-color);
  padding: 0 0.3rem;
  transition: all 0.25s;
  /* 无法被选中 */
  user-select: none; /* 标准 */
  -webkit-user-select: none; /* 兼容 Safari/旧版 Chrome */
  -ms-user-select: none; /* 兼容旧版 IE/Edge */
  -webkit-touch-callout: none; /* 禁止 iOS Safari 长按时弹出菜单 */
}
.tn-tab-prev {
  left: 0.5rem;
}
.tab-tab-line {
  left: 1.1rem;
  color: var(--vp-code-tab-active-bar-color);
}
.tn-tab-next {
  left: 1.5rem;
}
.tn-tab-prev:hover,
.tn-tab-next:hover {
  color: var(--vp-code-tab-active-bar-color);
  font-size: 1rem;
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
  max-width: 100%;
  margin: 0 auto;
  /* 改为auto以保持图片原始比例 */
  height: auto;
  object-fit: contain;
}
</style>
