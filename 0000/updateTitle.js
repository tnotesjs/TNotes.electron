/**
 * 批量更新标题
 */
const fs = require('fs');
const path = require('path');

const REPO_URL = 'https://github.com/Tdahuyou/electron/tree/main';
const IGNORE_DIRS = ['md-imgs', '.git', '.vscode', '0000', '9999. template'];
const BASE_DIR = path.resolve(__dirname, '..');
// console.log('BASE_DIR =>', BASE_DIR);

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
      ] = `# [${dir_name}](${REPO_URL}/${encodeURIComponent(dir_name)})`;
    }
  }
}

getDirList(BASE_DIR);
// console.log('DIR_MAP =>', DIR_MAP);
// DIR_MAP => {
//   'c:\\Users\\Tdahuyou\\Desktop\\notes\\electron\\0001. Electron 应用的最小组成\\README.md': '# [0001. Electron 应用的最小组成](https://github.com/Tdahuyou/electron/tree/main/0001.%20Electron%20%E5%BA%94%E7%94%A8%E7%9A%84%E6%9C%80%E5%B0%8F%E7%BB%84%E6%88%90)',
//   'c:\\Users\\Tdahuyou\\Desktop\\notes\\electron\\0002. 使用 contextBridge 暴露 API 给渲染进程\\README.md': '# [0002. 使用 contextBridge 暴露 API 给渲染进程](https://github.com/Tdahuyou/electron/tree/main/0002.%20%E4%BD%BF%E7%94%A8%20contextBridge%20%E6%9A%B4%E9%9C%B2%20API%20%E7%BB%99%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B)',
// }

let successCount = 0;
for (const key in DIR_MAP) {
  try {
    let readmeContent = fs.readFileSync(key, 'utf8');
    const val = DIR_MAP[key];

    // 将 readmeContent 中的第一行替换为 val
    const lines = readmeContent.split('\n');
    if (lines.length > 0) {
      lines[0] = val;  // 替换第一行
    } else {
      lines.push(val); // 如果文件为空，则添加新行
    }

    const updatedContent = lines.join('\n');
    fs.writeFileSync(key, updatedContent, 'utf8');
    successCount++;
    // console.log(`Updated ${key} successfully.`);
  } catch (err) {
    console.error(`Failed to update ${key}:`, err);
  }
}

if (successCount === Object.keys(DIR_MAP).length) {
  console.log('All files updated successfully.');
} else {
  console.error(`Failed to update ${Object.keys(DIR_MAP).length - successCount} files.`);
}