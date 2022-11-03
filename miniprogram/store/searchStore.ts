import EventStore from './event-store/event-store';
import { getHotSearch, getSearchedSongs } from '../service/modules/search';

const searchStore = new EventStore({
  state: {
    hotSearch: [],
    songList: [],
  },
  actions: {
    fetchHotSearchList(ctx: any) {
      getHotSearch().then((res: any) => {
        ctx.hotSearch = res.result.hots;
      }).catch(err => {
        console.log('获取热门搜索失败', err);
      })
    },
    fetchSearchedSongs(ctx: any, keywords: string) {
      getSearchedSongs(keywords).then((res: any) => {
        ctx.songList = res.result.songs;
      })
    }
  }
});

export default searchStore;