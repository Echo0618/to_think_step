### Vue 实现 codeMirror 结合 sql-formatter 实现 sql 高亮及格式化

> 背景:<br>
> 需求是页面渲染一个类似 SQL 编辑器的功能,需要支持关键字高亮以及格式化功能

#### 由于之前做过一个小 demo,接触过<b>codeMirror</b>,手到擒来,先在项目中引入 codeMirror 实现编辑器的功能

- 1. npm 安装 vue-codemirror 插件

```JavaScript
npm install vue-codemirror --save
```

- 2. 在项目中引入 vue-codemirror

官网上有引入方式请参考官网https://www.npmjs.com/package/vue-codemirror<br>
我这里是单独引用的,以下是基础引入 codemirror 需要引入的文件

```JavaScript
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
```

另外我们还需要引入对应像渲染到页面的语言文件以及主题来达到关键字高亮以及整体编辑器的渲染效果(主题是非必选项)

```JavaScript
import 'codemirror/mode/sql/sql.js' // 引入mode
import 'codemirror/theme/solarized.css' // 引入theme
```

- 3. 调用 vue-codemirror

```html
<codemirror ref="myCm" v-model="sql" :options="cmOptions"></codemirror>
```

cmOptions 为 codemirror 的配置项

```JavaScript
cmOptions: {
  tabSize: 4,
  styleActiveLine: true,
  lineNumbers: true,
  line: true,
  mode: 'text/x-mssql', // SQL SERVER
  smartIndent: true,
  indentUnit: 4,
  autoRefresh: true,
  theme: 'solarized light' //对应引入的主题
}
```

以上页面的编辑器就可以成功渲染
![SQL在线编辑器](https://img-blog.csdnimg.cn/63bbfc0b204643f7afdd17aa256b2876.jpg?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBARWNob19fX0VjaG8=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

#### 接下来实现 SQL 的格式化功能

- 1. npm 安装 sql-formatter

```JavaScript
npm install sql-formatter
```

- 2. 引入 sql-formatter

```JavaScript
import { format } from 'sql-formatter';
```

- 3. 调用 sql-formatter

```JavaScript
format('SELECT * FROM tbl', {
  language: 'spark', // Defaults to "sql" (see the above list of supported dialects)
  indent: '    ', // Defaults to two spaces
  uppercase: bool, // Defaults to false
  linesBetweenQueries: 2, // Defaults to 1
});
```

成果展示:<br>
格式化之前
![SQL格式化之前](https://img-blog.csdnimg.cn/ee64f4ba094b46ce9ab22df010c8ef80.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBARWNob19fX0VjaG8=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)
格式化之后
![SQL格式化之后](https://img-blog.csdnimg.cn/2173e5ba556742fa81b3d05d42f99913.png?x-oss-process=image/watermark,type_ZHJvaWRzYW5zZmFsbGJhY2s,shadow_50,text_Q1NETiBARWNob19fX0VjaG8=,size_20,color_FFFFFF,t_70,g_se,x_16#pic_center)

## 礼成!完结撒花!

看了好多博客再加上自己的一些见解写出的文章,如果错误请指出,虚心接受错误,轻喷!!!<br>

#### 爬坑记录:

### q:页面初始化加载时,编辑器获取不到焦点,需要点击一下才能渲染 SQL

a: 需要在页面渲染完毕后,调用一个编辑器刷新的函数

```JavaScript
setTimeout(() => {
  this.$refs.myCm.codemirror.refresh();
  this.$refs.myCm2.codemirror.refresh();// PS: 如果页面有多个编辑器时,我分别在调用的时候声明了不同名字的ref
}, 1);

```
