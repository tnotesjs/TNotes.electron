<template>
  <div :class="$style.settingsWrapper">
    <!-- 本地路径配置 -->
    <section :class="$style.section">
      <div :class="$style.sectionHeader">
        <h2 :class="$style.sectionTitle">
          <span :class="$style.icon">📁</span>
          本地知识库路径
          <span
            :class="$style.infoIcon"
            @mouseenter="showTooltip('path')"
            @mouseleave="hideTooltip"
            @click="toggleTooltip('path')"
            >ℹ️
            <span v-if="activeTooltip === 'path'" :class="$style.tooltip">
              适用于 PC 桌面环境（Windows / macOS / Linux） 需要本地安装 VS Code
              编辑器 配置后可在侧边栏快速用 VS Code 打开笔记
            </span>
          </span>
        </h2>
        <span :class="$style.badge" v-if="path">已配置</span>
        <span :class="[$style.badge, $style.badgeWarning]" v-else>未配置</span>
      </div>

      <div :class="$style.formGroup">
        <div :class="$style.inputWrapper">
          <input
            id="notesPath"
            v-model="path"
            type="text"
            placeholder="例如: /Users/username/Documents/notes"
            :class="$style.formInput"
            @input="handlePathChange"
          />
          <button
            v-if="path"
            @click="clearPath"
            :class="$style.clearBtn"
            title="清空路径"
          >
            ✕
          </button>
        </div>
      </div>
    </section>

    <!-- 内容宽度配置 -->
    <section :class="$style.section">
      <div :class="$style.sectionHeader">
        <h2 :class="$style.sectionTitle">
          <span :class="$style.icon">📏</span>
          内容区宽度
          <span
            :class="$style.infoIcon"
            @mouseenter="showTooltip('contentWidth')"
            @mouseleave="hideTooltip"
            @click="toggleTooltip('contentWidth')"
            >ℹ️
            <span
              v-if="activeTooltip === 'contentWidth'"
              :class="$style.tooltip"
            >
              调整文章内容区域的最大宽度（全屏模式下不限制宽度）
            </span>
          </span>
        </h2>
        <span :class="$style.badge">{{ contentWidth }}</span>
      </div>

      <div :class="$style.widthOptions">
        <button
          :class="[
            $style.widthBtn,
            contentWidth === '688px' ? $style.active : '',
          ]"
          @click="setContentWidth('688px')"
          title="标准宽度 688px（VitePress 默认）"
        >
          标准 (688px)
        </button>
        <button
          :class="[
            $style.widthBtn,
            contentWidth === '755px' ? $style.active : '',
          ]"
          @click="setContentWidth('755px')"
          title="较大宽度 755px（适合宽屏）"
        >
          较大 (755px)
        </button>
      </div>
    </section>

    <!-- MarkMap 配置 -->
    <section :class="$style.section">
      <div :class="$style.sectionHeader">
        <h2 :class="$style.sectionTitle">
          <span :class="$style.icon">💡</span>
          MarkMap 思维导图
          <span
            :class="$style.infoIcon"
            @mouseenter="showTooltip('markmap')"
            @mouseleave="hideTooltip"
            @click="toggleTooltip('markmap')"
            >ℹ️
            <span v-if="activeTooltip === 'markmap'" :class="$style.tooltip">
              配置思维导图的默认显示效果
            </span>
          </span>
        </h2>
      </div>

      <div :class="$style.formRow">
        <div :class="$style.formGroup">
          <label for="markmapTheme" :class="$style.formLabel">
            分支主题
            <span
              :class="$style.infoIcon"
              @mouseenter="showTooltip('theme')"
              @mouseleave="hideTooltip"
              @click="toggleTooltip('theme')"
              >ℹ️
              <span v-if="activeTooltip === 'theme'" :class="$style.tooltip">
                选择思维导图分支的配色方案
              </span>
            </span>
          </label>
          <select
            id="markmapTheme"
            v-model="markmapTheme"
            :class="$style.formSelect"
          >
            <option value="default">默认主题</option>
            <option value="colorful">多彩主题</option>
            <option value="dark">深色主题</option>
          </select>
        </div>

        <div :class="$style.formGroup">
          <label for="markmapExpandLevel" :class="$style.formLabel">
            展开层级
            <span
              :class="$style.infoIcon"
              @mouseenter="showTooltip('level')"
              @mouseleave="hideTooltip"
              @click="toggleTooltip('level')"
              >ℹ️
              <span v-if="activeTooltip === 'level'" :class="$style.tooltip">
                设置思维导图初始展开的层级深度（1-100）
              </span>
            </span>
          </label>
          <div :class="$style.inputWrapper">
            <input
              id="markmapExpandLevel"
              v-model.number="markmapExpandLevel"
              type="number"
              min="1"
              max="100"
              :class="$style.formInput"
            />
            <span :class="$style.inputSuffix">层</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 保存按钮 -->
    <div :class="$style.actionBar">
      <button
        @click="save"
        :class="[$style.saveBtn, { [$style.disabled]: !hasChanges }]"
        :disabled="!hasChanges"
      >
        <span :class="$style.btnIcon">💾</span>
        {{ saveText }}
      </button>
      <button v-if="hasChanges" @click="reset" :class="$style.resetBtn">
        <span :class="$style.btnIcon">↩️</span>
        重置
      </button>
    </div>

    <!-- 保存成功提示 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" :class="$style.toast">
        <span :class="$style.toastIcon">✅</span>
        配置已保存成功！
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  NOTES_DIR_KEY,
  MARKMAP_THEME_KEY,
  MARKMAP_EXPAND_LEVEL_KEY,
} from '../constants'

