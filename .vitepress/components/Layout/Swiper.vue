<template></template>

<script setup>
import { useData } from 'vitepress'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
// doc: https://swiperjs.com/demos

// import Swiper from 'swiper'
// import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'

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
        // const paginationEl = wrap.querySelector('.swiper-pagination')
        // const nextEl = wrap.querySelector('.swiper-button-next')
        // const prevEl = wrap.querySelector('.swiper-button-prev')
        if (!container || !tabsEl) return

        const instance = new Swiper(container, {
          // modules: [Navigation, Pagination],
          // slidesPerView: 1,
          // spaceBetween: 30,
          loop: false, // tab 与索引一一对应，更直观
          // pagination: paginationEl
          //   ? { el: paginationEl, clickable: true }
          //   : undefined,
          // navigation: nextEl && prevEl ? { nextEl, prevEl } : undefined,
          on: {
            slideChange: () => updateActiveTab(wrap, instance.activeIndex),
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
          btn.addEventListener('click', () => instance.slideTo(i))
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
  /* max-width: 20rem; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
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
  /* background: var(--vp-c-brand-1); */
  color: var(--vp-code-tab-active-text-color);
  /* border-bottom-color: var(--vp-c-brand-1); */
}
.tn-tab.active::after {
  background-color: var(--vp-code-tab-active-bar-color);
}
/* add some custom styles to set Swiper size */
.swiper-container {
  width: 100%;
  aspect-ratio: 16/9;
  position: relative;
  overflow: hidden;
  margin: 1rem 0;
}

.swiper-container img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* .swiper-container .swiper-pagination-bullet {
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #1a1a1a;
    opacity: .2;
    background: rgba(0, 0, 0, 0.2);
}

.swiper-container .swiper-pagination-bullet:hover {
  opacity: 0.8;
}

.swiper-container .swiper-pagination-bullet-active {
  color: #fff;
  background: var(--vp-c-brand-1);
  opacity: 0.8;
}

.swiper-container .swiper-button-prev:after,
.swiper-container .swiper-button-next:after {
  font-size: 1.5rem;
}

.swiper-container .swiper-button-prev,
.swiper-container .swiper-button-next {
  transition: all 0.3s;
  opacity: 0.5;
}

.swiper-container .swiper-button-prev:hover,
.swiper-container .swiper-button-next:hover {
  transform: scale(1.5);
  opacity: 1;
}
*/
</style>
