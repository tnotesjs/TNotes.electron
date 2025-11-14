<template></template>

<script setup>
import { useData, onContentUpdated } from 'vitepress'
import { ref, onMounted, onBeforeUnmount } from 'vue'

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

// 监听内容更新（包括 HMR 和路由变化）
onContentUpdated(() => {
  initSwiper()
})
</script>
