import { ComponentType,Component } from 'react'
import {
  getBackgroundAudioManager,
  BackgroundAudioManager, 
} from '@tarojs/taro'
import { View, Slider, Text, Image } from '@tarojs/components'
import { getMinute, getSecond, pauseSrc, playSrc } from './util'
import './index.scss'


interface AudioPlayerProps {
  src: string
  title?: string
  singer?: string
  draggable?: boolean
  autoplay?: boolean
  loopPlay?:boolean
  coverImgUrl?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (errInfo: string) => void
  onTimeUpdate?: ({currentTime,duration}) => void
  onStop?: () => void
}

interface AudioPlayerState {
  currentTime: number
  iconSrc: string
  duration: number
  showTime1: string
  showTime2: string
}

//自动播放时，图标应该正确响应
class AudioPlayer extends Component<
  AudioPlayerProps & ComponentType,
  AudioPlayerState
> {
  innerAudioContext: BackgroundAudioManager
  interval: any

  static defaultProps = {
    autoplay: true,
    draggable: true,
    loopPlay: false
  }

  constructor(props) {
    super(props)
    this.innerAudioContext = getBackgroundAudioManager()
    this.interval = null
    this.sliderChange = this.sliderChange.bind(this)
    this.changeIconSrc = this.changeIconSrc.bind(this)
  }

  state = {
    currentTime: 0, //当前播放时间，单位s
    iconSrc: playSrc,
    duration: 0, // 默认播放总时长，单位s
    showTime1: '00:00',
    showTime2: '00:00',
  }

  componentDidMount() {
    this.audioContext()
  }

  audioContext() {
    const {
      src,
      title,
      singer,
      coverImgUrl,
      onPlay,
      autoplay,
      onError,
      onStop,
      onEnded,
      loopPlay
    } = this.props;
    const { onCanplay, duration, onError:innerAudioContexteError, onEnded:innerAudioContexteEnded, onStop:innerAudioContexteStop } = this.innerAudioContext;
    //duration 单位秒
    this.innerAudioContext.title = title || '未知'
    this.innerAudioContext.singer = singer || '未知'
    this.innerAudioContext.coverImgUrl = coverImgUrl || ''
    if (autoplay) {
      this.innerAudioContext.src = src
      this.setState({iconSrc: pauseSrc})
    } else {
      this.setState({iconSrc: playSrc})
    }
    let min1: string
    let sec1: string
    let min2: string
    let sec2: string
    onCanplay(() => {
      console.log('音频进入可以播放的阶段')
      //延时获取音频真正的duration
      min2 = getMinute(duration)
      sec2 = getSecond(duration)
      this.setState({ duration: duration, showTime2: `${min2}:${sec2}` })
      //刷新时间
      this.interval = setInterval(() => {
       const { currentTime, paused ,duration} = this.innerAudioContext;
        if (currentTime) {
          min1 = getMinute(currentTime)
          sec1 = getSecond(currentTime)
          this.setState({ showTime1: `${min1}:${sec1}`, currentTime })
        }
        if (duration) {
          min2 = getMinute(duration)
          sec2 = getSecond(duration)
          this.setState({
            duration,
            showTime2: `${min2}:${sec2}`,
            iconSrc: paused ? playSrc : pauseSrc,
          })
        }
        currentTime >= duration && clearInterval(this.interval)
      }, 1000)
    })

    this.innerAudioContext.onPlay(() => {
      min2 = getMinute(duration)
      sec2 = getSecond(duration)
      this.setState({ duration, showTime2: `${min2}:${sec2}` })
      onPlay && onPlay()
    })

    innerAudioContexteError(() => {
      // showModal({ title: '播放出错了,请退出重试！' })
      onError && onError('播放出错了,请退出重试！')
    })

    innerAudioContexteEnded(() => {
      this.setState({
        iconSrc: playSrc,
        showTime1: `00:00`,
        currentTime: 0,
      })
      loopPlay && this.audioContext()
      this.interval && clearInterval(this.interval)
      onEnded && onEnded()
    })
    innerAudioContexteStop(() => {
      //修改图标啊
      this.setState({
        iconSrc: playSrc,
      })
     onStop && onStop()
    })
  }

  componentWillUnmount() {
    if (this.innerAudioContext) {
      this.innerAudioContext.stop()
    }
    this.interval && clearInterval(this.interval)
  }

  //播放暂停
  changeIconSrc() {
    const { onEnded, onPlay, src: propsSrc } = this.props;
    const { duration, currentTime ,src, play, pause }  = this.innerAudioContext;
    let iconSrc = this.state.iconSrc;
    // duration 播放进度 ,  currentTime 播放总时长
    if (iconSrc === playSrc) {
      iconSrc = pauseSrc
      if (currentTime + 1 >= duration || !src) {
        //判断当前歌曲是否播放完成
        //重播
        console.log('重播 || 开始播放')
        this.innerAudioContext.src = propsSrc
        this.audioContext()
      } else {
        //继续播放
        console.log('继续播放')
        play && play()
        onPlay && onPlay()
      }
    } else {
      iconSrc = playSrc
      //暂停
      pause()
      onEnded && onEnded()
    }

    this.setState({
      iconSrc: iconSrc,
    })
  }

  //改变进度条
  sliderChange(event) {
    const { onTimeUpdate } = this.props;
    const { duration } = this.state;
    const min: string = getMinute(event.detail.value)
    const sec: string = getSecond(event.detail.value)
    const { seek, paused ,play } = this.innerAudioContext;
    this.setState({
      currentTime: event.detail.value,
      showTime1: `${min}:${sec}`,
    })
    seek(event.detail.value - 1) //不知道为啥，直接拖到最后会报错,所以做了-1处理
    onTimeUpdate && onTimeUpdate({currentTime:`${min}:${sec}`,duration:`${getMinute(duration)}:${getSecond(duration)}`})
    if (!paused) {
      play&& play()
    }
  }

  // 正在拖动的过程中
  sliderChangeIng() {
    console.log('正在拖动的过程中')
  }

  render() {
    const { currentTime, showTime2, showTime1, duration, iconSrc } = this.state
    const { coverImgUrl, title, singer, draggable } = this.props;
    return (
      <View className="co-audio-wrap">
        {coverImgUrl && (
          <View className="coverImgUrl-wrap">
            <Image src={coverImgUrl} className="coverImgUrl" mode="widthFix" />
          </View>
        )}
        <View className="text-wrap">
          {title && (
            <View className="audio-draggable">
              <Text>{title}</Text>
            </View>
          )}
          {singer && (
            <View className="audio-singer">
              <Text>{singer}</Text>
            </View>
          )}
        </View>
        <View className="player">
          <Image src={iconSrc} onClick={this.changeIconSrc} />
          <View className="slider">
            <Slider
              onChange={this.sliderChange}
              min={0}
              step={1}
              max={duration}
              value={currentTime}
              onChanging={this.sliderChangeIng}
              disabled={!draggable}
              activeColor="#5257f2"
              blockColor="#5257f2"
              blockSize={12}
            />
          </View>
          <View className="time">
            {showTime1}/{showTime2 === 'NaN:NaN' ? '00:00' : showTime2}
          </View>
        </View>
      </View>
    )
  }
}

export default AudioPlayer
