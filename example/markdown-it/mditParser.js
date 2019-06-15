const markdownit = require('markdown-it')
var mdit = new markdownit()
let md = require('./mdExample')

let tree = mdit.parse(md)

console.log('tree=%s', JSON.stringify(tree, null, 2))