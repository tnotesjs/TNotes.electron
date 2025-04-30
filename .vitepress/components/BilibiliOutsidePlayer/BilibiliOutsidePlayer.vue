<template>
  <iframe
    style="width: 100%; aspect-ratio: 16/9; margin: 1rem 0;"
    :src="'//player.bilibili.com/player.html?isOutside=true&bvid=' + id"
    scrolling="no"
    border="0"
    frameborder="no"
    framespacing="0"
    allowfullscreen="true"
  ></iframe>
</template>

<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
</style>
