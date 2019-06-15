const markdownit = require('markdown-it')
var mdit = new markdownit()
let md = require('./mdExample')

function myToken(tokens, idx, options, env, self) {
  console.log('tokens[%d]=%j', idx, tokens[idx])
  return ''
};

mdit.renderer.renderToken = myToken

let html = mdit.render(md)
console.log('html=', html)