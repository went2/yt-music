import detailStore from '../../store/detailStore';
import { throttle } from 'underscore'

const app = getApp();
const audioCtx = wx.createInnerAudioContext();

Page({
  data: {
    id: '',
    songDetail: {},
    navItems: ['歌曲','歌词'],
    activeNav: 0,
    swiperHeight: 0,
    currentTime: 0,
    duration: 0,
    currentProgress: 0,
    isPlaying: false,
    isSliding: false,
    lyric: [] as Array<{ text: string, time: number }>,
    currentLyric: ''
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ id });

    const appData =  app.globalData;
    this.setData({
      swiperHeight: appData.screenHeight - appData.statusBarHeight - appData.MENU_BAR_HEIGHT
    })

    detailStore.onState('songDetail', this.setSongDetail);
    detailStore.onState('lyric', this.setLyric);

    detailStore.dispatch('fetchSongDetail', this.data.id);
    detailStore.dispatch('fetchLyric', this.data.id);

    audioCtx.src=`https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`;
    audioCtx.autoplay = true;

    // 播放进度
    audioCtx.onTimeUpdate(throttle(() => {
      if(!this.data.isSliding) {
        const currentTime = audioCtx.currentTime * 1000;
        this.setData({
          currentTime,
          currentProgress: currentTime / this.data.duration * 100
        });
        this.setCurrentLyric();
      }
    }, 200, { leading: false, trailing: false }));

    audioCtx.onWaiting(() => {
      audioCtx.pause();
    });
    audioCtx.onCanplay(() => {
      audioCtx.play();
    })
  },

  // handlers
  onTapNav(event: WechatMiniprogram.BaseEvent){
    this.setActiveNav(event.currentTarget.dataset.index);
  },
  onTapNavBack() {
    wx.navigateBack();
  },

  onSwiperChange(event: WechatMiniprogram.SwiperChange) {
    this.setActiveNav(event.detail.current);
  },
  onTapPlay() {
    if(audioCtx.paused) {
      this.setData({ isPlaying: false });
      audioCtx.play();
    } else {
      this.setData({ isPlaying: true });
      audioCtx.pause();
    }
  },
  onSliderChange(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = (value/100)*this.data.duration;
    this.setData({ currentTime, currentProgress: value });
    audioCtx.seek(currentTime/1000);
    this.data.isSliding = false;
  },
  onSliderChanging(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = value/100 * this.data.duration;
    this.setData({
      currentTime
    })
    this.data.isSliding = true;
  },

  setCurrentLyric(){
    let index = this.data.lyric.length - 1;
    for(let i=0; i<this.data.lyric.length; i++) {
      const lyric = this.data.lyric[i];
      if(lyric.time >= this.data.currentTime) {
        index = i - 1;
        this.setData({
          currentLyric: this.data.lyric[index].text
        })
        break;
      }
    }
  },

  setActiveNav(activeIndex:number) {
    this.setData({activeNav: activeIndex});
  },
  setSongDetail(value: any) {
    this.setData({ songDetail: value, duration: value.dt || 0 })
  },
  setLyric(value: Array<{ text: string, time: number }>) {
    this.setData({ lyric: value || '' });
  },
  onUnload() {
    detailStore.offState('songDetail', this.setSongDetail);
    detailStore.offState('lyric', this.setLyric);
  }
});

export {};