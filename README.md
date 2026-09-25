# Peilin · Stillwater

谢沛霖的沉浸式个人作品集。以可交互水面、昼夜光影与环境音乐为入口，连接完整简历和六个实际项目。

线上地址：[Peilin Stillwater](https://w48669664-bit.github.io/peilin-stillwater/)

## 本地开发

```sh
npm ci
npm run dev
```

## 发布

GitHub Actions 自动构建并发布 `dist/client` 到 GitHub Pages。哈希路由支持项目详情直接分享，资源使用相对路径，兼容独立仓库子路径。

```sh
npm run build
npm run test:sites
```

## 内容维护

- `src/content.js`：个人信息、实习、技能、奖项和项目资料。
- `src/Resume.jsx`：教育背景与完整简历展示。
- `public/projects`：项目真实截图，每个项目三张。
- `public/Peilin-Xie-Resume.pdf`：下载简历。
- `docs/PRD.md`：产品需求文档。
- `docs/ASSETS.md`：素材来源。
- `docs/OPTIMIZATIONS.md`：20 项体验优化及验收状态。
- `design-qa.md`：验收记录。

## 功能

- Three.js 水面折射、多层波纹和连续拖动尾迹；点击播放具有左右空间感的合成水声，不支持 WebGL 时显示静态水面。
- 本地时间、机械时轮、四个光影预设；拖动、滚轮、键盘和直接输入均可调时，带机械卡点声音，可随时回到当前时间。
- 三首原创合成环境音乐，默认静音，播放/暂停、切歌与音量控制；页面隐藏时暂停。
- 首页个人定位与可切换精选作品；关于我、经历与成长、我的方法、联系我、完整简历。
- 作品分类、六个项目详情、每项目三张截图；箭头/圆点/键盘/触摸翻页、大图预览和相邻项目导航。
- 打开内容或时间面板时暂停环境音乐，返回首页需手动继续，避免影响阅读和演示视频。
- 手机及横屏布局、键盘焦点约束与恢复、Esc 关闭、系统及手动减少动效；交互音效偏好保存在本地。

独立于旧站点 https://w48669664-bit.github.io/ ，不会覆盖旧站内容。
