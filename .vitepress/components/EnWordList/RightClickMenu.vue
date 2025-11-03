<template>
  <div
    v-if="show"
    :class="$style.rightClickMenu"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div :class="$style.menuItem" @click="handlePin">📌 Pin</div>
    <div :class="$style.menuItem" @click="(e) => handlePronounce(e, 'en-GB')">
      📢 Pronounce（英）
    </div>
    <div :class="$style.menuItem" @click="(e) => handlePronounce(e, 'en-US')">
      📢 Pronounce（美）
    </div>
    <div
      :class="$style.menuItem"
      @click="(e) => handlePronounceAll(e, 'en-GB')"
    >
      📢 Pronounce All（英）
    </div>
    <div
      :class="$style.menuItem"
      @click="(e) => handlePronounceAll(e, 'en-US')"
    >
      📢 Pronounce All（美）
    </div>
    <div :class="$style.menuItem" @click="handleAutoShowCard">
      🔍 Auto Show Card（{{ isAutoShowCard ? '关' : '开' }}）
    </div>
    <div :class="$style.menuItem" @click="handleCheckAll">✅ Check All</div>
    <div :class="$style.menuItem" @click="handleReset">❌ Reset</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  show: Boolean,
  isAutoShowCard: Boolean,
  x: Number,
  y: Number,
})

const emit = defineEmits(['pin', 'pronounce'])
const handlePin = (e) => {
  emit('pin')
  e.preventDefault()
}
const handleAutoShowCard = () => {
  emit('autoShowCard')
}
const handlePronounce = (e, lang) => {
  emit('pronounce', lang)
  e.preventDefault()
}
const handlePronounceAll = (e, lang) => {
  emit('pronounceAll', lang)
  e.preventDefault()
}
const handleCheckAll = () => {
  emit('checkAll')
}
const handleReset = () => {
  emit('reset')
}
</script>

<style module src="./RightClickMenu.module.scss"></style>
