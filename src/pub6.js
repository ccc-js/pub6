const M = module.exports = {}
const md6 = require('./md6')
const fs6 = require('./fs6')
const path = require('path')
const uu6 = require('js6/uu6')
const JSOX = require('jsox')

let options = {toHtml:true, toPdf:false}

M.convertAll = async function(root)  {
  try {
    let stack = []
    // await folderVisit(root)
    fs6.dirWalk(root, stack, async function handler(type, fpath, stack) {
      var plugins = null
      switch (type) {
        case 'folder': 
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
          // console.log('  plugins=%j', plugins)
          stack.push({meta, sidebar, header, footer})
          await fs6.dirWalk(fpath, stack, handler)
          stack.pop()
          break
        case 'file':
          // console.log('file=', fpath)
          plugins = stack[stack.length-1]
          // plugins = stack[stack.length-1]
          // console.log('  stack=%j', stack)
          await md6.convertFile(fpath, options, plugins)
          break
        default:
          throw Error('Error: convertAll: dirWalk' + type + ' not found !')
      }
    })
  } catch (error) { console.log('error=', error) }
}
