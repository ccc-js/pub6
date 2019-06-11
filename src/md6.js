const JSOX = require('jsox') // JSON6 格式的 parser -- https://github.com/d3x0r/JSON6
const M = module.exports = {}
const hljs = require('highlight.js'); // https://highlightjs.org/
// const mdit = require('markdown-it')()
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
  // console.log('m=%j', m.slice(2))
  let type = m[2].trim()
  let meta = JSOX.parse('{' + m[3] + '}')
  let body = m[4].trim()
  let ref = JSOX.parse('{' + m[6] + '}')
  return {type, meta, body, ref}
}

M.bib2html = function (bib) {
  let refs = []
  let i = 1
  for (let id in bib) {
    let {title, url, year, author, booktitle} = bib[id]
    refs.push(`  <li>(${id}) ${author} ${url==null? title : '<a href="' + url + '">' + title + '</a>'}, ${booktitle||''}, ${year} </li>`)
  }
  return `\n<ol class="referene">\n${refs.join('\n')}\n</ol>`
}

M.mdToHtml = function (md) {
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
<script>hljs.initHighlightingOnLoad();</script>
</body>
</html>
`

M.toHtml = function (md) {
  let {type, meta, body, ref} = M.parse(md), html=null
  // console.log('meta=%j body=%s ref=%j', meta, body, ref)
  with (meta) {
    html = `${htmlHead}
    <title>${title}</title>
    <article>
    <div class="header">
      <h1 class="title">${title}</h1>
      <p class="author">${author}</p>
      <p class="abstract">${abstract.replace(/\n/g, '<br>')}</p>
    </div>
    ${M.mdToHtml(M.expand(body, meta))}
    <div class="reference">
    <h2>Reference</h2>
    ${M.bib2html(ref)}
    </div>
    </article>
    ${htmlTail}
    `
  }
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
  let {type, meta, body, ref} = M.parse(md), tex=null
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
${M.mdToTex(M.expand(body, meta))}
\\bibliographystyle{unsrt}  
\\begin{thebibliography}{1}
${texTail}
\end{document}
`
  return tex
}
// ${M.mdToTex(M.expand(body, meta))}

M.convert = function (md, toFormat='html') {
  switch (toFormat) {
    case 'html': return M.toHtml(md)
    case 'tex' : return M.toTex(md)
    default: throw Error('M.convert: toFormat='+toFormat+' not supported!')
  }
}

/* 這也會有危險
let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {people: people});
*/

