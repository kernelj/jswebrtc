# JSWebrtc – 支持 SRS 的 Webrtc 播放器

JSWebrtc 对浏览器的 Webrtc 做了简单的封装，支持 [SRS](https://github.com/ossrs/srs) 的 RTC 流的播放.

快速上手: 
```html
<script src="dist/jswebrtc.min.js"></script>
<div class="jswebrtc" data-url="webrtc://osiii.com/live/livestream"></div>
```

具体示例: [examples](/examples)


## 用法

JSWebrtc 播放器可以通过 HTML 创建，只需给指定元素添加 CSS 样式 `jswebrtc` 即可: 

```html
<div class="jswebrtc" data-url="<url>"></div>
```

也可以通过在 JavaScript 中调用 `JSWebrtc.Player()` 构造方法来创建: 

```javascript
var player = new JSWebrtc.Player(url [, options]);
```

参数 `url` 是一个 webrtc 开头的地址 (webrtc://...).

参数 `options` 支持下列的配置项: 

- `video` – 用于播放视频的 HTML Video 元素.
- `autoplay` - 是否自动播放. 默认 `false`.
- `onPlay(player)` – 播放后回调
- `onPause(player)` – 暂停后回调


## JSWebrtc.Player API

实例 `JSWebrtc.Player` 支持以下方法和属性:

- `.play()` – 开始
- `.pause()` – 暂停
- `.stop()` – 停止
- `.destroy()` – 停止播放并清理相关的播放资源.
- `.paused` – 只读, 是否暂停播放


## 构建

如何构建 min 文件:

```sh
npm install
./build.sh
```

