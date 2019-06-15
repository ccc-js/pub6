// https://github.com/markdown-it/markdown-it/issues/46
// https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js
// 

/*
'autolink',      // Automatically convert link text surrounded by angle brackets to <a> tags
'backticks',     // Allow inline code blocks using backticks
'blockquote',    // > I am a blockquote becomes <blockquote>I am a blockquote</blockquote>
'code',          // Code block (4 spaces padded)
'emphasis',      // *Emphasize* _emphasize_ **Strong** __Strong__
'entity',        // Parse HTML entities e.g. &amp;
'escape',        // Automatically escape special characters.
'fence',         // Fenced code blocks
'heading',       // # Foo becomes <h1>Foo</h1>. ###### becomes <h6>Foo</h6>
'hr',            // ***, --- and ___ produce a <hr> tag.
'html_block',    // Enable / disable HTML blocks.
'html_inline',   // Enable / disable inline HTML.
'image'          // Enable / disable inline images.
'lheading',      // Use === or --- underneath text for h1 and h2 blocks.
'link',          // Process [link](<to> "stuff")
'linkify',       // Replace link-like texts with link nodes.
'list',          // Ordered and unordered lists.
'newline',       // '  \n' -> <br>
'normalize',     // Replace newlines with \n, null characters and convert tabs to spaces.
'paragraph'      // Use blank lines to indicate a paragraph.
'reference',     // Reference style links e.g. [an example][id] reference-style link... further down in the document [id]: http://example.com/  "Optional Title Here"
'strikethrough', // ~~strike through~~
'table',         // GFM style tables
'text_collapse', // Merge adjacent text nodes into one, and re-calculate all token levels
*/
const markdownit = require('markdown-it')
var mdit = new markdownit("default", {
  breaks: true, linkify: true, typographer: true
});


mdit.renderer.rules.fence = (tokens, idx, options) => {
  var token = tokens[idx]
  console.log(token)
  return '<pre>'
      + mdit.utils.escapeHtml(token.params+"\n" +token.content)
      + '</pre>\n';
};

/*

md.renderer.rules.fence = (tokens, idx, options) => {
    var token = tokens[idx];
    console.log(token)
    return '<pre>'
        + md.utils.escapeHtml(token.params+"\n" +token.content)
        + '</pre>\n';
};
//Override link render to open all link in a new window
mdit.renderer.rules.code = (tokens, idx) => {
  console.log('tokens[idx]=%j', tokens[idx])
  return ''
};
*/

let md = `
\`\`\`json6
title: "hello",
author: "ccc",
\`\`\`


# title


$$
\int_0^x f(x) dx
$$

$\`\\int_0^x f(x) dx\`$

\`\`\`math
\int_0^x f(x) dx
\`\`\`

[aaa](bbb.html)
`

let html = mdit.render(md)

console.log('html=%s', html)