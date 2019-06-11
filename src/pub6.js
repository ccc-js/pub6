const md6 = require('./md6')
const M = module.exports = {}
const path = require('path')
// const fs = require('mz/fs')
const fs = require('fs').promises
const puppeteer = require('puppeteer')

let stack = [], sidebar='', header='', footer=''
let options = {toHtml:true}

async function readText(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (error) {
    return ''
  }
}

async function folderVisit(dir) {
  console.log(dir + '/')
  sidebar = await readText(path.join(dir, '_sidebar.md'))
  header  = await readText(path.join(dir, '_header.md'))
  footer  = await readText(path.join(dir, '_footer.md'))
  // console.log('sidebar=%s header=%s footer=%s', sidebar, header, footer)
  stack.push({sidebar, header, footer})
}

async function fileVisit(file) {
  await convert(file)
}

async function htmlFileToPdf(htmlFile, pdfFile, meta) {
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
    // margin: {top: 40, bottom: 40, left: 40, right: 40 },
    printBackground: true,
    displayHeaderFooter: true,
    // headerTemplate 參考 https://github.com/GoogleChrome/puppeteer/issues/2167
    headerTemplate: `<div class='text left'>${meta.bookTitle||''} / ${meta.title}</div><div class=''></div>`, // <div class='date text left'></div><div class='title text center'></div>`, 
    footerTemplate: `
    <div class='text center grow'>
      <span class='pageNumber'></span>
    </div>`,
    // <div class='text left '></div><div class='url text left grow'></div>  `<footer>page : <span class="pageNumber"></span>/<span class="totalPages"></span></footer>`,
    preferCSSPageSize: true,
  })
  await browser.close()
}

async function convert(mdFile) {
  let { dir, base, ext, name } = path.parse(mdFile)
  var toFile = null, toText = null
  if (ext !== '.md') return
  try {
    console.log('convert:%s', mdFile)
    let md = await fs.readFile(mdFile, 'utf8')
    if (options.toHtml) { // 轉為 html 檔
      toFile = path.join(dir, name+'.html')
      let {meta} = md6.parse(md)
      console.log('meta.title=%s', meta.title)
      toText = md6.convert(md, 'html')
      await fs.writeFile(toFile, toText)
      if (options.toPdf) { // 轉為 pdf 檔
        let pdfFile = path.join(dir, name+'.pdf')
        console.log('pdfFile=%s', pdfFile)
        await htmlFileToPdf(toFile, pdfFile, meta)
      }
    }
    if (options.toTex) { // 轉為 tex 檔
       toFile = path.join(dir, name+'.tex')
       toText = md6.convert(md, 'tex')
       await fs.writeFile(toFile, toText)
    }
    return toText
  } catch (error) { console.log('error=', error) }
}

async function dirWalk(dir) {
  const subdirs = await fs.readdir(dir);
  await Promise.all(subdirs.map(async (subdir) => {
    const item = path.resolve(dir, subdir)
    let isDir = (await fs.stat(item)).isDirectory()
    if (isDir) {
      stack.push({sidebar, header, footer})
      await folderVisit(item)
      await dirWalk(item)
      stack.pop()
    } else {
      await fileVisit(item)
    }
  })).catch(function(error) {
    console.log(error);
  });
}

M.convertAll = async function(root) {
  await folderVisit(root)
  dirWalk(root)
  /*
  let finder = await require('findit')(root)

  finder.on('directory', async function (dir, stat, stop) {
    var base = path.basename(dir)
    if (base.startsWith('.') || base === 'node_modules') stop()
    else {
      await folderVisit(dir)
    }
  })
  
  finder.on('file', async function (file, stat) {
    await fileVisit(file)
  })
  
  finder.on('end', async function () {
    console.log('all finished!')
  })
  */
}

/*
資源 -- 印 slide : https://github.com/astefanutti/decktape
*/