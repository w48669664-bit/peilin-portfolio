# 素材说明

- 水面：本项目通过 Image Gen 原创生成浅水、卵石和光影底图，1536×1024，WebP；实时折射与波纹由 Three.js 着色器生成。未使用参考录屏截图作为页面背景。
- 音乐：本项目原创程序合成的三段 64 秒环境声景。生成脚本为 `scripts/create-soundscapes.py`，使用确定性合成、和声与延迟，无第三方歌曲采样。默认不自动播放。
- 交互音效：水面采用真实水花与拨水录音，出处、作者、CC0 许可和处理方式见 [WATER_AUDIO.md](WATER_AUDIO.md)。时间轮以 Web Audio 合成短促机械表卡点音；两者共用交互音效开关。
- 简历、照片、学校/公司标识、六个项目的 18 张实际截图和演示视频：来自用户既有个人作品集，由用户授权迁移到新站。个人内容继承旧站版本 32f350c。
- 字体：[Noto Sans SC](https://github.com/google/fonts/tree/main/ofl/notosanssc) 与 [Manrope](https://github.com/google/fonts/tree/main/ofl/manrope)，来自 Google Fonts 官方仓库，均使用 SIL Open Font License。按网站文字做 WOFF2 子集并本地加载，许可随文件置于 public/assets/fonts。
- 控件图标：Phosphor Icons（MIT）。
- 参考录屏：仅用于交互和视觉研究，保留本地文档参考，不发布原录屏或参考截图。
