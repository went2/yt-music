import searchStore from '../../store/searchStore';
import playStore from '../../store/playStore';
import { getSuggestList } from '../../service/modules/search';
import { debounce } from 'underscore';

Page({
  behaviors: [ Behavior({
    observers: {
      inputValue(newValue: any) {
        if(newValue) {
          //@ts-ignore
          this.setData({ isSearching: true });
          //@ts-ignore
          this.fetchSuggestList();
        } else {
          //@ts-ignore
          this.setData({ suggestList: [], isSearching: false })
        }
      },
      searchValue(newValue: any) {
        // console.log('searchValue change', newValue);
        if(newValue !== '') {
          searchStore.dispatch('fetchSearchedSongs', newValue);
        } else {
          searchStore.setState('songList', []);
        }
      }
    }
  }) ],
  data: {
    hotSearch: [],
    isSearching: false,
    suggestList: [],
    songList: [],
    searchValue: '',
    inputValue: ''
  },
  onLoad() {
    // 订阅store
    searchStore.onState('hotSearch', this.setHotSearch);
    searchStore.onState('songList', this.setSongList);

    searchStore.dispatch('fetchHotSearchList');
  },
  // event handlers
  onSearchChange: debounce(function(event: WechatMiniprogram.CustomEvent) {
    const keyword = event.detail as any;
    //@ts-ignore
    this.setData({ inputValue: keyword });
  }, 200),
  onSearch(event: WechatMiniprogram.CustomEvent){
    const keywords = event.detail;
    // @ts-ignore
    this.setData({ searchValue: keywords });
  },

  onTapSearchItem(event: WechatMiniprogram.BaseEvent) {
    const keyword = event.currentTarget.dataset.keyword as string;
    this.setData({ searchValue: keyword });
  },
  onSeachClear() {
    this.setData({ suggestList: [], searchValue: '' });
  },
  onTapSong(event: WechatMiniprogram.BaseEvent) {
    const songList = searchStore.state.songList;
    const id = event.currentTarget.dataset.id;
    const index = songList.findIndex((item: any) => {
      return item.id === id;
    })
    playStore.setState('playSongList', songList);
    playStore.setState('playSongIndex', index);
    wx.navigateTo({
      url: `/pages/player/player?id=${id}`
    })
  },

  fetchSuggestList() {
    getSuggestList(this.data.inputValue).then((res: any) => {
      const result = res.result.allMatch
      this.setData({ 
        suggestList: result || []
       });
    });
  },

  // utils
  flatSuggestList(obj: any): Array<{name: string, type: string}> {
    const keys = obj.order as string[];
    const result = [] as Array<{name: string, type: string}>;
    keys.forEach((key) => {
      let item = { name: obj[key] as string, type: key };
      result.push(item);
    });
    return result;
  },

  // callbacks
  setHotSearch(hotSearch: any) {
    this.setData({ hotSearch });
  },
  setSongList(songList: any) {
    this.setData({ songList });
  },

  onUnload() {
    searchStore.offState('hotSearch', this.setHotSearch);
    searchStore.offState('songList', this.setSongList);
    searchStore.setState('songList', []);
  }
})