const CONTENT_WIDTH_KEY = 'tnotes-content-width'

// ===================================
// #region 响应式数据
// ===================================
const path = ref('')
const originalPath = ref('')
const markmapTheme = ref('default')
const originalMarkmapTheme = ref('default')
const markmapExpandLevel = ref(5)
const originalMarkmapExpandLevel = ref(5)
const contentWidth = ref('688px')
const showSuccessToast = ref(false)
const activeTooltip = ref<string | null>(null)
// #endregion

// ===================================
// #region 计算属性
// ===================================
const hasChanges = computed(
  () =>
    path.value !== originalPath.value ||
    markmapTheme.value !== originalMarkmapTheme.value ||
    markmapExpandLevel.value !== originalMarkmapExpandLevel.value
)

const saveText = computed(() => {
  if (!hasChanges.value) return '无更改'
  return '保存配置'
})
// #endregion

// ===================================
// #region 生命周期
// ===================================
onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedPath = localStorage.getItem(NOTES_DIR_KEY) || ''
    path.value = savedPath
    originalPath.value = savedPath

    const savedTheme = localStorage.getItem(MARKMAP_THEME_KEY) || 'default'
    markmapTheme.value = savedTheme
    originalMarkmapTheme.value = savedTheme

    const savedLevel = localStorage.getItem(MARKMAP_EXPAND_LEVEL_KEY) || '5'
    markmapExpandLevel.value = parseInt(savedLevel)
    originalMarkmapExpandLevel.value = parseInt(savedLevel)

    const savedWidth = localStorage.getItem(CONTENT_WIDTH_KEY) || '688px'
    contentWidth.value = savedWidth
    applyContentWidth()
  }
})
// #endregion

// ===================================
// #region 事件处理
// ===================================
function handlePathChange() {
  // 可以在这里添加路径格式验证
}

function clearPath() {
  path.value = ''
}

function save() {
  if (!hasChanges.value) return

  try {
    localStorage.setItem(NOTES_DIR_KEY, path.value)
    localStorage.setItem(MARKMAP_THEME_KEY, markmapTheme.value)
    localStorage.setItem(
      MARKMAP_EXPAND_LEVEL_KEY,
      markmapExpandLevel.value.toString()
    )

    originalPath.value = path.value
    originalMarkmapTheme.value = markmapTheme.value
    originalMarkmapExpandLevel.value = markmapExpandLevel.value

    // 显示成功提示
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)
  } catch (error) {
    console.error('保存配置失败:', error)
    alert('保存失败，请检查浏览器设置')
  }
}

function reset() {
  path.value = originalPath.value
  markmapTheme.value = originalMarkmapTheme.value
  markmapExpandLevel.value = originalMarkmapExpandLevel.value
}

function showTooltip(id: string) {
  activeTooltip.value = id
}

function hideTooltip() {
  activeTooltip.value = null
}

function toggleTooltip(id: string) {
  activeTooltip.value = activeTooltip.value === id ? null : id
}

// 应用内容宽度（通过 CSS 变量）
function applyContentWidth() {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(
    '--tn-content-width',
    contentWidth.value
  )
}

// 设置内容宽度
function setContentWidth(width: string) {
  contentWidth.value = width
  localStorage.setItem(CONTENT_WIDTH_KEY, width)
  applyContentWidth()
}
// #endregion
</script>

<style module src="./Settings.module.scss"></style>
