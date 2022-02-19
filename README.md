# force-autoplay
用于校验媒体元素是否允许自动播放，并基于本人对自动播放的一些理解，用特殊的方式实现媒体的自动播放
![Version](https://img.shields.io/npm/v/force-autoplay.svg)
</br>

# example
### demo1: 常见的视频播放页面场景, 支持ios微信自动播放, <a href="https://playertest.polyv.net/player2/force-autoplay/scene-live-watch.html">传送门</a>
<img width="200" src="https://playertest.polyv.net/player2/force-autoplay/imgs/scene-demo.png">

# 功能
- 检验媒体元素是否允许自动播放
- 支持由用户交互触发的强制自动播放(主流浏览器都支持)
- 特殊浏览器的非常规的强制自动播放, 主要是移动端的浏览器(ios微信自动播放)

# 背景 + 原理
目前主流的浏览器默认就禁止媒体的自动播放，以大名鼎鼎的chrome为例子，他们就是禁止媒体的自动播放，但是也不完全禁止，他们允许视频【静音自动播放】，允许【用户交互触发的视频播放】，force-autoplay就是基于这两个规则实现的自动播放。
</br>
在PC端上这两个规则就比较统一，但是在国内的移动端浏览器环境下，就不一定了。对于国内的移动端浏览器，【用户交互触发的视频播放】这条规则基本都是支持的，【静音自动播放】这条规则部分支持。还有一些浏览器能通过一些非常规的方式来达到自动播放。
</br>
force-autoplay基于上述的规则（【静音自动播放】和【用户交互触发的视频播放】），下面讲述实现的原理：
```
forceAutoplay.force({
  muted: false,
  clickTarget: document.querySelector('btn')
}).then((rs) => {
  const { media, result } = rs
  if (result) {
    media.src = '自定义的视频地址';
    media.play();
  }
})
```
### 【强制自动播放实现核心原理和简单流程】
forceAutoplay 简称fa

开发者给fa传入了一个dom对象（clickTarget, fa会先创建一个媒体对象mediaA(video或audio), 然后给这个dom对象绑定一个点击事件，当由用户点击按钮时，fa会用mediaA播放一段无声音的媒体资源，因为mediaA是由用户点击触发的，符合【用户交互触发的视频播放】这个规则，所以mediaA是允许播放的，此时mediaA具备了自动播放的能力，我这里简称上述的行为是"预播放", 当"预播放"成功后，fa会存储这个媒体对象mediaA，然后resolve给开发者，然后开发者可以用mediaA为所欲为的播放视频啦。

clickTarget可以不设置(但是建议设置)，此时只会根据【静音自动播放】这个规则，如果浏览器不支持静音自动播放，则永远都不会触发resolve, 请注意哦。

所以大佬们应该了解到forceAutoplay是根据上述的两个自动播放规则去实现的，所以也会出现一个情况，就是当自动播放是由【静音自动播放】这个规则触发的，则resolve回来的媒体对象也必须是静音才能自动播放，如果直接取消静音，也会播放失败。可以配置checkMustMuted
来获得返回的媒体对象是否支持自动播放！！！

# 安装
```
yarn add force-autoplay

npm install force-autoplay
```

# 接入方式
### 方式1 : import导入
```
import forceAutoplay from 'force-autoplay'

forceAutoplay.check(config).then((checkResult) => {
  const { result } = checkResult;
  console.log(result);
})

forceAutoplay.force(config).then((forceResult) => {
  const { media } = checkResult;

  media.play();
})
```

### 方式2 : 使用umd包，浏览器通过script导入
```
<script src="./dist/force-autoplay.min.js"></script>
<script>
forceAutoplay.check(config).then((rs) => {
  if(rs.result) {
    console.log('allow autoplay!!!')
  }
})

forceAutoplay.force(config).then((rs) => {
  const { media } = checkResult;

  media.play();
});
</script>

```

# 注意事项，重要！！！
使用force-autoplay会返回一个允许调用play()方法的媒体对象，如果需要自动播放，一定要使用这个媒体对象，并将其appendChild到你想要放置的位置里，然后再设置媒体的src。
返回的媒体对象默认是静音的。下面会解释为什么是静音的：
如果是由用户交互触发的自动播放，允许给这个媒体对象取消静音, 如下例子
```
forceAutoplay.force({
  clickTarget: btnElement // btnElement代指按钮dom对象
  muted: false
}).then((forceResult) => {
  // 经过点击触发的then， 此时是允许关闭静音的
  const { media } = checkResult;

  media.muted = false;
  media.play();
})
```
如果是由【静音自动播放】这个规则触发的自动播放，则必须由用户关闭视频静音，或者由用户交互触发的事件内去关闭静音
```
forceAutoplay.force({
  muted: true
}).then((forceResult) => {
  const { media } = checkResult;

  // 这时页面就会报错，视频也无法自动播放，但是也可以这样处理, 保持静音自动播放
  media.muted = false;
  media.play().catch(() => {
    media.muted = true;
    media.play();
  })
})
```



# API
可以参考doc文件夹的API说明

### force接口的主要配置说明
```
// ts不熟练或者懒得翻docs目录的同学可以看下面的注释
const forceConfig = {
  /**
   * clickTarget 给目标对象绑定点击事件, 点击后会预播放视频
   * 可以传单个dom对象，如果有多个dom对象需要放数组里 domElement 或 [documentElement1, domElement2]
   * 
   */
  clickTarget: document.querySelector('btn'),

  /**
   * checkMustMuted 校验媒体对象是否需要静音才能自动播放
   * 设置boolean属性
   * 检验force接口返回的medie对象是否需要静音才能自动播放，当设置了这个参数时，promise的返回会多一个参数mustMuted来说明这个校验的结果
   */
  checkMustMuted: true,

  /**
   * forceTimeOut force函数返回的promise, 默认是不会resolve一个失败的结果，如果需要返回异常的情况，可以设置这个参数，在超过timeout的时间后，会触发promise的resolve
   * number类型，单位是毫秒
   */
  forceTimeOut,

  /**
   * 插件， 作用说明可以往下翻, 看看"关于插件"的说明
   * 接收一个数组，数组存储的是返回promise的函数A，具体看下面的例子或者example目录中的例子
   */
  plugins: [
    function(checkResult) {
      const { media, result } = checkResult;

      return new Promise((resolve) => {
        ...自定义的判断逻辑
        resolve({
          media,
          result: true
        })
      })
    }
  ]


}

forceAutoplay.force(forceConfig)
```

### check接口的配置暂时不想写，后面再放出能在线浏览的typedoc文档啦～～，是在是太懒了

# 关于插件
插件是用于一些特殊场景(不通用)，所以是没有直接写在库中，目前仅写了一个ios微信自动播放(仅支持ios微信！！！以前安卓也支持的，后面没用了)的插件，后续会根据其他浏览器的测试情况，再补充插件。
插件是写在项目的【/example/plugins】目录中

# ChangeLog
#### 【1.0.3】
- 补充文档
- 修复import导入的方式跟文档(快速接入)不匹配的问题



# 其他
喜欢的话可以给作者一个star哦

# License
MIT