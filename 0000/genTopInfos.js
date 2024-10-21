/**
 * genTopInfos.js
 * 批量读取 README.md 头部信息，并将读取到的结果写入到当前 __dirname 下的 topInfos.md 中。
 * 头部信息：是指从 README.md 中提取出来的从第二行开始（包括第二行）到第一个二级标题位置（不包括第一个二级标题所在行）的内容。
 * 格式示例：
 * # [0001. Electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90)
 * ```markdown
 * - 视频：electron.0001
 * - 认识 Electron 的最小组成
 * - Electron 的入口文件
 * - 实现一个 demo - 从 0 到 1 搭建一个 hello world 应用
 *
 * 知道 Electron 应用的最小组成，要求能够做到快速搭建一个简单的 Electron 学习环境，全程耗时控制在 1min ~ 3min（不算下载依赖耗时）实现一个小 demo，为接下来的 Electron 相关知识点的学习做准备。
 *
 * 本节内容，主要就是仨文件：
 *
 * - package.json 指定入口
 * - index.js 主进程
 * - index.html 渲染进程（非必需）
 * ```
 * # [0002. 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B)
 * ```markdown
 * - `contextBridge` 的基本使用
 *
 * 学会在开启 `contextIsolation` 的情况下，使用 `contextBridge` 来给渲染进程暴露 Electron API，使用系统的原生能力。
 * ```
 */
const fs = require('fs');
const path = require('path');
// const { EOL } = require('os');

const EOL = '\n';
const SEPERATOR = `${EOL}<!-- ====================>分隔符<==================== -->${EOL}`; // genTopInfos.js 跟 updateTopInfos.js 保持一致
const SEPARATOR_LEVEL_2 = '## '; // !NOTE 这是二级标题的前缀 这个前缀在头部信息中不允许出现
const IGNORE_DIRS = ['md-imgs', '.git', '.vscode', '0000', '9999. template'];
const BASE_DIR = path.resolve(__dirname, '..');
// console.log('BASE_DIR =>', BASE_DIR);
const REPO_URL = 'https://github.com/Tdahuyou/electron/tree/main';

const DIR_MAP = {};

function getDirList(base_path) {
  const dir_name_list = fs.readdirSync(base_path);
  for (let dir_name of dir_name_list) {
    if (IGNORE_DIRS.includes(dir_name)) continue;
    const file_path = path.join(base_path, dir_name);
    const stats = fs.lstatSync(file_path);

    if (stats.isDirectory()) {
      DIR_MAP[
        path.resolve(BASE_DIR, dir_name, 'README.md')
      ] = `### [${dir_name}](../${encodeURIComponent(dir_name)}/README.md) <!-- [github](${REPO_URL}/${encodeURIComponent(dir_name)}) -->`;
    }
  }
}

getDirList(BASE_DIR);
// console.log('DIR_MAP =>', DIR_MAP);
// DIR_MAP => {
// 'c:\\Users\\Tdahuyou\\Desktop\\notes\\electron\\0001. Electron 应用的最小组成\\README.md': '# [0001. Electron 应用的最小组成](../0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90/README.md)',
// 'c:\\Users\\Tdahuyou\\Desktop\\notes\\electron\\0002. 使用 contextBridge 暴露 API 给渲染进程\\README.md': '# [0002. 使用 contextBridge 暴露 API 给渲染进程](../0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B/README.md)'
// }
// key 是 readme 的绝对路径
// val 是本地 readme 的相对路径

// 用于存储所有顶部信息
let allTopInfos = [];

for (const key in DIR_MAP) {
  try {
    let readmeContent = fs.readFileSync(key, 'utf8');
    const val = DIR_MAP[key];

    // 将内容按行分割
    const lines = readmeContent.split(EOL);

    // 查找第一个二级标题的位置
    let firstHeading2Index = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].startsWith(SEPARATOR_LEVEL_2)) {
        firstHeading2Index = i;
        break;
      }
    }

    // 如果找到了二级标题，则提取从第二行到二级标题前一行的内容
    let topInfoLines = [];
    if (firstHeading2Index > 0) {
      topInfoLines = lines.slice(1, firstHeading2Index);
    } else {
      topInfoLines = lines.slice(1);
    }

    // 构建最终的顶部信息
    const topInfo = `${val}${EOL}${topInfoLines.join(EOL)}${EOL}${SEPERATOR}`;

    // 添加到所有顶部信息数组
    allTopInfos.push(topInfo);
  } catch (err) {
    console.error(`Failed to read or process ${key}:`, err);
  }
}

// 将所有顶部信息写入到 topInfos.md 文件
const topInfosFilePath = path.join(__dirname, 'topInfos.md');
fs.writeFileSync(topInfosFilePath, allTopInfos.join(''), 'utf8');
console.log(`Generated topInfos.md successfully.`);