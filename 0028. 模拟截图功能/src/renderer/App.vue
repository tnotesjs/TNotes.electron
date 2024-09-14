<template>
  <button @click="captureScreen">截图</button>
</template>

<script setup>
import {ipcRenderer} from 'electron';
const captureScreen = () => {
  ipcRenderer.send('cut-screen')
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
