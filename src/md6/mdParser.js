/* 以下的 . 都不包含 \n 字元，但是 .. 可包含 \n 字元
----------基本語法---------------
MD = (LINE | BLOCK)*
LINE = (#*)? INLINE*\n
INLINE = ITALIC | BOLD | ICODE | IMATH? | .*
BLOCK = CODE | MARK | TABBLOCK | TABLE? | MATH?
ICODE = `(.*)`
ITALIC = *(.*)*
BOLD = **(.*)**
CODE = \n```(\w+)\n(..*)\n```
MARK = (\n>.*)+
TABBLOCK = (\n(TAB).*)+

----------延伸語法----------------
TABLE = ROW \n(-+|)+(.*) ROW+
ROW   = \n(.* |)+(.*)
IMATH = $(.*)$
MATH  = \n$$(..*)\n$$
*/
const M = module.exports = {
  emitter: function (node) {
    console.log('%j', node)
  },
  render: require('./mdRender')
}
var md, len, i, ahead, aheadStart, emit, render


M.parse = function (text, pRender=M.render) {
  md = '\n'+text.replace(/\t/g, '    ')+'\n'
  render = pRender
  len = md.length; i = 0; ahead = null; aheadStart = -1
  let tree = MD()
  return tree
}

let isNext = function (h) {
  if (aheadStart != i) ahead = md.substr(i, 10)
  return (ahead.startsWith(h))
}

let next = function () {
  return md.charAt(i++)
}

// MD = (LINE | BLOCK)*
let MD = function () {
  let r = {type:'top', childs:[]}, e = null
  while (i < len) {
    e = BLOCK()
    if (e == null) {
      e = LINE()
    }
    emit(e)
    // console.log('%j', e)
    r.childs.push(e)
  }
  return r
}

// LINE = \n(#*)? INLINE*
let LINE = function () {
  let r = {type:'line'}
  if (md[i]=='\n') i++; else throw Error('LINE: not start with \n')
  let start = i
  while (md[i] == '#') {
    i++
  }
  let h = {type:'', head:'\n', body:md.substring(start, i), tail:''}
  r.childs = [h]
  // if (i > start) r.childs.push({type:'#', body: md.substring(start, i)})
  while (md[i] != '\n' && i < len) {
    let c = INLINE()
    r.childs.push(c)
  }
  // if (md[i]=='\n') next()
  return r
}

// INLINE = ITALIC | BOLD | ICODE | IMATH?
// ICODE = `(.*)`
// ITALIC = *(.*)*
// BOLD = **(.*)**
// LINK = [.*](.*)
// IMATH = $(.*)$
let INLINE = function () {
  if (isNext('`')) {
    return IPART('`', '`')
  } else if (isNext('**')) {
    return IPART('**', '**')
  } else if (isNext('*')) {
    return IPART('*', '*')
  } else if (isNext('$')) {
    return IPART('$', '$')
  } else if (isNext('[')) {
    return LINK()
  } else {
    return STRING()
  }
}

let LINK = function () {
  let p1 = IPART('[', ']')
  let p2 = IPART('(', ')')
  return {type:'link', childs:[p1, p2]}
}

let STRING = function () {
  let start = i
  while ('`*$[\n'.indexOf(md.charAt(i)) < 0) {
    i++
  }
  return {type:'string', head:'', body:md.substring(start, i), tail:''}
}

let IPART = function (head, tail, mode='inline') {
  if (isNext(head)) {
    let llen = head.length, rlen = tail.length
    let start = i + llen
    i = start
    for (; i<len; i++) {
      if (md.substr(i, rlen) === tail) {
        let r = {type:head, head, body:md.substring(start, i), tail}
        i += rlen
        return r
      }
      if ((mode=='inline' && md.charAt(i) === '\n') || i >= len) {
        throw Error('IPART('+head+') error, end of line encounter !')
      }
    }
  }
}

// BLOCK = CODE | MARK | TABBLOCK | TABLE? | MATH?
let BLOCK = function () {
  if (isNext('\n```')) {
    return CODE()
  } else if (isNext('\n>')) {
    return MARK()
  } else if (isNext('\n    ')) {
    return TABBLOCK()
  } else if (isNext('\n$$')) {
    return MATH()
  } else if (isTable()) {
    return TABLE()
  } else {
    return null
  }
}

// CODE = \n```(\w+)\n(..*)\n```
let CODE = function () {
  let r = IPART('\n```', '\n```', 'block')
  r.type = 'code'
  return r
}

// MATH = \n$$(\w+)\n(..*)\n$$
let MATH = function () {
  let r = IPART('\n$$', '\n$$', 'block')
  r.type = 'math'
  return r
}

// MARK = (\n>.*)+
let MARK = function () {
  let childs = []
  while (isNext('\n>')) {
    childs.push(LINE())
  }
  return {type:'mark', childs}
}

// TABBLOCK = (\n(TAB).*)+
let TABBLOCK = function () {
  let childs = []
  while (isNext('\n    ')) {
    childs.push(LINE())
  }
  return {type:'tabBlock', childs}
}

let isTable = function () {
  return /^\n.*?\|.*?\n(\-+|)+\-+/.test(md.substring(i, 1000))
}

let TABLE = function () {
  let childs = []
  while (true) {
    let start = i
    let line = LINE()
    if (md.substring(start, i).indexOf('|') < 0) {
      i = start
      break
    } else {
      childs.push(line)
    }
  }
  return {type:'table', childs}
}


/* 參考: markdown BNF -- https://github.com/mynameislau/nearley-markdown-grammar

main ->
notEmpty
| null

notEmpty ->
delimited notEmpty
| delimited
| text delimited notEmpty
| text delimited
| text

delimited ->
delimitedGroupA
| delimitedGroupB

# groupA can contain groupB blocks

delimitedGroupA ->
ita
| bold
| codeBlock
| sharpTitle

delimitedGroupB ->
inlineCode

insideGroupA ->
delimitedGroupB insideGroupA
| delimitedGroupB
| text delimitedGroupB insideGroupA
| text delimitedGroupB
| text

any -> delimited | text

ita -> "*" insideGroupA "*" {% ita %}

bold -> "**" insideGroupA "**" {% bold %}

sharpTitle -> "\n" "#":+ " " [\S]:+ "\n" {% sharpTitle %}

codeBlock ->   "\n```" [\S]:+ "\n" [\s\S]:+ "\n```" {% codeBlock %}

inlineCode -> "`" [^`] [^\n]:* "`" {% inlineCode %}

text -> [^*`\n] [^*`]:* {% text %}
| "\n" [^#*`]:+ {% text %}
| "\n" {% text %}
*/