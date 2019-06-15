const expect = require('js6/se6').expect
const uu6 = require('js6/uu6')
const {md6} = require('../src')
const {parser:P} = md6

// let md = 'aaa *bbb* ccc \n **ddd** $\\int_0^x f(x)$ eee `fff`'
let md = `
# title

aaa *bbb* ccc 

## section

**ddd** $\\int_0^x f(x)$ eee

\`\`\`json6
{
  name: 'ccc',
  age: 49
}
\`\`\`

link to [YouTube](https://tw.youtube.com)

$$
\\int_0^x f(x)
$$

    tabline1
    tabline2
    tabline3


f1 | f2 | f3
---|----|-----
x11 | x12 | x13
x21 | x22 | x23


ttt \`fff\` `

describe('md6 test', function() {
  it('render', function() {
    let tree = P.parse(md)
    expect(tree).pass((x)=>x!=null)
    // console.log('%s', JSON.stringify(tree, null, 2))
  })
})
