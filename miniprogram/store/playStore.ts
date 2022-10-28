import EventStore from './event-store/event-store';
import { 
  getSongDetail, getLyric
} from '../service/modules/playlist';
import { parseLyric } from '../utils/objhelper';

const audioCtx = wx.createInnerAudioContext();

const playStore = new EventStore({
  state: {
    id: 0,
    songDetail: {},
    playSongList: [],
    playSongIndex: -1,
    lyric: [] as Array<{ text: string, time: number }>,
    currentLyric: '',
    currentLyricIndex: -1,
    mode: 0, // 0 列表循环 1 单曲循环 2 随机
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  },
  actions: {
    fectchSongDetail(ctx: any, id: number) {
      getSongDetail(id).then((res: any) => {
        ctx.songDetail = res.songs[0];
      }).catch(e => {
        console.log('获取歌曲详情失败', e);
      });
      getLyric(id).then((res: any)=> {
        ctx.lyric = parseLyric(res.lrc.lyric);
      }).catch(e => {
        console.log('获取歌词失败', e);
      })
    },
    playSongWithId(ctx: any, id: number) {
      
    }
  },
});

export default playStore;
