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
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ id });

    const appData =  app.globalData;
    this.setData({
      swiperHeight: appData.screenHeight - appData.statusBarHeight - appData.MENU_BAR_HEIGHT
    })

    detailStore.onState('songDetail', this.setSongDetail);
    detailStore.dispatch('fetchSongDetail', this.data.id);

    audioCtx.src=`https://music.163.com/song/media/outer/url?id=${this.data.id}.mp3`;
    audioCtx.autoplay = true;
    // audioCtx.pause();

    // 播放进度
    audioCtx.onTimeUpdate(throttle(() => {
      if(!this.data.isSliding) {
        console.log('onTimeUpdate');
        this.setData({
          currentTime: audioCtx.currentTime * 1000,
          currentProgress: (audioCtx.currentTime * 1000) / this.data.duration * 100
        })
      } 

    }, 200));
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
    const percent = event.detail.value;
    const currentTime = (percent/100)*this.data.duration;
    this.setData({ currentTime });
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


  setActiveNav(activeIndex:number) {
    this.setData({activeNav: activeIndex});
  },
  setSongDetail(value: any) {
    this.setData({ songDetail: value, duration: value.dt })
  },
  onUnload() {
    detailStore.offState('songDetail', this.setSongDetail);
  }
});

export {};