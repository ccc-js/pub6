const M = module.exports = {}
const path = require('path')
const JSOX = require('jsox') // JSON6 格式的 parser -- https://github.com/d3x0r/JSON6
const hljs = require('highlight.js'); // https://highlightjs.org/
const puppeteer = require('puppeteer')
const fs6 = require('../fs6/')
const uu6 = require('js6/uu6')
const mdit = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return ''; // use external default escaping
  }
})

mdit.use(require('markdown-it-katex'))

M.parse = function (md) {
  return mdit.parse(md)
}

/* 這會有危險 */
M.expand = function (text, ctx) {
  let rText = text
  // console.log('============text===========\n', text)
  with (ctx) {
    // rText = eval('`'+text+'`')
  }
  return rText
}

M.parse = function (md) { // 1   2        3                  4           5            6
  let m = md.trim().match(/^(```(\w*)?\s*([\s\S]*?)```)?\s*([\s\S]*?)\s*(```reference([\s\S]*?)```)?$/)
  if (m == null) return null
  // console.log('m=%j', m.slice(2))
  let type = (m[2]||'').trim()
  let meta = JSOX.parse('{' + (m[3]||'') + '}')
  let body = (m[4]||'').trim()
  let ref = JSOX.parse('{' + (m[6]||'') + '}')
  return {type, meta, body, ref}
}

M.bib2html = function (bib) {
  let refs = []
  let i = 1
  for (let id in bib) {
    let {title, url, year, author, booktitle} = bib[id]
    refs.push(`
<li>
  <a id="${id}"></a>
  ${author} , 
  <em>"${url==null? title : '<a href="' + url + '">' + title + '</a>'}"</em>, 
  ${booktitle ? booktitle+',' : ''}
  ${year}
</li>`)
  }
  return `\n<ol class="referene">\n${refs.join('\n')}\n</ol>`
}

M.mdToHtml = function (md) {
  if (md == null) return ''
  return mdit.render(md)
}

const htmlHead = `
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="main.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/atom-one-light.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
</head>
<body>
`

const htmlTail = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
<script src="main.js">
</script>
</body>
</html>
`

M.toHtml = function (md, plugin={}) {
  let r = M.parse(md), html=null
  if (r == null) return
  let {type, meta, body, ref} = r
  meta.abstract = meta.abstract || ''
  html = `${htmlHead}
  <title>${meta.title}</title>
  <header>
    <label class="toggle" onclick="toggleSidebar()">≡</label>
  </header>
  <div class="booktitle">${M.mdToHtml(plugin.header)}</div>
  <aside>
  <label class="toggle" onclick="toggleSidebar()">≡</label>
  <div class="content">
  ${M.mdToHtml(plugin.sidebar)}
  </div>
  </aside>
  <article>
  <div class="header">
    <h1 class="title">${meta.title}</h1>
    <p class="author">${meta.author}</p>
    <p class="abstract">${meta.abstract.replace(/\n/g, '<br>')}</p>
  </div>
  ${M.mdToHtml(body)}
  <div class="reference">
  ${!uu6.eq(ref, {}) ? `<h2>Reference</h2>`+M.bib2html(ref) : ''}
  </div>
  </article>
  <footer>${M.mdToHtml(plugin.footer)}</footer>
  ${htmlTail}
  `
  return html
}

M.mdToTex = function (md) {
  // 尚未完成， mdToTex 並沒有真的轉成 tex
  throw Error('M.mdToTex not implemented!')
  return md
}

let texHead = `
\\documentclass{article}
\\usepackage{arxiv}
\\usepackage[utf8]{inputenc} % allow utf-8 input
\\usepackage[T1]{fontenc}    % use 8-bit T1 fonts
\\usepackage{hyperref}       % hyperlinks
\\usepackage{url}            % simple URL typesetting
\\usepackage{booktabs}       % professional-quality tables
\\usepackage{amsfonts}       % blackboard math symbols
\\usepackage{nicefrac}       % compact symbols for 1/2, etc.
\\usepackage{microtype}      % microtypography
\\usepackage{lipsum}
\\usepackage{graphicx}  % 使用圖片
\\usepackage{listings}   % 使用程式碼嵌入
\\usepackage{fontspec}   %加這個就可以設定字體
\\usepackage{xeCJK}       %讓中英文字體分開設置
\\setCJKmainfont{細明體} % SimSun, 標楷體, 設定中文為系統上的字型，而英文不去更動，使用原TeX字型
\\XeTeXlinebreaklocale "zh"             %這兩行一定要加，中文才能自動換行
\\XeTeXlinebreakskip = 0pt plus 1pt     %這兩行一定要加，中文才能自動換行
`

let texTail = `
\\end{thebibliography}
\\end{document}
`

M.toTex = function (md) {
  let r = M.parse(md), tex=null
  if (r == null) return
  let {type, meta, body, ref} = r
  // console.log('meta=%j body=%s ref=%j', meta, body, ref)
  let {title, author, abstract, keywords} = meta
  tex = `${texHead}
