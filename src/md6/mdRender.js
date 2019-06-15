const R = module.exports = {}

R.render = function (node) {
  let {type, body, childs} = node, len
  switch (type) {
    case '*': return '<i>'+body+'</i>'
    case '**': return '<b>'+body+'</b>'
    case '`': return '<em>'+body+'</em>'
    case 'link': return `<a href="${childs[1].body}">${childs[0].body}</a>`
    case 'string': return body
    case 'line', 'top':
      len = childs.length
      
      for (let i=0; i<len; i++) {

      }
  }
}