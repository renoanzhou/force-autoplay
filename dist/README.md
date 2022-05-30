# force-autoplay
基于浏览器自动播放的规则，实现媒体的自动播放, 并支持校验媒体元素是否允许自动播放，支持PC和移动端
![Version](https://img.shields.io/npm/v/force-autoplay.svg)
</br>

# example
### demo1: 常见的视频播放页面场景, 支持ios微信自动播放, <a href="https://playertest.polyv.net/player2/force-autoplay/scene-live-watch.html">传送门</a>
<img width="200" src="https://playertest.polyv.net/player2/force-autoplay/imgs/scene-demo.png">

# 功能
- 检验媒体元素是否允许自动播放
- 支持由用户交互触发的自动播放(主流浏览器都支持)
- 检测是否需要静音才能自动播放
- 特殊浏览器的非正常情况的强制自动播放, 主要是移动端的浏览器(ios微信自动播放，未来可能无效)


# 原理
可以在掘金看详细说明 <a href="https://juejin.cn/post/7070126737119674405/">传送门</a>

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

// !!!要兼容移动端的话，建议配置参数mediaSrc， 详细见文档底部的说明
forceAutoplay.force({mediaSrc: 'https://xxx/xxx.mp4'}).then((forceResult) => {
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

// !!!要兼容移动端的话，建议配置参数mediaSrc， 详细见文档底部的说明
forceAutoplay.force(config).then((rs) => {
  const { media } = checkResult;

  media.play();
});
</script>

```



# API
### 点击👉 <a href="http://playertest.polyv.net/player2/force-autoplay/docs/">typedoc API文档</a>

</br>
# 其他

### 关于插件
插件是用于一些特殊场景(不通用, 可能随时无效)，所以是没有直接写在库中，目前仅写了一个ios微信自动播放(仅支持ios微信！！！以前安卓也支持的，后面没用了)的插件，后续会根据其他浏览器的测试情况，再补充插件。
插件是写在项目的【/example/plugins】目录中

### 关于这个库
实际上是无法强制自动播放的(浏览器限制)，只是利用一些自动播放的规则去自动播放。
其实是练手的一个库啦，提供一个思路，对于接入的同学来说，方便了自动播放的检测，并且支持检测了是否需要静音才能自动播放。
当然你按照上述的原理，直接在用户交互的事件内创建video对象或调用play()，肯定是最有效的方式....

# 其他
喜欢的话可以给作者一个star哦, 欢迎提Issues。

# 测试记录 ｜ 浏览器兼容性记录
1.测试touchstart事件跟click事件。发现在click事件内触发video.play()才有效，touchstart内调用video.play是无效的
2.UC、夸克浏览器对于播放blob视频有点问题，会出现视频能播放，但是检测自动播放失败，这种可以使用mediaSrc参数，使用mp4来检测
# License
MIT


# ChangeLog
#### 【1.0.3】
- 补充文档
- 修复import导入的方式跟文档(快速接入)不匹配的问题

#### 【1.0.4 - 1.05】
- 补充文档
- 补充线上typedoc文档

#### 【1.0.6】
- 补充文档
- 简化check 跟 force的逻辑

#### 【1.1.0】
- 新增静音自动播放检测
- 预播放去掉touchstart事件
- 传参修改
- 其他代码小改动
#### 【1.1.x】
- 文档修改

#### 【1.2.0】
- 新增mediaEle参数，支持检测自定义video的对象是否允许自动播放

#### 【1.2.1】
- 删除debug
- 检测完自动播放后或强制自动播放后，返回的video对象的src设置为空，避免一些奇奇怪怪的问题