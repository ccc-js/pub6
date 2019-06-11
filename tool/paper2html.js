let {md6} = require('../src/')

// 待新增 : md6.paperFileToPdf 的功能
// 參考 -- https://github.com/simonhaenisch/md-to-pdf
// 似乎是使用 puppeteer
// How to Create Printer-friendly Pages with CSS -- https://www.sitepoint.com/css-printer-friendly-pages/
md6.paperFileToHtml('../doc/journal/paper.md', '../doc/journal/paper.html')
