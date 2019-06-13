const M = module.exports = {}
const md6 = require('./md6')
const fs6 = require('./fs6')
const path = require('path')
const uu6 = require('js6/uu6')
const JSOX = require('jsox')

let options = {toHtml:true, toPdf:false}

async function handler(type, fpath, stack) {
  var plugins = null
  switch (type) {
    case 'folder': 
      await folderVisit(fpath, stack, handler)
      break
    case 'file':
      plugins = stack[stack.length-1]
      await md6.convertFile(fpath, options, plugins)
      break
    default:
      throw Error('Error: convertAll: dirWalk' + type + ' not found !')
  }
}

async function folderVisit(fpath, stack, handler) {
  let parent = (stack.length > 0) ? stack[stack.length-1] : {}
  let sidebar = await fs6.readText(path.join(fpath, '_sidebar.md'))
  // console.log('sidebar=%s', sidebar)
  let header  = await fs6.readText(path.join(fpath, '_header.md'))
  let footer  = await fs6.readText(path.join(fpath, '_footer.md'))
  let json6   = await fs6.readText(path.join(fpath, '_meta.json6'))
  let meta    = JSOX.parse(json6||'{}')
  meta = Object.assign(meta, parent.meta||{})
  console.log('meta=%j', meta)
  plugins = uu6.defaults({meta, sidebar, header, footer}, parent)
  stack.push(plugins)
  await fs6.dirWalk(fpath, stack, handler)
  stack.pop()
}

M.convertAll = async function(root)  {
  try {
    let stack = []
    await folderVisit(root, stack, handler)
    // fs6.dirWalk(root, stack, handler)
  } catch (error) { console.log('error=', error) }
}
