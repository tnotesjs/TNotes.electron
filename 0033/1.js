const Tesseract = require('tesseract.js');

// 指定图像文件路径
const imagePath = 'cropped2.png';

// 开始进行OCR识别
Tesseract.recognize(
  imagePath,
  // 'eng+chi_sim', // 指定识别的语言（中文+英文）
  'eng', // 指定识别的语言（英文）
  // 'chi_sim', // 指定识别的语言（中文）
  {
    logger: m => console.log('输出识别进度信息', m),
    tessedit_pageseg_mode: 6 // 使用单个块的文本行
  }
).then(({ data: { text } }) => {
  console.log('输出识别的文字', text);
}).catch(error => {
  console.error('OCR Error:', error);
});