import playStore, { audioCtx } from '../../store/playStore';
import { throttle } from 'underscore';

const app = getApp();

Page({
  data: {
    keys: ['songDetail', 'duration','playSongList', 'playSongIndex', 'lyric', 'currentLyric', 'currentLyricIndex', 'mode', 'currentTime', 'isPlaying'],
    // 播放
    id: -1,
    songDetail: {},
    lyric: [] as Array<{ text: string, time: number }>,
    currentLyric: '',
    currentLyricIndex: -1,
    mode: 0,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    playSongList: [] as any[],
    playSongIndex: -1,

    // 页面
    navItems: ['歌曲','歌词'],
    activeNav: 0,
    swiperHeight: 0,
    currentProgress: 0,
    isSliding: false,
    lyricScrollTop: 0,
  },
  onLoad(options) {
    const id = Number(options.id);
    const appData =  app.globalData;
    this.setData({ swiperHeight: appData.screenHeight - appData.statusBarHeight - appData.MENU_BAR_HEIGHT });

    playStore.onStates(this.data.keys, this.setPlaySongInfo);
    if(!playStore.state.isPlaying && (id !== playStore.state.songDetail.id)) {
      this.setData({ 
        songDetail: {},
        currentLyric: '',
        lyric: [],
        currentLyricIndex: -1,
        currentTime: 0,
        duration: 0
      });
      playStore.dispatch('playNewSongWithId', id);
    }
  },

  setPlaySongInfo({ 
    songDetail, playSongList, playSongIndex, lyric, currentLyric,
    currentLyricIndex, mode, currentTime, isPlaying
  }: any) {
    if(songDetail) {
      this.setData({ songDetail });
      this.setData({ duration: songDetail.dt || 0 });
    }
    if(playSongList) {
      this.setData({ playSongList })
    }
    if(playSongIndex !== undefined) {
      this.setData({ playSongIndex })
    }
    if(lyric) {
      this.setData({ lyric });
    }
    if(currentLyric !== undefined){
      this.setData({ currentLyric });
    }
    if(currentLyricIndex !== undefined){
      this.setData({
        currentLyricIndex,
        lyricScrollTop: this.data.currentLyricIndex * 35
      });
    }
    if(mode !== undefined) {
      this.setData({ mode });
    }
    if(currentTime) {
      this.updateProgress(currentTime);
    }
    if(isPlaying !== undefined) {
      this.setData({ isPlaying });
    }
  },

  updateProgress: throttle(function(currentTime: number) {
    //@ts-ignore
    if(!this.data.isSliding) {
      //@ts-ignore
      const currentProgress = currentTime / this.data.duration * 100;
      //@ts-ignore
      this.setData({ currentTime, currentProgress });
    }
  }, 500, { leading: false, trailing: false }),

  // handlers
  onTapNav(event: WechatMiniprogram.BaseEvent){
    this.setActiveNav(event.currentTarget.dataset.index);
  },
  onTapNavBack() {
    wx.navigateBack();
  },

  onTapPre() {
    playStore.dispatch('changeNewSongAction', false)
  },
  
  onTapNext() {
    playStore.dispatch('changeNewSongAction', true)
  },

  onTapMode() {
    let mode = this.data.mode + 1;
    mode = mode > 2 ? 0 : mode;
    playStore.setState('mode', mode);
  },

  onSwiperChange(event: WechatMiniprogram.SwiperChange) {
    this.setActiveNav(event.detail.current);
  },
  onTapPlay() {
    playStore.dispatch('changePlayStatusAction');
  },
  onSliderChange(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = (value/100)*this.data.duration;
    this.setData({ currentTime, currentProgress: value });
    audioCtx.seek(currentTime/1000);
    this.data.isSliding = false;
  },
  onSliderChanging: throttle(function(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    //@ts-ignore
    const currentTime = value/100 * this.data.duration;
    //@ts-ignore
    this.setData({ currentTime });
    //@ts-ignore
    this.data.isSliding = true;
  }, 500, { leading: false, trailing: false }),
  
  setActiveNav(activeIndex: number) {
    this.setData({activeNav: activeIndex});
  },

  onUnload() {
    playStore.offStates(this.data.keys, this.setPlaySongInfo)
  }
});

export {};