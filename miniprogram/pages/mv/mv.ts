import {getMvInfo , getMvUrl, getRelativeMv} from '../../service/modules/mv';
Page({
  data: {
    id: 0,
    detail: {},
    url: '',
    relativeMvlist: []
  },
  onLoad(options) {
    const id = Number(options.id);
    this.setData({ id });

    this.fetchMvDetail();
    this.fetchMvUrl();
    this.fetchRelativeMv();
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