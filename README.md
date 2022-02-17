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

# 背景
目前主流的浏览器默认就禁止媒体的自动播放，以大名鼎鼎的chrome为例子，他们就是禁止媒体的自动播放，但是也不完全禁止，他们允许视频【静音自动播放】，允许【用户交互触发的视频播放】，force-autoplay就是基于这两个规则实现的自动播放。
</br>
在PC端上这两个规则就比较统一，但是在国内的移动端浏览器环境下，就不一定了。对于国内的移动端浏览器，【用户交互触发的视频播放】这条规则基本都是支持的，【静音自动播放】这条规则部分支持。还有一些浏览器能通过一些非常规的方式来达到自动播放。force-autoplay基于上述的规则，来达成媒体的自动播放
</br>

# 安装
```
yarn add force-autoplay

npm install force-autoplay
```

# 接入方式
### 方式1 : import导入
```
import { force, check } from 'force-autoplay'

check(config).then((checkResult) => {
  const { result } = checkResult;
  console.log(result);
})

force(config).then((forceResult) => {
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

晚点补充

# License
MIT