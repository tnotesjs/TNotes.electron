<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js'
import {
  EN_WORDS_REPO_BASE_URL,
  EN_WORDS_REPO_BASE_RAW_URL,
} from '../constants.js'
import RightClickMenu from './RightClickMenu.vue'

const props = defineProps({
  words: {
    type: Array,
    default: () => [],
  },
})

// checkbox ---------------------------------------------------

const pathname = window.location.pathname
const sortedWords = computed(() => [...new Set(props.words)].sort())
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
}

const resetCheckedStates = () => {
  sortedWords.value.forEach((word) => {
    const key = `${pathname}-${word}`
    localStorage.removeItem(key)
    checkedStates.value[word] = false
  })
}

const areAllChecked = computed(() => {
  const allWords = sortedWords.value
  return (
    allWords.length > 0 && allWords.every((word) => checkedStates.value[word])
  )
})

const isIndeterminate = computed(() => {
  const allWords = sortedWords.value
  const checkedCount = allWords.filter(
    (word) => checkedStates.value[word]
  ).length
  return checkedCount > 0 && checkedCount < allWords.length
})

const toggleAllCheckboxes = () => {
  if (areAllChecked.value || isIndeterminate.value) {
    resetCheckedStates()
  } else {
    checkAll()
  }
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

// pinnedCards: { id, word, x, y, isDragging }
const pinnedCards = ref([])
let draggingCard = null
let offsetX = 0
let offsetY = 0

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

      const url = `${EN_WORDS_REPO_BASE_RAW_URL}${encodeURIComponent(word)}.md`
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
    width: 500,
    height: 400,
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

// hooks ----------------------------------------------------------

onMounted(() => {
  sortedWords.value.forEach((word) => {
    const key = `${pathname}-${word}`
    const storedState = localStorage.getItem(key)
    checkedStates.value[word] = storedState === 'true'
  })
})

/**
 * 销毁时清理定时器
 */
onUnmounted(() => {
  clearTimeout(hoverTimer)
  document.removeEventListener('mousemove', onDragging)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="__EnWordList__">
    <h3>功能提示：</h3>
    <ul>
      <li>单击 toggle-checkbox，将批量切换单词的完成状态。</li>
      <li>
        勾选
        toggle-auto-show-card，将自动展示单词卡片。（适合快速过一遍所有词汇）
      </li>
      <li>右键单词 -> 📌 pin 单词卡片。（适合将个别模糊词汇单独拎出来）</li>
    </ul>
    <h3>词汇列表：</h3>
    <div class="btns-box">
      <div
        class="toggle-checkbox"
        title="toggle-checkbox"
        @click="toggleAllCheckboxes"
      >
        <span v-if="isIndeterminate">➖</span>
        <span v-else-if="areAllChecked">❌</span>
        <span v-else>✅</span>
      </div>
      <div class="toggle-auto-show-card" title="toggle-auto-show-card">
        <input type="checkbox" v-model="isAutoShowCard" />
      </div>
    </div>

    <ol>
      <li v-for="(word, index) in sortedWords" :key="word">
        <span class="index">{{ index + 1 }}.</span>
        <input
          type="checkbox"
          :id="word"
          :checked="checkedStates[word]"
          @change="(e) => updateCheckedState(word, e.target.checked)"
        />
        <label :for="word">
          <a
            :href="`${EN_WORDS_REPO_BASE_URL}${encodeURIComponent(word)}.md`"
            :class="{ 'line-through': checkedStates[word] }"
            @mouseenter="(e) => isAutoShowCard && showWordCard(e, word)"
            @mouseleave="handleMouseLeave"
            @contextmenu="(e) => showContextMenu(e, word)"
          >
            {{ word }}
          </a>
        </label>
      </li>
    </ol>

    <div
      class="word-card"
      :style="{ left: cardX + 'px', top: cardY + 'px' }"
      v-if="showCard"
    >
      <div class="word-card-content" v-html="cardContent"></div>
    </div>

    <!-- pinned cards -->
    <div
      v-for="card in pinnedCards"
      :key="card.id"
      class="word-card pinned"
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
      <div class="word-card-content-wrapper">
        <div class="word-card-content" v-html="card.content"></div>
      </div>
      <button class="close-btn" @click.stop="removeCard(card.id)">✖</button>
      <div
        class="resize-handle"
        @mousedown.stop="startResize(card, $event)"
      ></div>
    </div>
  </div>

  <RightClickMenu
    :show="contextMenuVisible"
    :x="contextMenuX"
    :y="contextMenuY"
    @pin="handleContextMenuPin"
  />
</template>

<style scoped>
.__EnWordList__ .btns-box {
  display: flex;
  margin: 1rem;
  gap: 1rem;
}

.__EnWordList__ .toggle-checkbox,
.__EnWordList__ .toggle-auto-show-card {
  cursor: pointer;
}

.__EnWordList__ .toggle-auto-show-card >>> input {
  margin: 0 !important;
}

.__EnWordList__ input[type='checkbox'] {
  margin: 8px;
  transform: scale(1.3);
  cursor: pointer;
}

.__EnWordList__ a {
  text-decoration: none;
  color: #4fc3f7;
}

.__EnWordList__ a:hover {
  text-decoration: underline !important;
}

.__EnWordList__ a.line-through {
  color: #999;
  text-decoration: line-through;
}

/* 调整单词列表的间距 */
.__EnWordList__ ol {
  list-style-type: decimal;
  padding-left: 20px;
}

.__EnWordList__ ol li {
  display: flex;
  align-items: center;
  margin-bottom: 8px; /* 调整行间距 */
}

.__EnWordList__ .index {
  margin-right: 10px;
  color: #aaa;
}

/* 🌑 暗色悬浮卡片 */
.__EnWordList__ .word-card {
  position: fixed;
  z-index: 9999;
  background: #1e1e1e;
  border: 1px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 12px 16px;
  max-width: 600px; /* 可选 */
  min-width: 200px;
  min-height: 100px;
  font-size: 14px;
  line-height: 1.4;
  border-radius: 8px;
  color: #eee;
  pointer-events: auto;
  font-family: sans-serif;
  cursor: move;
}

.__EnWordList__ .word-card-content-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* Resize Handle 样式 */
.__EnWordList__ .resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 12px;
  height: 12px;
  background-color: #666;
  cursor: nwse-resize;
  z-index: 2;
  border-radius: 50%;
}

.__EnWordList__ .resize-handle:hover {
  background-color: #aaa;
}

.__EnWordList__ .word-card .close-btn {
  position: absolute;
  right: 5px;
  top: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #ccc;
}

.__EnWordList__ .word-card .close-btn:hover,
.__EnWordList__ .word-card .pin-btn:hover {
  color: white;
}

.__EnWordList__ .word-card-content >>> ul {
  margin: 0.5rem 0;
  padding-left: 1rem;
}
</style>