\\title{${title}}
\\author{${author}}
\\begin{document}
\\maketitle
\\begin{abstract}
${abstract.replace(/\n/g, '\\\\')}
\\end{abstract}
\\keywords{${keywords.replace(/,/g, ' \\and ')}}
${M.mdToTex(body, meta)}
\\bibliographystyle{unsrt}  
\\begin{thebibliography}{1}
${texTail}
\end{document}
`
  return tex
}
// ${M.mdToTex(M.expand(body, meta))}


M.convert = function (md, toFormat='html', plugin={}) {
  switch (toFormat) {
    case 'html': return M.toHtml(md, plugin)
    case 'tex' : return M.toTex(md, plugin)
    default: throw Error('M.convert: toFormat='+toFormat+' not supported!')
  }
}


M.htmlFileToPdf = async function (htmlFile, pdfFile, meta) {
  let browser = await puppeteer.launch({
    // headless: false
  })
  let htmlPath = 'file://' + path.resolve(htmlFile)
  let pdfPath = 'file://' + path.resolve(pdfFile)
  console.log('pdfPath=%s', pdfPath)
  let page = await browser.newPage()
  await page.goto(htmlPath)
  await page.emulateMedia('print')
  await page.pdf({
    path: pdfFile, 
    format: 'A4', 
    margin: {top: 60, bottom: 60, left: 40, right: 40 },
    printBackground: true,
    displayHeaderFooter: true,
    // headerTemplate 參考 https://github.com/GoogleChrome/puppeteer/issues/2167
    headerTemplate: `<div class='text center'></div>`, // <div class='text left'>${meta.bookTitle||''} / ${meta.title}</div><div class=''></div>`, // <div class='date text left'></div><div class='title text center'></div>`, 
    footerTemplate: `
    <div class='text center grow'>
      <span class='pageNumber'></span>
    </div>`,
    // <div class='text left '></div><div class='url text left grow'></div>  `<footer>page : <span class="pageNumber"></span>/<span class="totalPages"></span></footer>`,
    // preferCSSPageSize: true,
  })
  await browser.close()
}

M.convertFile = async function (mdFile, options, plugin={}) {
  let { dir, base, ext, name } = path.parse(mdFile)
  var toFile = null, toText = null
  if (ext !== '.md') return
  try {
    console.log('  convert:%s', mdFile)
    let md = await fs6.readText(mdFile)
    // console.log('md=%s', md)
    if (options.toHtml || options.toPdf) { // 轉為 html 檔
      toFile = path.join(dir, name+'.html')
      let {meta} = M.parse(md)
      console.log('  meta.title=%s', meta.title)
      toText = M.convert(md, 'html', plugin)
      if (options.toHtml) await fs6.writeFile(toFile, toText)
      if (options.toPdf) { // 轉為 pdf 檔
        let pdfFile = path.join(dir, name+'.pdf')
        console.log('  pdfFile=%s', pdfFile)
        await M.htmlFileToPdf(toFile, pdfFile, meta)
      }
    }
    if (options.toTex) { // 轉為 tex 檔
       toFile = path.join(dir, name+'.tex')
       toText = M.convert(md, 'tex')
       await fs6.writeFile(toFile, toText)
    }
    return toText
  } catch (error) { console.log('error=', error) }
}
