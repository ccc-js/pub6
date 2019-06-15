# markdown-it 研究

## 從 mditParser.js 開始

```json
PS D:\ccc\js\pub6\example> node mditParser
tree=[
  {
    "type": "fence",
    "tag": "code",
    "attrs": null,
    "map": [
      1,
      5
    ],
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "title: \"hello\",\nauthor: \"ccc\",\n",
    "markup": "```",
    "info": "json6",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "heading_open",
    "tag": "h1",
    "attrs": null,
    "map": [
      7,
      8
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "#",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "inline",
    "tag": "",
    "attrs": null,
    "map": [
      7,
      8
    ],
    "nesting": 0,
    "level": 1,
    "children": [
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "title",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ],
    "content": "title",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "heading_close",
    "tag": "h1",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "#",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_open",
    "tag": "p",
    "attrs": null,
    "map": [
      10,
      13
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "inline",
    "tag": "",
    "attrs": null,
    "map": [
      10,
      13
    ],
    "nesting": 0,
    "level": 1,
    "children": [
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "$$",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "softbreak",
        "tag": "br",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "int_0^x f(x) dx",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "softbreak",
        "tag": "br",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "$$",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ],
    "content": "$$\nint_0^x f(x) dx\n$$",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_close",
    "tag": "p",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_open",
    "tag": "p",
    "attrs": null,
    "map": [
      14,
      15
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "inline",
    "tag": "",
    "attrs": null,
    "map": [
      14,
      15
    ],
    "nesting": 0,
    "level": 1,
    "children": [
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "$",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "code_inline",
        "tag": "code",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "\\int_0^x f(x) dx",
        "markup": "`",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 0,
        "children": null,
        "content": "$",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ],
    "content": "$`\\int_0^x f(x) dx`$",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_close",
    "tag": "p",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "fence",
    "tag": "code",
    "attrs": null,
    "map": [
      16,
      19
    ],
    "nesting": 0,
    "level": 0,
    "children": null,
    "content": "int_0^x f(x) dx\n",
    "markup": "```",
    "info": "math",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_open",
    "tag": "p",
    "attrs": null,
    "map": [
      20,
      21
    ],
    "nesting": 1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "inline",
    "tag": "",
    "attrs": null,
    "map": [
      20,
      21
    ],
    "nesting": 0,
    "level": 1,
    "children": [
      {
        "type": "link_open",
        "tag": "a",
        "attrs": [
          [
            "href",
            "bbb.html"
          ]
        ],
        "map": null,
        "nesting": 1,
        "level": 1,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "text",
        "tag": "",
        "attrs": null,
        "map": null,
        "nesting": 0,
        "level": 1,
        "children": null,
        "content": "aaa",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      },
      {
        "type": "link_close",
        "tag": "a",
        "attrs": null,
        "map": null,
        "nesting": -1,
        "level": 0,
        "children": null,
        "content": "",
        "markup": "",
        "info": "",
        "meta": null,
        "block": false,
        "hidden": false
      }
    ],
    "content": "[aaa](bbb.html)",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  },
  {
    "type": "paragraph_close",
    "tag": "p",
    "attrs": null,
    "map": null,
    "nesting": -1,
    "level": 0,
    "children": null,
    "content": "",
    "markup": "",
    "info": "",
    "meta": null,
    "block": true,
    "hidden": false
  }
]
```