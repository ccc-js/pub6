

const expect = require('js6/se6').expect
const uu6 = require('js6/uu6')
const {md6} = require('../src')

let paper = `\`\`\`paper
title: "a method of xxx to do ooo",
abstract: "==========abstract===================",
author: "ccc",
bib: {
  1: {title: "paper one", author: "ccc", year: 2018, url:"https://misavo.com/paperOne"},
  2: {title: "paper two", author: "bbb", year: 2018},
  3: {title: "paper three", author: "aaa", year: 2018},
}
\`\`\`

## Introduction

see [misavo](http://misavo.com)

## Background

![](img/picture.jpg)

## Method

\`\`\`
xxx
yyy
\`\`\`

## Experiment

field | value
------|------------
xxxx  | yyyy


## Conclusion

## Reference
`

/*

加入 js 會有問題

\`\`\`js
function add(a,b) {
  return a+b;
}
\`\`\`

*/


describe('md6 test', function() {
  it('render', function() {
    let html = md6.render('__markdown-it__ rulezz!')
    expect(html).to.contain('markdown-it')
  })
  it('expand', function() {
    let eText = md6.expand('{ name:"${name}", age:"${age}"}', {name:'ccc', age:49})
    expect(eText).to.contain('age:49')
  })
  it('parse', function() {
    let tree = md6.parse('__markdown-it__ rulezz!')
    // console.log('tree=', tree)
  })
  it('paper', function() {
    let p1 = md6.paperParse(paper)
    console.log('p1=%j', p1)
    let html = md6.paper2html(paper)
    console.log('paper.html = %s', html)
    // expect(html).to.contain('markdown-it')
  })
})


