import {getMvInfo , getMvUrl, getRelativeMv} from '../../service/modules/mv';
import playStore from '../../store/playStore';

Page({
  data: {
    id: 0 as any,
    detail: {},
    url: '',
    relativeMvlist: []
  },
  onLoad(options) {
    const id = options.id;
    this.setData({ id });

    this.fetchMvDetail();
    this.fetchMvUrl();
    this.fetchRelativeMv();
  },
  // handlers
  onClickOtherMvItem(event: WechatMiniprogram.BaseEvent) {
    const id = event.currentTarget.dataset.id;
    playStore.setState('currentMvId', id);
    wx.navigateTo({
      url: `/pages/mv/mv?id=${id}`
    })
    
  },
  fetchMvDetail() {
    getMvInfo(this.data.id).then((res: any) => {
      this.setData({ detail: res.data });
    });
  },
  fetchMvUrl() {
    getMvUrl(this.data.id).then((res: any) => {
      this.setData({ url: res.data.url });
    })
  },
  fetchRelativeMv() {
    getRelativeMv(this.data.id).then((res: any) => {
      this.setData({ relativeMvlist: res.data });
    })
  }
})