import playStore from '../../store/playStore';
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
    playStore.dispatch('playNewSongWithId', id);

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
    if(currentLyric){
      this.setData({ currentLyric });
    }
    if(currentLyricIndex !== undefined){
      this.setData({
        lyricScrollTop: this.data.currentLyricIndex * 35
      })
    }
    if(mode !== undefined) {
      this.setData({ mode });
    }
    if(currentTime) {
      this.updateProgress(currentTime);
    }
    if(isPlaying) {
      this.setData({ isPlaying });
    }
  },

  changeSong(isNext: boolean = true) {
    let songId = -1;
    let songIndex = -1;

    if(this.data.mode === 2) {
      songIndex = Math.floor(Math.random() * this.data.playSongList.length);
    } else {
      if(isNext) { // next song
        songIndex = this.data.playSongIndex + 1;
        songIndex = songIndex >= this.data.playSongList.length - 1 ? 0 : songIndex;
      } else { // prev song
        songIndex = this.data.playSongIndex - 1;
        songIndex = songIndex < 0 ? this.data.playSongList.length - 1 : songIndex;
      }
    }
    playStore.setState('playSongIndex', songIndex);
    songId = this.data.playSongList[songIndex].id;
    // this.setupPlayer(songId);
  },

  updateProgress: throttle(function(currentTime: number){
    if(!this.data.isSliding) {
      const currentProgress = currentTime / this.data.duration * 100;
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
    this.changeSong(false);
  },
  
  onTapNext() {
    this.changeSong(true);
  },

  onTapMode() {
    let mode = this.data.mode + 1;
    mode = mode > 2 ? 0 : mode;
    this.setData({ mode });
  },

  onSwiperChange(event: WechatMiniprogram.SwiperChange) {
    this.setActiveNav(event.detail.current);
  },
  onTapPlay() {
    // if(audioCtx.paused) {
    //   this.setData({ isPlaying: false });
    //   audioCtx.play();
    // } else {
    //   this.setData({ isPlaying: true });
    //   audioCtx.pause();
    // }
  },
  onSliderChange(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = (value/100)*this.data.duration;
    this.setData({ currentTime, currentProgress: value });
    // audioCtx.seek(currentTime/1000);
    this.data.isSliding = false;
  },
  onSliderChanging(event: WechatMiniprogram.SliderChange) {
    const value = event.detail.value;
    const currentTime = value/100 * this.data.duration;
    this.setData({ currentTime });
    this.data.isSliding = true;
  },
  setActiveNav(activeIndex:number) {
    this.setData({activeNav: activeIndex});
  },

  onUnload() {
    playStore.offStates(this.data.keys, this.setPlaySongInfo)
  }
});

export {};