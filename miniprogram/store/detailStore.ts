import EventStore from './event-store/event-store';
import { 
  getPlaylistDetail,
} from '../service/modules/playlist';

const detailStore = new EventStore({
  state: {
    playlistDetail: {},
    songDetail: {},
    lyric: []
  },
  actions: {
    fetchPlaylistDetail(ctx: any, id: string) {
      const paramId = Number(id);
      getPlaylistDetail(paramId).then((res: any) => {
        ctx.playlistDetail = res.playlist;
      }).catch(e => {
        console.log('获取歌单详情失败', e);
      })
    },
  }
});
export default detailStore;