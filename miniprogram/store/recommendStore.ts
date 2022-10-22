import EventStore from './event-store/event-store';
import { 
  getPersonalizedList, getRecommentMv, getPlaylistDetail, getNewRelease,
  getOfficialRecommend
} from '../service/modules/playlist';

const recommendStore = new EventStore({
  state: {
    personalizedList: [],
    recommendMv: [],
    recommendSongs: [],
    newRelease: [],
    officialRecommend: []
  },
  actions: {
    fetchPersonalizedList(ctx: any) {
      getPersonalizedList().then((res:any) => {
        ctx.personalizedList = res.result;
      })
    },
    fetchRecommendMv(ctx: any) {
      getRecommentMv().then((res: any) => {
        ctx.recommendMv = res.data;
      })
    },
    fetchRecommendSongs(ctx:any) {
      // 热门歌曲榜单详情
      getPlaylistDetail(3778678).then((res:any) => {
        ctx.recommendSongs = res.playlist.tracks;
      }).catch(e => {
        console.error('获取热门单曲失败', e);
      })
    },
    fetchNewRelease(ctx: any) {
      getNewRelease().then((res: any) => {
        ctx.newRelease = res.albums;
      })
    },
    fetchOfficialRecommend(ctx: any) {
      getOfficialRecommend().then((res: any) => {
        ctx.officialRecommend = res.data;
      });
    }
  }
});

// module.exports = recommendStore;
export default recommendStore;
