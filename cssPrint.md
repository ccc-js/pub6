# CSS 的列印控制

* [原來前端網頁列印，不是只要 window.print() 就好了](https://medium.com/unalai/%E5%8E%9F%E4%BE%86%E5%89%8D%E7%AB%AF%E7%B6%B2%E9%A0%81%E5%88%97%E5%8D%B0-%E4%B8%8D%E6%98%AF%E5%8F%AA%E8%A6%81-window-print-%E5%B0%B1%E5%A5%BD%E4%BA%86-7af44cacf43e) (這篇超讚!)
    * https://flaviocopes.com/css-printing/
    * [其實Css的內心還住著一位Print](https://ithelp.ithome.com.tw/articles/10198913) (補充得很好！)
    * 但是其範例我測試沒效，列印時出現全空白頁 -- https://jiahongl.github.io/print-demo/dist/index.html
    * https://github.com/JiaHongL/print-demo


## 其他


標準
1. https://www.w3.org/TR/css-page-3/) // 目前還在 working draft 階段，所以應該不能用！
2. https://www.w3.org/TR/CSS21/page.html // 這個可以用了！

參考 -- http://edutechwiki.unige.ch/en/CSS_for_print_tutorial

資源 -- 印 slide : https://github.com/astefanutti/decktape


## 簡介

使用下列語法

```
@media print {
  ...
}
```

## Page Counter

https://www.tallcomponents.com/blog/css3-page-counter