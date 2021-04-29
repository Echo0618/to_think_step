### Vue生命周期钩子函数
> 每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。

![生命周期函数](https://img-blog.csdnimg.cn/20210428113648111.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0VjaG9fX19FY2hv,size_16,color_FFFFFF,t_70)
官方详解
生命周期函数 | 详解
--------| ------
beforeCreate | 在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
create | 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，property 和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el property 目前尚不可用。
beforeMount | 在挂载开始之前被调用：相关的 render 函数首次被调用。**该钩子在服务器端渲染期间不被调用。**
mounted | 实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。**该钩子在服务器端渲染期间不被调用。**
beforeUpdate | 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。**该钩子在服务器端渲染期间不被调用，因为只有初次渲染会在服务端进行。**
updated | 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。**该钩子在服务器端渲染期间不被调用。**
beforeDestroy|实例销毁之前调用。在这一步，实例仍然完全可用。**该钩子在服务器端渲染期间不被调用。**
destroyed|实例销毁后调用。该钩子被调用后，对应 Vue 实例的所有指令都被解绑，所有的事件监听器被移除，所有的子实例也都被销毁。**该钩子在服务器端渲染期间不被调用。**

那我们来演示一下在一个 **Vue** 实例从初始化到渲染以及最终销毁这一系列变化中,数据以及挂载的实例都经历了什么变化
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210428113647202.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0VjaG9fX19FY2hv,size_16,color_FFFFFF,t_0)

````html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>vue的生命周期钩子函数实例变化监听</title>
  </head>
  <body>
    <div id="app">
      <input type="text" v-model="msg" /><br/>
      {{msg}}
    </div>
    <button onclick="destory()">销毁</button>
    <!-- CDN方式引入Vue -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script type="text/javascript">
      const vm = new Vue ({
        el: '#app',
        data: {
          msg:'vueData'
        },
        beforeCreate () {
          console.log('实例创建前', this.msg , this.$el)
          // 实例刚创建,数据data和DOM元素都还没有初始化
        },
        created () {
          console.log('实例创建后', this.msg, this.$el)
          // 数据data初始化完成，DOM元素还没有初始化完成,$el属性还不存在
        },
        beforeMount () {
          console.log('元素挂载前', this.msg, this.$el)
          // 虚拟DOM元素占位完成,还未跟数据绑定
        },
        mounted () {
          console.log('元素挂载后', this.msg, this.$el)
          // 真实DOM元素挂载完成
        },
        beforeUpdate () {
          console.log('实例更新前', this.msg, this.$el)
        },
        updated () {
          console.log('实例更新后', this.msg, this.$el)
        },
        beforeDestroy () {
          console.log('实例销毁前', this.msg, this.$el)
        },
        destroyed () {
          console.log('实例销毁后', this.msg, this.$el)
        }
      });
      function destory () {
        vm.$destroy();
      }
    </script>
  </body>
</html>
````
加断点调试,运行结果如下
![控制台打印结果](https://img-blog.csdnimg.cn/20210428142234396.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0VjaG9fX19FY2hv,size_16,color_FFFFFF,t_70#pic_center)
虽然有这么多钩子函数,但在实际开发中并不是所有钩子函数都会被高频用到,以下我会列举几个我平时开发中常使用的钩子函数使用场景
#### 使用场景
##### **created**
* 可以访问获取数据
* 修改数据不会触发 **beforeUpdate**,**updated**钩子函数
* 可以正常向后端发起请求获取数据
##### **mounted**
* 可以访问获取数据
* 修改数据会触发 **beforeUpdate**,**updated**钩子函数
* **this.$refs**找到 **ref** 表示的节点
* 可以正常向后端发起请求获取数据

*特别注意:不要在 **update**  **beforeUpdate** 修改数据，否则会引起死循环*

**文章是根据其他大神的博客以及自己的一些理解总结的,如果不对的地方请大家指出,我尽快更改,请大神多多指教**
>文章借鉴:
>https://blog.csdn.net/weixin_43734490/article/details/88190741
>https://www.cnblogs.com/jjgw/p/12111517.html