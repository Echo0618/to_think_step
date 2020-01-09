#### 页面导入样式时，使用 link 和@import 有什么区别？

link 是 HTML 标签，@import 是 CSS 提供的
link 引入样式会在页面加载时同时加载，@import 会在页面样式完全加载之后再加载
link 没有兼容问题，@import 只兼容 IE5 之后的版本
link 可以通过js操作DOM对象来改变样式，而DOM对象是基于文本的@import的方式则不能改变