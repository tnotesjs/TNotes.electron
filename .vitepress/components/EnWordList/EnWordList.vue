<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { marked } from 'marked'
import {
  EN_WORDS_REPO_BASE_URL,
  EN_WORDS_REPO_BASE_RAW_URL,
  EN_WORD_LIST_COMP_IS_AUTO_SHOW_CARD,
} from '../constants.ts'
import RightClickMenu from './RightClickMenu.vue'

const props = defineProps({
  words: {
    type: Array,
    default: () => [],
  },
  needSort: {
    type: Boolean,
    default: false,
  },
})

const isMobile = computed(() => {
  if (typeof navigator === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
})

// checkbox ---------------------------------------------------

const pathname = typeof window !== 'undefined' ? window.location.pathname : ''
const sortedWords = props.needSort
  ? computed(() =>
      [...new Set(props.words)].sort(
        (a, b) =>
          a.toLowerCase()[0].charCodeAt() - b.toLowerCase()[0].charCodeAt()
      )
    )
  : computed(() => [...new Set(props.words)])
const checkedStates = ref({})

const updateCheckedState = (word, isChecked) => {
  const key = `${pathname}-${word}`
  checkedStates.value[word] = isChecked
  localStorage.setItem(key, isChecked)
}

const checkAll = () => {
  Object.keys(checkedStates.value).forEach((word) => {
    updateCheckedState(word, true)
  })
  hideContextMenu()
}

const reset = () => {
  sortedWords.value.forEach((word) => {
    const key = `${pathname}-${word}`
    localStorage.removeItem(key)
    checkedStates.value[word] = false
  })
  hideContextMenu()
}

// word card ---------------------------------------------------

const topZIndex = ref(10000)

const isAutoShowCard = ref(false)

// 卡片状态
const showCard = ref(false)
const cardX = ref(0)
const cardY = ref(0)
const cardContent = ref('')
const wordCache = ref({})

// 加载失败的词汇（也就是词库中不存在的词汇）
const failedWords = ref({})

// pinnedCards: { id, word, x, y, isDragging }
const pinnedCards = ref([])
let draggingCard = null
let offsetX = 0
let offsetY = 0

const CARD_DEFAULT_WIDTH = 400
const CARD_DEFAULT_HEIGHT = 500

let resizingCard = null
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

// 右键菜单状态
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
let currentWordForContextMenu = null

// 防抖计时器
let hoverTimer = null

/**
 * 显示单词卡片
 */
const showWordCard = async (e, word) => {
  cardContent.value = '<em>加载中……</em>'
  return new Promise((resolve) => {
    clearTimeout(hoverTimer)
    hoverTimer = setTimeout(async () => {
      const { clientX, clientY } = e
      cardX.value = clientX + 10
      cardY.value = clientY + 10
      showCard.value = true

      if (wordCache.value[word]) {
        cardContent.value = wordCache.value[word]
        resolve()
        return
      }

      const url = `${EN_WORDS_REPO_BASE_RAW_URL}${encodeURIComponent(
        word.toLowerCase().replaceAll(/\s/g, '_')
      )}.md`
      try {
        const res = await fetch(url)
        if (res.ok) {
          let text = await res.text()
          text = marked.parse(text)
          wordCache.value[word] = text
          cardContent.value = text
        } else {
          cardContent.value = `<em>无法加载单词内容</em>`
        }
      } catch (err) {
        console.error(err)
        cardContent.value = `<em>加载失败</em>`
      }
      resolve()
    }, 300)
  })
}

// const convertMarkdownToHTML = (text) => {
//   const lines = text.trim().split('\n')
//   let stack = [{ level: -1, html: [] }]

//   for (let line of lines) {
//     const match = line.match(/^(\s*)-\s(.*)/)
//     if (!match) continue

//     const indent = match[1].length
//     const content = match[2]
//     const currentLevel = stack[stack.length - 1]

//     const imageMatch = content.match(/^!\$$(.+?)$$/)
//     const processedContent = imageMatch
//       ? `<img src="${imageMatch[1]}" alt="" />`
//       : content

//     // 1. 深了：如果缩进比上一级更深，开启新子列表
//     if (indent > currentLevel.level) {
//       stack.push({ level: indent, html: [] })
//     }
//     // 2. 浅了：如果缩进更浅，关闭之前的列表直到匹配层级
//     else if (indent < currentLevel.level) {
//       while (stack.length > 1 && stack[stack.length - 2].level >= indent) {
//         const closed = stack.pop()
//         const innerHTML = closed.html.join('')
//         stack[stack.length - 1].html.push(`<ul>${innerHTML}</ul>`)
//       }
//     }
//     // 3. 一致：stack[-1] 是与当前 indent 层级一致的节点，添加当前 li 内容。
//     stack[stack.length - 1].html.push(`<li>${processedContent}</li>`)
//   }

//   // 清理栈中剩余的 ul
//   while (stack.length > 1) {
//     const closed = stack.pop()
//     const innerHTML = closed.html.join('')
//     stack[stack.length - 1].html.push(`<ul>${innerHTML}</ul>`)
//   }
//   console.log(stack)

//   return stack[0].html.join('')
// }

const preloadWords = async () => {
  const wordsToPreload = sortedWords.value
  if (!wordsToPreload.length) return

  for (let i = 0; i < wordsToPreload.length; i++) {
    const word = wordsToPreload[i]

    // 如果已经缓存过，跳过
    if (wordCache.value[word]) continue

    const url = `${EN_WORDS_REPO_BASE_RAW_URL}${encodeURIComponent(
      word.toLowerCase().replaceAll(/\s/g, '_')
    )}.md`
    try {
      const res = await fetch(url)
      if (res.ok) {
        let text = await res.text()
        text = marked.parse(text)
        wordCache.value[word] = text
        console.log(`✅ 预加载完成: ${word}`)
      } else {
        wordCache.value[word] = `<em>无法加载单词内容</em>`
        failedWords.value[word] = true
      }
    } catch (err) {
      console.error(`❌ 加载失败: ${word}`, err)
      wordCache.value[word] = `<em>加载失败</em>`
      failedWords.value[word] = true
    }

    // 可选：加个延迟避免并发请求过多
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
}

const pinCard = (word) => {
  // const key = `${pathname}-${word}`
  // const storedState = localStorage.getItem(key)
  // if (!storedState || storedState !== 'true') {
  //   updateCheckedState(word, true)
  // }

  // 如果已存在该卡片则不再重复添加
  if (pinnedCards.value.some((card) => card.word === word)) return

  pinnedCards.value.push({
    id: Date.now(),
    word,
    x: cardX.value,
    y: cardY.value,
    content: cardContent.value,
    width: CARD_DEFAULT_WIDTH,
    height: CARD_DEFAULT_HEIGHT,
    zIndex: topZIndex.value++,
  })
}

const bringToFront = (card) => {
  const index = pinnedCards.value.indexOf(card)
  if (index > -1) {
    pinnedCards.value = [
      ...pinnedCards.value.slice(0, index),
      ...pinnedCards.value.slice(index + 1),
      { ...card, zIndex: topZIndex.value++ },
    ]
  }
}

const removeCard = (id) => {
  pinnedCards.value = pinnedCards.value.filter((card) => card.id !== id)
}

const startDrag = (card, e) => {
  draggingCard = card
  offsetX = e.clientX - card.x
  offsetY = e.clientY - card.y
  document.addEventListener('mousemove', onDragging)
  document.addEventListener('mouseup', stopDrag)
}

const onDragging = (e) => {
  if (!draggingCard) return
  draggingCard.x = e.clientX - offsetX
  draggingCard.y = e.clientY - offsetY
}

const stopDrag = () => {
  draggingCard = null
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDrag)
}

const showContextMenu = (e, word) => {
  e.preventDefault()
  currentWordForContextMenu = word
  contextMenuX.value = e.clientX
  contextMenuY.value = e.clientY
  contextMenuVisible.value = true
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
}

const handleContextMenuPin = () => {
  if (currentWordForContextMenu) {
    const word = currentWordForContextMenu
    // 提前加载内容
    showWordCard(
      { clientX: contextMenuX.value, clientY: contextMenuY.value },
      word
    ).then(() => {
      pinCard(word)
      showCard.value = false
    })
    hideContextMenu()
  }
}

const startResize = (card, e) => {
  resizingCard = card
  startX = e.clientX
  startY = e.clientY
  startWidth = card.width
  startHeight = card.height

  document.addEventListener('mousemove', onResizing)
  document.addEventListener('mouseup', stopResize)
}

const onResizing = (e) => {
  if (!resizingCard) return

  const newWidth = startWidth + (e.clientX - startX)
  const newHeight = startHeight + (e.clientY - startY)

  // 设置最小尺寸
  if (newWidth > 200) resizingCard.width = newWidth
  if (newHeight > 100) resizingCard.height = newHeight
}

const stopResize = () => {
  resizingCard = null
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResize)
}

