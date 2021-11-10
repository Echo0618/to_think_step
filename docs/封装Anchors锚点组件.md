### 封装 Anchors 锚点组件

> 背景:
> 需求是页面要加一个锚点功能用户通过点击快速定位到指定位置,同时页面增加滚到监听功能,动态激活锚点

先上效果图
![锚点实例](https://img-blog.csdnimg.cn/95af9aea97f244de8558160f5c11c1fa.gif#pic_center)

#### 解题思路

- 1 实现点击锚点,页面滑动到指定范围
- 2 页面滚到增加监听事件,判断当前出去那个锚点区域,对应锚点置为激活状态
  **_Let's do it!!!_**

#### 实现点击锚点,页面滑动到指定范围

实现步骤:
**_step1:_** 在锚点组件点击对应锚点,获取到是第 n 个锚点被点击了,获取对应 dom 元素
**_step2:_** 需要滚动得高度 = 获取到第 n 个锚点所在父容器得位置 + 页面卷起来得高度
**scrollTop = jump.position().top + dom.scrollTop**
**_step3:_** 滚起来! **dom.scrollTo({ top: scrollTop,behavior: 'smooth' })**

```JavaScript
jump (index, className) {
  const jump = $('.do-jump').eq(index)
  const scrollTop = jump.position().top + this.scrollBox.scrollTop  // 获取需要滚动的距离
  // Chrome
  this.scrollBox.scrollTo({
    top: scrollTop,
    behavior: 'smooth', // 平滑滚动
  })
}
```

#### 页面滚到增加监听事件,判断当前出去那个锚点区域,对应锚点置为激活状态

**_step1:_** 页面 dom 渲染完成获取 **topArr[ ]** 接收各个锚点区域相对于父容器得位置
**_step2:_** 增加滚动监听事件,获取当前滚动高度,遍历跟 **topArr** 做比较,符合条件,把对应锚点 置为激活状态

```JavaScript
setTimeout(() => {
  const jump = $('.do-jump')
  const topArr = []
  for (let i = 0; i < jump.length; i++) {
    if (i > 0) {
      topArr.push(topArr[i - 1] + jump[i - 1].offsetHeight)
    } else {
      topArr.push(jump.eq(i).position().top)
    }
  }
  this.topArr = topArr
}, 1000)
const that = this
// 获取滚动dom元素
this.scrollBox = document.getElementById('scrollBox')
// 监听dom元素的scroll事件
this.scrollBox.addEventListener('scroll', () => {
  const current_offset_top = that.scrollBox.scrollTop
  for (let i = 0; i < this.topArr.length; i++) {
    if (current_offset_top <= this.topArr[i]) {
      // 根据滚动距离判断应该滚动到第几个导航的位置
      that.activeMenu = i
      break
    }
  }
}, true)
```

### 礼成!完结撒花!

看了好多博客再加上自己的一些见解写出的文章,如果错误请指出,虚心接受错误,轻喷!!!<br>
封装成一个组件方便其他 tab 页使用,贴一个完整代码

```JavaScript
// Anchors.vue
<template>
  <div class="anchor-content m-b-10">
    <span class="anchor" v-for="(anchor,index) in anchors" :key="'anchor'+index" :class="[index === activeMenu ? 'active' : '']" v-if="anchor.count>0"  @click="jump(index,className)">{{anchor.count>0?anchor.value+' ('+anchor.count+')':anchor.value}}</span>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  props: {
    activeMenu: {
      type: Number,
      default: 0
    },
    anchors: {
      type: Array
    },
    className: {
      type: String,
      required: true,
      default: 'do-jump'
    },
    domId: {
      type: String,
      required: true
    }
  },
  watch: {
    activeName () {
      this.listenScroll(this.className, this.domId)
    }
  },
  methods: {
    jump (index, className) {
      this.$emit('setActive', index)// 当前导航
      const jump = $('.' + className).eq(index)
      const scrollTop = jump.position().top + this.scrollBox.scrollTop - 60 // 获取需要滚动的距离
      // Chrome
      this.scrollBox.scrollTo({
        top: scrollTop,
        behavior: 'smooth', // 平滑滚动
      })
    },
    listenScroll (domId, className) {
      setTimeout(() => {
        const jump = $('.' + className)
        const topArr = []
        for (let i = 0; i < jump.length; i++) {
          if (i > 0) {
            topArr.push(topArr[i - 1] + jump[i - 1].offsetHeight + 20)
          } else {
            topArr.push(jump.eq(i).position().top)
          }
        }
        this.topArr = topArr
      }, 1000)
      const that = this
      // 获取滚动dom元素
      this.scrollBox = document.getElementById(domId)
      // 监听dom元素的scroll事件
      this.scrollBox.addEventListener('scroll', () => {
        const current_offset_top = that.scrollBox.scrollTop
        for (let i = 0; i < this.topArr.length; i++) {
          if (current_offset_top <= this.topArr[i]) {
            // 根据滚动距离判断应该滚动到第几个导航的位置
            this.$emit('setActive', i)
            // that.activeMenu = i
            break
          }
        }
      }, true)
    }
  },
  mounted () {
    this.listenScroll(this.domId, this.className);
  },
}
</script>

<style lang="scss" scoped>
.anchor-content {
  border-bottom: 1px solid #e5e5e5;
  line-height: 14px;
  .anchor {
    padding: 5px 15px 5px 15px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #888;
    cursor: pointer;
    display: inline-block;
  }
  .anchor:hover {
    text-decoration: underline;
  }
  .active {
    color: #f18d00;
  }
}
</style>
```

父组件调用示例

```JavaScript
<template>
  <div class="info-container">
    <Anchor :className="'do-jump'" :domId="'scrollBox'" :anchors="anchors" :activeMenu="activeMenu" @setActive="setActive"></Anchor>
    <div id="scrollBox" class="applications-content">
      <div class="industry_info do-jump m-b-10">
      ...
      </div>
      <div class="key_personnel do-jump m-b-10" v-if="Employees.length > 0">
      ...
      </div>
      ...
    </div>
  </div>
</template>
import Anchor from "@/components/Anchor.vue"
export default {
  components: {
    Anchor
  },
  data () {
    return {
      activeMenu: 0,
      anchors: [{
        id: 0,
        key: 'industry_info',
        value: '工商信息',
        count: 0
      }, {
        id: 1,
        key: 'key_personnel',
        value: '主要人员',
        count: 0
      }, {
        id: 2,
        key: 'partners',
        value: '股东信息',
        count: 0
      }]
    };
  },
  methods: {
    setActive (activeMenu) {
      this.activeMenu = activeMenu
    }
  }
</script>
<style lang="scss" >
.info-container {
  width: 100%;
  .applications-content {
    width: 100%;
    height: 500px;
    overflow: hidden;
    overflow-y: scroll; // 实现滚动得重要代码 不然scrollTop一直为0 jump和监听都会失效
  }
}
</style>
```
