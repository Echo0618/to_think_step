#### CSS盒子模型

引用官方的话，所有html元素可以看作盒子，CSS盒模型本质是一个盒子，封装周围的HTML元素，包括<strong>外边距，边框，内边距和内容</strong>
##### W3C盒子模型(标准盒子模型)
一般来讲我们在CSS中定义的width和height都是设置content的宽高，而盒子的总宽高 = content宽高 + 2 * margin + 2 * padding + 2 * border
![标准盒子模型](https://img-blog.csdnimg.cn/20200522114425140.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0VjaG9fX19FY2hv,size_16,color_FFFFFF,t_70#pic_center)

##### IE盒子模型(怪异盒子模型)
相对于标准盒子模型，css中设置的宽高属性就盒子而言是指content+padding+border的总和，盒子总宽高 = width/height + margin * 2 = content + padding * 2 + margin * 2 + border * 2
![怪异盒子模型](https://img-blog.csdnimg.cn/20200522160015213.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0VjaG9fX19FY2hv,size_16,color_FFFFFF,t_70#pic_center)
##### 两种模型如何做到兼容
在CSS3中新增了一个样式，包含了两个属性：<em>content-box</em>和<em>border-box</em>用来控制页面是哪种盒子模式
* 1、content-box:控制元素的width/height=content(标准模式)
![content-box1](https://img-blog.csdnimg.cn/20200522174311935.png#pic_center)
![content-box0](https://img-blog.csdnimg.cn/20200522174311942.png#pic_center)

* 2、border-box：控制元素的width/height=content + padding + border(怪异模式)
![border-box0](https://img-blog.csdnimg.cn/20200522174311945.png#pic_center)
![border-box1](https://img-blog.csdnimg.cn/20200522174311940.png#pic_center)
##### 对于margin-bottom和margin-top的注意点
对于行内元素来讲控制元素的上下外边距会相互叠加，如果都为正数，取最大值最后两个元素间的上下外边距值;若都为负数，取最小值;若一正一负，则正负相加