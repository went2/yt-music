import req from '../request/index';
import { catList } from '../../mockdata/metaCat';

// 获取顶部分类栏数据，无对应接口，返回本地固定数据
export function getMetaCat() {
  return new Promise((resolve) => {
    resolve(catList);
  });
}

export function getPersonalizedList() {
  return req.get({
    url: '/personalized?limit=20'
  })
}

export function getRecommentMv() {
  return req.get({
    url: "/top/mv?limit=10"
  })
}

export function getPlaylistDetail(id: number) {
  return req.get({
    url: "/playlist/detail",
    data: {
      id
    }
  })
}

export function getNewRelease() {
  return req.get({
    url: "/album/newest"
  });
}

export function getOfficialRecommend() {
  return req.get({
    url: "/mv/exclusive/rcmd"
  });
}