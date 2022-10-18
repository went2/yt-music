import { BASE_URL, TIME_OUT } from './config';

class Request {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl=BASE_URL, timeout=TIME_OUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private request(options: WechatMiniprogram.RequestOption<string | Record<string, any> | ArrayBuffer>) {
    const { url } = options;
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: this.baseUrl + url,
        timeout: this.timeout,
        success: res => resolve(res.data),
        fail: reject,
      })
    });
  }

  public get(options: WechatMiniprogram.RequestOption<string | Record<string, any> | ArrayBuffer>) {
    return this.request({...options, method: 'GET'});
  }

  public post(options: WechatMiniprogram.RequestOption<string | Record<string, any> | ArrayBuffer>) {
    return this.request({...options, method: 'POST'});
  }
}

const reqInstance = new Request();
export default reqInstance;
