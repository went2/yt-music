export const isObject = (obj: any):boolean => {
  const type = typeof obj;
  return type === 'object' && !!obj;
}

interface LyricItem {
  text: string;
  time: number
}
const lyricReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
// 解析歌词
export function parseLyric(lyricString: string): Array<LyricItem> {
  const lyricInfo = [];
  const lyricLines = lyricString.split('\n');
  for(const lineString of lyricLines) {
    // '[01:18.34]谢谢你给我的爱'
    const result = lyricReg.exec(lineString);
    if(!result) continue;
    const minute = Number(result[1]) * 60 * 1000;
    const second = Number(result[2]) * 1000;
    const mSecond = result[3].length === 2 ? Number(result[3]) * 10 :  Number(result[3]) * 1;
    const time = minute + second + mSecond;
    const text = lineString.replace(lyricReg, '');
    lyricInfo.push({ text, time });
  }

  return lyricInfo;
}