/**
 * 处理鼠标离开事件
 */
const handleMouseLeave = () => {
  setTimeout(() => {
    hideWordCard()
  }, 100)
}

/**
 * 隐藏单词卡片
 */
const hideWordCard = () => {
  showCard.value = false
}

// pronounce ----------------------------------------------------------

let currentPronounceAllIndex = ref(0)
let isPronouncingAll = ref(false)
let pronounceAllInterval = null

const handlePronounceAll = (lang) => {
  if (isPronouncingAll.value) {
    // 如果正在播放，就停止
    stopPronounceAll()
    return
  }

  const wordsToSpeak = sortedWords.value
  if (!wordsToSpeak.length) return

  currentPronounceAllIndex.value = 0
  isPronouncingAll.value = true

  const speakNext = async () => {
    if (
      !isPronouncingAll.value ||
      currentPronounceAllIndex.value >= wordsToSpeak.length
    ) {
      stopPronounceAll()
      return
    }

    const word = wordsToSpeak[currentPronounceAllIndex.value]
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = lang
    speechSynthesis.speak(utterance)

    await nextTick()
    currentPronounceAllIndex.value++
  }

  speakNext()

  // 每隔 1.5 秒读一个词
  pronounceAllInterval = setInterval(speakNext, 1500)

  hideContextMenu()
}

