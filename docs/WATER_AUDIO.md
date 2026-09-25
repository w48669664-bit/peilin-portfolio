# 水面真实录音与授权

新版水面使用真实录音文件，已移除上一版水滴振荡器和随机噪声合成。音频由本站本地托管，不依赖运行时第三方音频服务。

## 来源与许可

三个原作页面均明确标注 [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)。该许可允许复制、修改、分发和商业使用。这里保留作者和来源作为素材溯源，不表示作者为本网站背书。

| 本地文件 | 原作、作者 | 实际录音说明 | 原作页面 | 实际下载地址 |
| --- | --- | --- | --- | --- |
| `public/assets/audio/water/hand-splash.mp3` | *Splash* — swordofkings128 | 作者说明使用 Sony IC Recorder 录制，并称可能是用手拍泳池水面；作者对具体动作并不确定。 | [Freesound 398032](https://freesound.org/people/swordofkings128/sounds/398032/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/398/398032_7586736-hq.mp3) |
| `public/assets/audio/water/small-splash.mp3` | *Water splash* — nilbul | 中等石块入水的户外录音，Sony PCM M10 与 AT897 麦克风采集。 | [Freesound 404829](https://freesound.org/people/nilbul/sounds/404829/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/404/404829_262959-hq.mp3) |
| `public/assets/audio/water/water-swish.mp3` | *Water Swish* — dslrguide | 在大碗水中快速拨动笔的录音，Rode VideoMic Pro 与 Zoom H5 采集。 | [Freesound 321489](https://freesound.org/people/dslrguide/sounds/321489/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/321/321489_5485024-hq.mp3) |

下载的是原作页面直接提供的公开高质量 MP3 预览，不是需要登录下载的 WAV 原文件。保存文件与上述 CDN 响应的字节完全一致；没有二次有损编码、AI 生成、合成水滴、变调或循环拼接。

## 播放处理

- 页面初始化只预取约 65.6 KB 的本地文件；首次点击水面才创建、解锁 Web Audio 上下文并发声。首击发生在文件尚未下载完成时，会保留这次请求并在解码完成后播放；静音、新的点击请求、后台暂停或卸载会取消待播请求。
- 点击交替使用两个不同的自然水花录音；点击间隔至少 170 ms，同时最多 4 个声音。录音保持原速、原音高和立体声。连续点击出现重叠时降低新声音增益，保留数字峰值余量。
- 手拍水花跳过最前面的 35 ms，拨水跳过前 95 ms；不改变主要水花及自然尾音。运行时施加 8 ms 渐入、末尾 100 ms 渐出，避免截断爆音。
- 点击水花分别以 0.55 / 0.48 的样本增益和 0.65 总增益播放；单声音的处理后峰值约为 −9.2 / −10.3 dBFS。
- 指针快速移动时才可能播放轻微拨水，间隔至少 1 秒；点击后 950 ms 内以及还有其他水声时不叠加拨水。该声音比点击声更轻，不会形成密集节拍。
- 位置控制左右声像。静音开关、后台暂停、卸载清理和不支持 Web Audio 时的静默降级保持有效。
- 文件下载或解码失败时保持安静，绝不退回电子水滴合成。

## 实际检查

已使用 FFmpeg 解码为浮点 PCM，检查解码时长、采样率、声道、均方根响度、峰值和达到数字满幅的采样数，并查看双声道波形。下面为源 MP3 解码后的测量结果，未叠加页面音量包络。

| 文件 | 解码后时长 | 采样率 | 声道 | 文件大小 | 峰值 | RMS | 满幅采样数 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| hand-splash.mp3 | 1.331293 s | 44,100 Hz | 2 | 28,123 B | −0.25 dBFS | −26.73 dBFS | 0 |
| small-splash.mp3 | 0.865442 s | 44,100 Hz | 2 | 18,210 B | −0.15 dBFS | −26.64 dBFS | 0 |
| water-swish.mp3 | 0.875000 s | 48,000 Hz | 2 | 19,272 B | −2.54 dBFS | −32.18 dBFS | 0 |

MP3 容器时长分别为 1.358367 / 0.914286 / 0.912000 秒；与解码后的长度差异来自 MP3 编码延迟和补齐。波形具有不规则瞬态与衰减，没有重复的合成正弦波形。未检测到源文件数字削波。

已验证播放逻辑的静默预加载、首次点击解锁、原音高、左右声像、点击/轨迹限频、静音、异步取消、暂停恢复和卸载行为。物理扬声器或耳机上的主观听感未由本次自动检查验证；测量结果不能替代人工听音。

## SHA-256

```text
hand-splash.mp3   76551fa32cc72ec86f01b6385008ad27993a05036eae75d1d7a662c3f7445324
small-splash.mp3  061f490d945996e5b5c43400e76b0997e53e9338efbf7148c866d092cf45bf18
water-swish.mp3   29f0d61d180a69f921395c5dc8ef3715e8228cb5dd5dcd616ece7416eea6327c
```
