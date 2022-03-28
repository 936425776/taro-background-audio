### 代码借鉴 [`taro-audio`](https://www.npmjs.com/package/taro-audio) 开发的背景播放版本！！！
### 若需要小程序在退到后台后继续播放音频，你需要在 app.json 中配置 requiredBackgroundModes 属性，详见:[`微信小程序官方文档`](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#requiredBackgroundModes)。

## 代码演示
#### 引入
```typescript jsx
    import TaroBackgroundAudio from 'taro-background-audio';
```
#### 基础用法

通过`src`属性设置音频资源的地址

``` jsx
    <TaroBackgroundAudio src={'你的路径'}/>
```

![lvruHP.png](http://cdn.hixiaoya.com/taro-audioPlayer/1.png)

#### 显示音频名称

通过`title`属性显示音频名称

``` jsx
    <TaroBackgroundAudio src={'你的路径'} title='泡沫'/>
```

![lvr39g.png](http://cdn.hixiaoya.com/taro-audioPlayer/2.png)

#### 显示作者

通过`singer`属性显示音频作者

``` jsx harmony
<TaroBackgroundAudio src={'你的路径'} title='泡沫' singer='邓紫棋'/>
```
![lvr83Q.png](http://cdn.hixiaoya.com/taro-audioPlayer/3.png)

### 进度条是否可拖拽

通过`draggable`设置
```jsx harmony

 <TaroBackgroundAudio src={'你的路径'} title='泡沫' singer='邓紫棋' draggable={false}/>
```
![lvrnBt.png](http://cdn.hixiaoya.com/taro-audioPlayer/5.png)

#### 设置海报
通过`coverImgUrl`设置

``` jsx harmony
<TaroBackgroundAudio src={'你的路径'} title='泡沫' singer='邓紫棋' draggable coverImgUrl={'你的路径'}/>
```

![lxn3vj.png](http://cdn.hixiaoya.com/taro-audioPlayer/6.png)

### Props

| 参数 | 说明 | 类型 | 默认值 | 是否必须 |
|------|------|------|------|------|
| src | 音频资源的地址  | `string` | 无 | 是 |
| title | 音频名称 | `string` | 未知 | 否 |
| singer | 音频作者 | `string` | 未知 | 否 |
| coverImgUrl | 音频海报 | `string` | 无 | 否 |
| autoPlay | 是否自动播放 | `boolean` | true | 否 |
| loopPlay | 是否循环播放 | `boolean` | false | 否 |
| draggable | 是否可以拖动进度条 | `boolean` | true | 否 |
| onPlay | 当开始/继续播放时触发play事件 | `eventHandle` | 无 | 否 
| onPause | 当暂停播放时触发 pause 事件 | `eventHandle` | 无 | 否
| onEnded | 当播放到末尾时触发 ended 事件 | `eventHandle` | 无 | 否
| onTimeUpdate | 当播放进度改变时触发 timeupdate 事件，detail = {currentTime, duration} | `eventHandle` | 无 | 否
| onError | 当发生错误时触发 error 事件，detail = {errMsg} | `eventHandle` | 无 | 否
