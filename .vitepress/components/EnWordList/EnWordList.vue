<script setup>
import { computed, ref, onMounted } from 'vue'
import { EN_WORDS_REPO_BASE_URL } from '../constants.js'

const props = defineProps({
    words: {
        type: Array,
        default: () => [],
    },
})

/**
 * 当前页面路径名，用于生成唯一的 localStorage 键
 */
const pathname = window.location.pathname

/**
 * 去重后的排序单词数组
 */
const sortedWords = computed(() => [...new Set(props.words)].sort())

/**
 * 单词的勾选状态，使用 ref 存储
 */
const checkedStates = ref({})

/**
 * 初始化勾选状态：从 localStorage 加载
 */
onMounted(() => {
    sortedWords.value.forEach((word) => {
        const key = `${pathname}-${word}`
        const storedState = localStorage.getItem(key)
        checkedStates.value[word] = storedState === 'true'
    })
})

/**
 * 更新单词的勾选状态并保存到 localStorage
 * @param word 单词
 * @param isChecked 是否被勾选
 */
const updateCheckedState = (word, isChecked) => {
    const key = `${pathname}-${word}`
    checkedStates.value[word] = isChecked
    localStorage.setItem(key, isChecked)
}

/**
 * 生成单词链接
 * @param word 单词
 */
const generateLink = (word) => `${EN_WORDS_REPO_BASE_URL}${encodeURIComponent(word)}.md`

/**
 * 选中所有单词
 */
const checkAll = () => {
    Object.keys(checkedStates.value).forEach((word) => {
        updateCheckedState(word, true)
    })
}

/**
 * 重置所有单词的勾选状态
 */
const resetCheckedStates = () => {
    sortedWords.value.forEach((word) => {
        const key = `${pathname}-${word}`
        localStorage.removeItem(key) // 清除 localStorage 中的状态
        checkedStates.value[word] = false // 重置为未勾选
    })
}

/**
 * 打开或聚焦 enWrods 窗口
 */
 const openEnWords = () => {
    if (!window.enWrods || window.enWrods.closed) {
        // 如果窗口不存在或已关闭，则创建一个新的窗口
        window.enWrods = window.open('', 'enWrods', 'width=800,height=600')
        if (window.enWrods) {
            // 如果窗口成功打开，加载一个初始页面
            window.enWrods.location.href = 'about:blank'
        } else {
            // 如果窗口被浏览器阻止（如弹出窗口拦截器），提示用户
            alert('请允许弹出窗口以继续操作！')
        }
    } else {
        // 如果窗口已经存在，将其聚焦
        window.enWrods.focus()
    }
}
</script>

<template>
    <div class="__EnWordList__">
        <div class="btns-box">
            <button @click="checkAll">Check All</button>
            <button @click="resetCheckedStates">Reset</button>
        </div>

        <ol>
            <li v-for="word in sortedWords" :key="word">
                <input type="checkbox" :id="word" :checked="checkedStates[word]"
                    @change="(e) => updateCheckedState(word, e.target.checked)" />
                <label :for="word">
                    <a :href="generateLink(word)" target="enWrods" :class="{ 'line-through': checkedStates[word] }" @click="openEnWords()">
                        {{ word }}
                    </a>
                </label>
            </li>
        </ol>
    </div>
</template>

<style scoped>
.__EnWordList__ .btns-box {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.__EnWordList__ .btns-box button {
    margin-bottom: 10px;
    padding: 5px 10px;
    background-color: #888;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.__EnWordList__ .btns-box button:hover {
    background-color: #666;
}

.__EnWordList__ input[type='checkbox'] {
    margin: 8px;
    transform: scale(1.3);
    cursor: pointer;
}

.__EnWordList__ a {
    text-decoration: none;
    color: #007bff;
}

.__EnWordList__ a:hover {
    text-decoration: underline !important;
}

.__EnWordList__ a.line-through {
    /* text-decoration: line-through !important; */
    /* 添加删除线 */
    color: #999;
    /* 修改颜色以表示已勾选 */
}
</style>