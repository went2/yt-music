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