### Vue 引入腾讯地图 API 与实际应用保姆级分享

> 背景:
> 需求是大屏要加一个地图板块,同时把获取到的企业信息根据经纬度展示在地图中,并且要求鼠标悬浮打开企业信息的详细信息面板

先上效果图
![地图效果](https://img-blog.csdnimg.cn/c799eb410cb74f809941954c95e77b4a.gif)

#### 引入第三方地图组件库

去腾讯位置服务中心——>应用管理——我的应用——创建应用,获取属于自己产品的一个 Key
![配置Key值](https://img-blog.csdnimg.cn/a7bca8a3dd404ad3adea3b889b7ef10a.png)

##### 页面引入并初始化

Vue 引入第三方插件,新建一个文件 map.js 以供多处使用,使用 Promise 获取 js

```javascript
export function TMaps(key) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(qq); //注意这里
    };
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=' + key;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
```

```javascript
import { TMaps } from '@/utils/map.js';
```

template 部分

```html
<div id="3dmap" ref="map" style="width:100%;height:100%;z-index: 0;"></div>
```

script 部分

```javascript
TMaps('XA7BZ-XXXXX-XXXXX-XXXXX-XXXXX-QRFVL').then((qq) => {
  // 初始化地图
  const map = new TMap.Map(document.getElementById('3dmap'), {
    baseMap: {
      // 设置卫星地图
      type: 'satellite',
    },
    // 地图的中心地理坐标。
    center: new TMap.LatLng(XX, XX), // LatLng(纬度,经度)
    zoom: 14, // 设置地图缩放级别
    maxZoom: 18,
  });
});
```

![地图初始化](https://img-blog.csdnimg.cn/226aca40d957417395dee26ee260f0ba.png)
地图效果就可以正常渲染出来了

##### 地图控件显示控制

地图效果出来了,左上角我们可以看到控制地图的控件,在大屏中我们是不需要这类功能的

```javascript
// 隐藏控件
map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM); // 比例尺控件
map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE); // 比例尺控件
map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION); // 旋转控件
```

##### DOM 覆盖物——自定义图层

如上图,需求是主要展示小岛信息,其他地域板块信息,用户会分散精力,于是我们在整个地图上方增加一个 DOM 覆盖物,让用户的关注点集中在小岛上,而由于小岛形状是一个不规则的形状,可以麻烦 UI 小改改提供一个相应形状的遮罩层图片
![ImageGroundLayer](https://img-blog.csdnimg.cn/a53a65d9a2564405b213fe36b42711a7.png)

```javascript
let imageSW = new TMap.LatLng(XX, XX); // 遮罩层渲染到地图四角的经纬度
let imageNE = new TMap.LatLng(XX, XX); // 遮罩层渲染到地图四角的经纬度
var imageLatLngBounds = new TMap.LatLngBounds(imageSW, imageNE);
var imageGroundLayer = new TMap.ImageGroundLayer({
  // bountary:imageLatLngBounds,
  bounds: imageLatLngBounds,
  src: './img/bgmap1.png',
  zoom: 14, // 缩放跟地图对象一致,避免缩放不同步问题
  maxZoom: 18, // 缩放跟地图对象一致
  map: map, // 初始化渲染的地图对象
});
```

爬坑
Q: 遮罩层出来了,但是地图两边露出来了,一个合格的前端是不会允许这种事情发生的
![爬坑](https://img-blog.csdnimg.cn/20f0933f58614361841ecde8e739b66a.png)
A:在初始化 map 对象时增加一个属性 **boundary**,值与遮罩层对象一致

```javascript
const map = new TMap.Map(document.getElementById('3dmap'), {
  baseMap: {
    // 设置卫星地图
    type: 'satellite',
  },
  // 地图的中心地理坐标。
  center: new TMap.LatLng(XX, XX),
  zoom: 14,
  maxZoom: 18,
  boundary: new TMap.LatLngBounds(
    new TMap.LatLng(XX, XX),
    new TMap.LatLng(XX, XX)
  ),
});
```

最终效果
![爬坑2](https://img-blog.csdnimg.cn/d6f95dbe1c914e5fab7da362187d8fc8.png)

##### 在地图上标注定位

需求是展示小岛上的企业坐标,鼠标悬浮打开企业详情面板
![GeometryOverlayOptions 对象规范](https://img-blog.csdnimg.cn/805afca5106a49d5850a9fef7a78183a.png)

```javascript
//初始化marker
var marker = new TMap.MultiMarker({
  id: 'marker-layer', //图层id
  map: map,
  styles: {
    //点标注的相关样式
    marker: new TMap.MarkerStyle({
      width: 15,
      height: 15,
      // anchor: { x: 16, y: 32 },
      src: qiye, // 图标url
    }),
  },
  geometries,
});
/*
geometries的结构
geometries = [{
  //点标注数据数组
  id: 'demo',
  styleId: 'marker',
  item,
  position: new TMap.LatLng(item.longitude, item.latitude),
  properties: {
    title: 'marker'
  }
},
...
{
  //点标注数据数组
  id: 'demo',
  styleId: 'marker',
  item,
  position: new TMap.LatLng(item.longitude, item.latitude),
  properties: {
    title: 'marker'
  }
}]
 */
```

![market](https://img-blog.csdnimg.cn/8646f713b75141858d58f29f761ddfc3.png)
企业图标已成功渲染到地图上,现在实现鼠标悬停功能
企业信息面板遮罩层初始化
定义一个 myInfoWindow 对象,增加一些属性,原理有原型原型链,以及 class 等基础应该可以理解(本人怕描述有误,该段直接上代码)
鼠标移入,定义一个 myInfoWindow 新的遮罩层,鼠标移出把遮罩层销毁

```javascript
function myInfoWindow(options) {
  this.item = options;
  TMap.DOMOverlay.call(this, options);
}
myInfoWindow.prototype = new TMap.DOMOverlay();

// 初始化
myInfoWindow.prototype.onInit = function (options) {
  this.position = options.position;
  this.content = options.content;
};
// 创建DOM元素，返回一个DOMElement
myInfoWindow.prototype.createDOM = function (options) {
  mydom = document.createElement('div');
  //设置DOM样式
  mydom.style.cssText =
    'height:200px;max-width:250px;padding:11px;background:#092854;border:#000000 solid 1px;\
    line-height:24px;font-size:12px;position:absolute;top:0px;left:0px;color:#fff;cursor:pointer;opacity:0.8;borderRadius:6px;';
  mydom.innerHTML =
    '<div id="info" style="padding-bottom:10px">' +
    '<div><span>企业名称：</span>' +
    this.item.item.corp_Nm +
    '</div> ' +
    '<div><span>行业：</span>' +
    this.item.item.belg_Inds +
    '</div> ' +
    '<div><span>就业人数：</span>' +
    this.item.item.employ_Pers_Cnt +
    '</div> ' +
    '<div><span>产值：</span>' +
    this.item.item.prd_Val +
    '万元' +
    '</div> ' +
    '<div><span>注册资金：</span>' +
    this.item.item.rgst_Cap +
    '</div> ' +
    '<div><span>企业性质：</span>' +
    this.item.item.entr_Label +
    '</div> ' +
    '<div><span>是否上市：</span>' +
    this.item.item.is_Mkt +
    '</div> ' +
    '</div>';
  return mydom;
};

// 更新DOM元素，在地图移动/缩放后执行
myInfoWindow.prototype.updateDOM = function () {
  if (!this.map) {
    return;
  }
  // 经纬度坐标转容器像素坐标
  let pixel = this.map.projectToContainer(this.position);

  //默认使用DOM左上角作为坐标焦点进行绘制（左上对齐）
  //如想以DOM中心点（横向&垂直居中）或其它位置为焦点，可结合this.dom.clientWidth和this.dom.clientHeight自行计算
  let left = pixel.getX() - this.dom.clientWidth / 2 + 'px'; //本例水平居中
  let top = pixel.getY() + 'px';

  //将平面坐标转为三维空间坐标
  this.dom.style.transform = `translate3d(${left}, ${top}, 0px)`;
};
```

鼠标移出移出

```javascript
marker.on('mouseover', function (evt) {
  //创建一个自定义的infoWindow
  myIW = new myInfoWindow({
    map: map,
    position: evt.geometry.position,
    item: evt.geometry.item,
  });
});
marker.on('mouseout', function (evt) {
  console.log('mouseout', myIW);
  // myIW.onDestroy()
  myIW.destroy();
});
```

以上就是本次工作日常爬坑分享,下面附上全部 js 代码

```javascript
//自定义DOM覆盖物 - 继承DOMOverlay
var mydom;
function myInfoWindow(options) {
  this.item = options;
  TMap.DOMOverlay.call(this, options);
}
myInfoWindow.prototype = new TMap.DOMOverlay();

// 初始化
myInfoWindow.prototype.onInit = function (options) {
  this.position = options.position;
  this.content = options.content;
};
// 创建DOM元素，返回一个DOMElement
myInfoWindow.prototype.createDOM = function (options) {
  mydom = document.createElement('div');
  //设置DOM样式
  mydom.style.cssText =
    'height:200px;max-width:250px;padding:11px;background:#092854;border:#000000 solid 1px;\
    line-height:24px;font-size:12px;position:absolute;top:0px;left:0px;color:#fff;cursor:pointer;opacity:0.8;borderRadius:6px;';
  mydom.innerHTML =
    '<div id="info" style="padding-bottom:10px">' +
    '<div><span>企业名称：</span>' +
    this.item.item.corp_Nm +
    '</div> ' +
    '<div><span>行业：</span>' +
    this.item.item.belg_Inds +
    '</div> ' +
    '<div><span>就业人数：</span>' +
    this.item.item.employ_Pers_Cnt +
    '</div> ' +
    '<div><span>产值：</span>' +
    this.item.item.prd_Val +
    '万元' +
    '</div> ' +
    '<div><span>注册资金：</span>' +
    this.item.item.rgst_Cap +
    '</div> ' +
    '<div><span>企业性质：</span>' +
    this.item.item.entr_Label +
    '</div> ' +
    '<div><span>是否上市：</span>' +
    this.item.item.is_Mkt +
    '</div> ' +
    '</div>';
  return mydom;
};

// 更新DOM元素，在地图移动/缩放后执行
myInfoWindow.prototype.updateDOM = function () {
  if (!this.map) {
    return;
  }
  // 经纬度坐标转容器像素坐标
  let pixel = this.map.projectToContainer(this.position);
  //默认使用DOM左上角作为坐标焦点进行绘制（左上对齐）
  //如想以DOM中心点（横向&垂直居中）或其它位置为焦点，可结合this.dom.clientWidth和this.dom.clientHeight自行计算
  let left = pixel.getX() - this.dom.clientWidth / 2 + 'px'; //本例水平居中
  let top = pixel.getY() + 'px';
  //将平面坐标转为三维空间坐标
  this.dom.style.transform = `translate3d(${left}, ${top}, 0px)`;
};

TMaps('XA7BZ-XXXXX-XXXXX-XXXXX-XXXXX-QRFVL').then((qq) => {
  // 初始化地图
  const map = new TMap.Map(document.getElementById('3dmap'), {
    baseMap: {
      // 设置卫星地图
      type: 'satellite',
    },
    // 地图的中心地理坐标。
    center: new TMap.LatLng(XX, XX),
    zoom: 14,
    maxZoom: 18,
    boundary: new TMap.LatLngBounds(
      new TMap.LatLng(XX, XX),
      new TMap.LatLng(XX, XX)
    ),
  });
  // // 隐藏控件
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.SCALE);
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
  // map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.LOGO)
  map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.FLOOR);
  // // 遮罩层
  let imageSW = new TMap.LatLng(XX, XX);
  let imageNE = new TMap.LatLng(XX, XX);
  var imageLatLngBounds = new TMap.LatLngBounds(imageSW, imageNE);
  var imageGroundLayer = new TMap.ImageGroundLayer({
    bounds: imageLatLngBounds,
    src: './img/bgmap1.png',
    zoom: 14,
    maxZoom: 18,
    map: map,
  });

  let geometries = [];
  var myIW;
  mapData.forEach((item, index) => {
    geometries.push({
      //点标注数据数组
      id: 'demo',
      styleId: 'marker',
      item,
      position: new TMap.LatLng(item.longitude, item.latitude),
      properties: {
        title: 'marker',
      },
    });
  });
  //初始化marker
  var marker = new TMap.MultiMarker({
    id: 'marker-layer', //图层id
    map: map,
    styles: {
      //点标注的相关样式
      marker: new TMap.MarkerStyle({
        width: 15,
        height: 15,
        // anchor: { x: 16, y: 32 },
        src: qiye,
      }),
    },
    geometries,
  });
  marker.on('mouseover', function (evt) {
    //创建一个自定义的infoWindow
    myIW = new myInfoWindow({
      map: map,
      position: evt.geometry.position,
      item: evt.geometry.item,
    });
  });
  marker.on('mouseout', function (evt) {
    console.log('mouseout', myIW);
    myIW.destroy();
  });
});
```
