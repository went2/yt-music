# 说明

仿照 Youtube Music 安卓版的界面写的小程序，使用了 [网易云音乐 NodeJS 版API](https://neteasecloudmusicapi.vercel.app/) 项目部署得到的接口。

实现了几类关键页面：
  - 1.首页的分模块列表页
  - 2.搜索页
    - 搜索建议
    - 热门搜索
  - 3.歌曲播放页
    - 播放模式
    - 歌词匹配
  - 4.歌单列表/详情页
  - 5.mv播放页

总的来说，开发微信小程序的写法和写 vue 的 options api 类似，你要把数据和方法分门别类地写到官方给你提供的选项中。
  - 微信小程序使用了和 vue、react 一致的方式处理模板数据绑定——使用 Mustache 语法，在双大括号内写 JavaScript 表达式；
  - 对于状态管理，项目使用事件总线的方式，采用 coderwhy 开发的 [EventStore](https://github.com/coderwhy/hy-event-store)，并且在开发时尽量采用这样方式管理状态：Page 管理所有状态与事件响应，Page 把数据通过子组件的 properties 传递给子组件，在子组件中发生的事件（mostly 点击事件），不在自己内部处理，而向外 `triggerEvent`，到 Page 中处理，子组件只负责接受数据并显示。页面和组件只管理偏重“显示”的状态，抽象的、可重用的、业务逻辑状态都抽离到 `EventStore` 的实例中管理。
  - 多数的时间花在页面布局、写 wxss 上，对我来说写这个项目的意义在于，实现一个页面效果，不必占用太多大脑的思考，而将思考更多放到优化方面（如状态的抽取、回调事件的防抖、节流处理等）
  - 微信要求 API 服务器的域名必须通过备案，开发时所用的 api 托管在 Vercel 上，暂时无法备案。

## 页面演示

### 1. 首页
<img src="./screenshots/1.index.gif" width="200" alt="index page">

### 2. 搜索页
<img src="./screenshots/2.detail-search.gif" width="200" alt="detail-search">

### 3. 播放页
<img src="./screenshots/3.player.gif" width="200" alt="player">

### 4. 歌单详情页
<img src="./screenshots/4.detail-playlist.gif" width="200" alt="detail-playlist">

### 5. 视频详情页
<img src="./screenshots/5.detail-mv.gif" width="200" alt="detail-mv">

## 后续参考价值

写这个项目最初是为了经历微信小程序的开发，跨过从 0 到 1 的步骤。项目的开发完结，之后如果一段时间不写小程序代码，势必手生脑慢，做这件事能为以后留下什么参考价值？

- 一个小程序的整体流程，从申请小程序、创建项目、划分页面、具体开发到打包上线。
- 进入一个新平台的开发的方式。读官方文档时心里要问三个问题：界面怎么渲染的？JS 代码逻辑怎么处理？应用（页面/组件）的生命周期是什么？小程序的开发方式和 Vue 类似，写template、绑定数据、写页面初始化事件及用户交互事件。
- 处理细节中的魔鬼。一些显示效果的实现需要在很细节的层面上有把握，在本项目，有这些交互可留待后面思考：
  - 页面内设置了整体的左右 padding，但有一个左右滚动的 `scroll-view`，滚动区域要超过padding部分，要怎么做？
  - 歌词匹配怎么做？（要用一个算法）
  - 怎么获取元素实际的宽度/高度？（在组件渲染完毕后的生命周期内获取）
  - 一些节省性能的措施？（滚动监听的回调做节流，搜索栏的change事件回调做防抖等）

没有处理好的地方是引入了 Typescript，在提前使用后端返回的数据时，要保证 `tsc` 不报因为类型不同无法赋值的问题，就得给每种 api 接口数据定好 interface，这会花费更多时间，开发过程中我将它当作 js 使用，遇到编译不过的情况就设 any，这样用 Typescript 不好，下次选它会更谨慎一点。

此外，由于请求数据有延迟，有些页面初次加载时有1-3秒的空白，合适的做法是给这些页面加上骨架屏。