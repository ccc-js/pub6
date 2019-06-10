const uu6 = require('js6/uu6')
const fs = require('mz/fs')
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
});

M.render = function (md) {
  return mdit.render(md)
}

M.parse = function (md) {
  return mdit.parse(md)
}

/* 這會有危險 */
M.expand = function (text, ctx) {
  let rText = text
  console.log('============text===========\n', text)
  with (ctx) {
    // rText = eval('`'+text+'`')
  }
  return rText
}

M.paperParse = function (paper) {
  let m = paper.trim().match(/^```paper([\s\S]*?)```([\s\S]*)$/)
  let json6 = '{' + m[1] /*.replace(/[\r\n]/g, ' ')*/ + '}'
  console.log('json6=%s', json6)
  let meta = JSOX.parse(json6)
  console.log('meta.abstract=|%s|', meta.abstract)
  // let meta = // eval('t = '+json) // 使用 json6 的格式eval('`'+json+'`') 考慮改用 https://github.com/Autodesk/sjson
  let md = m[2]
  return {meta, md}
}

M.bib2html = function (bib) {
  let refs = []
  let i = 1
  for (let id in bib) {
    let {title, url, year, author, booktitle} = bib[id]
    refs.push(`  <li>${i++} : (${id}) ${author} ${url==null? title : '<a href="' + url + '">' + title + '</a>'}, ${booktitle||''}, ${year} </li>`)
  }
  return `\n<ul class="referene">\n${refs.join('\n')}\n</ul>`
}

M.paper2html = function (paper) {
  let {md, meta} = M.paperParse(paper)
  console.log('meta=%j', meta)
  console.log('meta.title=%s', meta.title)
  with (meta) {
    html = `
    <html>
    <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="css/paper.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/atom-one-light.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
    </head>
    <body>
    <header>
      <h1 class="title">${title}</h1>
      <p class="author">${author}</p>
      <p class="abstract">${abstract.replace(/\n/g, '<br>')}</p>
    </header>
    ${M.render(M.expand(md, meta))}
    ${M.bib2html(meta.bib)}
    </body>
    </html>
    `
  }
  return html
}

M.paperFileToHtml = async function (mdPaperFile, htmlFile) {
  try {
    let mdPaper = await fs.readFile(mdPaperFile, 'utf8')
    console.log('mdPaper=', mdPaper)
    let html = M.paper2html(mdPaper)
    await fs.writeFile(htmlFile, html)
  } catch (error) { console.log('error=', error) }
}


/* 這也會有危險
let ejs = require('ejs'),
    people = ['geddy', 'neil', 'alex'],
    html = ejs.render('<%= people.join(", "); %>', {people: people});
*/

