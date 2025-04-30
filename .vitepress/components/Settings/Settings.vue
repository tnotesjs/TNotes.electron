<template>
    <div class="container">
        <p class="label">
            <label for="path">⚙️ {{ NOTES_DIR_KEY }}:</label>
        </p>
        <p class="input-container">
            <input id="path" v-model="path" placeholder="请输入当前笔记文件夹所在位置" class="input" />
        </p>
        <p class="button-container">
            <button @click="save" class="button">save</button>
        </p>
        <ul class="instructions">
            <li>配置本地笔记文件夹所在位置，以便使用 VSCode 快速打开笔记。</li>
            <li>⚠️ 注意：要求是 PC 环境。</li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { NOTES_DIR_KEY } from '../constants.js'

const path = ref('')
if (typeof window !== 'undefined') {
    path.value = localStorage.getItem(NOTES_DIR_KEY)
}

const save = () => {
    localStorage.setItem(NOTES_DIR_KEY, path.value)
    alert(`\n${path.value}\n\n 笔记文件夹位置已保存!`)
}
</script>

<style scoped>
.container {
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
}

.label {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.input-container {
    margin-bottom: 20px;
}

.input {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #88888888;
    border-radius: 4px;
    transition: border-color 0.3s ease;
}

.input:focus {
    border-color: var(--vp-c-brand-1);
    outline: none;
    box-shadow: 0 0 4px var(--vp-c-brand-2);
}

.button-container {
    text-align: right;
}

.button {
    padding: 10px 15px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--vp-c-brand-1);
    transition: background-color 0.3s ease;
}

.button:hover {
    background-color: var(--vp-c-brand-2);
}

.instructions {
    margin-top: 20px;
    font-size: 14px;
    line-height: 1.6;
}
</style>