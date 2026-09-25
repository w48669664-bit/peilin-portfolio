# Peilin · Stillwater

谢沛霖的沉浸式个人作品集。以可交互水面、昼夜光影与环境音乐为入口，连接完整简历和六个实际项目。

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
- `design-qa.md`：验收记录。

## 功能

- Three.js 水面折射、指针/触摸波纹；不支持 WebGL 时显示静态水面。
- 本地时间、四个光影预设和连续时间刻度；可随时回到当前时间。
- 三首原创合成环境音乐，默认静音，播放/暂停、切歌与音量控制；页面隐藏时暂停。
- 关于我、完整简历、作品目录、项目详情和大图预览。
- 每项目三张截图，箭头/圆点/键盘/触摸翻页；内嵌项目视频播放时暂停环境音乐。
- 手机布局、键盘焦点约束、Esc 关闭与减少动效。

独立于旧站点 https://w48669664-bit.github.io/ ，不会覆盖旧站内容。