const stopPronounceAll = () => {
  isPronouncingAll.value = false
  if (pronounceAllInterval) {
    clearInterval(pronounceAllInterval)
    pronounceAllInterval = null
  }
  speechSynthesis.cancel() // 停止所有未完成的语音
}

const handlePronounce = (word, lang = 'en-GB') => {
  if ('speechSynthesis' in window) {
    stopPronounceAll()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = lang
    speechSynthesis.speak(utterance)
    hideContextMenu()
  } else {
    alert('您的浏览器不支持语音功能，请尝试使用 Chrome 或 Edge 浏览器。')
  }
}

// hooks ----------------------------------------------------------

onMounted(() => {
  sortedWords.value.forEach((word) => {
    const key = `${pathname}-${word}`
    const storedState = localStorage.getItem(key)
    checkedStates.value[word] = storedState === 'true'
  })

  if (!isMobile.value) preloadWords()

  // 添加点击事件监听以隐藏右键菜单
  if (typeof document !== 'undefined') {
    document.body.addEventListener('click', hideContextMenu)
  }
})

/**
 * 销毁时清理定时器
 */
onUnmounted(() => {
  clearTimeout(hoverTimer)
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', onDragging)
    document.removeEventListener('mouseup', stopDrag)
    document.body.removeEventListener('click', hideContextMenu)
  }
})
</script>

<template>
  <div :class="$style.enWordList">
    <ol>
      <li
        v-for="(word, index) in sortedWords"
        :key="word"
        :class="{
          [$style.pronounced]:
            isPronouncingAll && currentPronounceAllIndex === index + 1,
        }"
      >
        <span :class="$style.index">{{ index + 1 }}.</span>
        <input
          type="checkbox"
          :id="word"
          :checked="checkedStates[word]"
          @change="(e) => updateCheckedState(word, e.target.checked)"
        />
        <label :for="word">
          <a
            :href="`${EN_WORDS_REPO_BASE_URL}${encodeURIComponent(
              word.toLowerCase().replaceAll(/\s/g, '_')
            )}.md`"
            :class="{
              [$style.lineThrough]: checkedStates[word],
              [$style.textRed]: failedWords[word],
            }"
            @mouseenter="(e) => isAutoShowCard && showWordCard(e, word)"
            @mouseleave="handleMouseLeave"
            @contextmenu="(e) => showContextMenu(e, word)"
            @click.ctrl.exact="(e) => handlePronounce(word)"
          >
            {{ word }}
          </a>
        </label>
      </li>
    </ol>

    <div
      :class="$style.wordCard"
      :style="{ left: cardX + 'px', top: cardY + 'px' }"
      v-if="showCard"
    >
      <div :class="$style.wordCardContent" v-html="cardContent"></div>
    </div>

    <!-- pinned cards -->
    <div
      v-for="card in pinnedCards"
      :key="card.id"
      :class="$style.wordCard"
      :style="{
        left: card.x + 'px',
        top: card.y + 'px',
        width: card.width + 'px',
        height: card.height + 'px',
        zIndex: card.zIndex,
      }"
      @mousedown="(e) => startDrag(card, e)"
      @click="bringToFront(card)"
    >
      <div :class="$style.wordCardContentWrapper">
        <div :class="$style.wordCardContent" v-html="card.content"></div>
      </div>
      <button :class="$style.closeBtn" @click.stop="removeCard(card.id)">
        ✖
      </button>
      <div
        :class="$style.resizeHandle"
        @mousedown.stop="startResize(card, $event)"
      ></div>
    </div>
  </div>

  <RightClickMenu
    v-if="!isMobile"
    :show="contextMenuVisible"
    :x="contextMenuX"
    :y="contextMenuY"
    :isAutoShowCard="isAutoShowCard"
    @pin="handleContextMenuPin"
    @pronounce="(lang) => handlePronounce(currentWordForContextMenu, lang)"
    @pronounceAll="(lang) => handlePronounceAll(lang)"
    @autoShowCard="
      () => {
        isAutoShowCard = !isAutoShowCard
        hideContextMenu()
      }
    "
    @checkAll="checkAll"
    @reset="reset"
  />
</template>

<style module src="./EnWordList.module.scss"></style>
