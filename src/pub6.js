const M = module.exports = {}
const md6 = require('./md6')
const fs6 = require('./fs6')
const path = require('path')
const uu6 = require('js6/uu6')
const JSOX = require('jsox')

let options = {toHtml:true, toPdf:false}

async function handler(type, dir, attach) {
  let {stack} = attach
  switch (type) {
    case 'folder': 
      await folderVisit(dir, attach, handler)
      break
    case 'file':
      let len = stack.length, plugin = stack[len-1], {base:file} = path.parse(dir)
      if (!file.endsWith('.md') || file.startsWith('_')) break
      // console.log('file=%s', file)
      // 建立 header (md)
      let headList = [], relativePath = ''
      for (let i=len-1; i>=0; i--) {
        if (!(file === 'index.md' && i === len-1)) { // .../index.html 不用連到自己
          headList.push(`[${stack[i].pathPart}](${relativePath}index.html)`)
        }
        relativePath += '../'
      }
      plugin.header = headList.reverse().join(' / ')
      await md6.convertFile(dir, options, plugin)
      break
    default:
      throw Error('Error: convertAll: dirWalk' + type + ' not found !')
  }
}

async function folderVisit(dir, attach, handler) {
  let {stack} = attach
  let pathPart = path.basename(dir) // 子目錄名稱
  let parent = (stack.length > 0) ? stack[stack.length-1] : {}
  let sidebar = await fs6.readText(path.join(dir, '_sidebar.md'))
  // console.log('sidebar=%s', sidebar)
  // let header  = await fs6.readText(path.join(dir, '_header.md'))
  let footer  = await fs6.readText(path.join(dir, '_footer.md'))
  let json6   = await fs6.readText(path.join(dir, '_meta.json6'))
  let meta    = JSOX.parse(json6||'{}')
  meta = Object.assign(meta, parent.meta||{})
  // console.log('meta=%j', meta)
  plugin = uu6.defaults({meta, sidebar, footer, pathPart}, parent) // header, 
  stack.push(plugin)
  // pathParts.push(path.basename(dir)) // 將子目錄名稱加入
  // console.log('==>pathParts=%j', pathParts)
  await fs6.dirWalk(dir, attach, handler)
  // pathParts.pop()
  stack.pop()
}

M.convertAll = async function(root)  {
  try {
    let attach = {stack: [] }
    await folderVisit(root, attach, handler)
  } catch (error) { console.log('error=', error) }
}
