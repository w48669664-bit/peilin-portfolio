# 水面真实录音与授权

新版水面使用真实录音文件，已移除上一版水滴振荡器和随机噪声合成。音频由本站本地托管，不依赖运行时第三方音频服务。

## 来源与许可

三个原作页面均明确标注 [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)。该许可允许复制、修改、分发和商业使用。这里保留作者和来源作为素材溯源，不表示作者为本网站背书。

| 本地文件 | 原作、作者 | 实际录音说明 | 原作页面 | 实际下载地址 |
| --- | --- | --- | --- | --- |
| `public/assets/audio/water/hand-splash.mp3` | *Splash* — swordofkings128 | 作者说明使用 Sony IC Recorder 录制，并称可能是用手拍泳池水面；作者对具体动作并不确定。 | [Freesound 398032](https://freesound.org/people/swordofkings128/sounds/398032/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/398/398032_7586736-hq.mp3) |
| `public/assets/audio/water/small-splash.mp3` | *Water splash* — nilbul | 中等石块入水的户外录音，Sony PCM M10 与 AT897 麦克风采集。 | [Freesound 404829](https://freesound.org/people/nilbul/sounds/404829/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/404/404829_262959-hq.mp3) |
| `public/assets/audio/water/water-swish.mp3` | *Water Swish* — dslrguide | 在大碗水中快速拨动笔的录音，Rode VideoMic Pro 与 Zoom H5 采集。 | [Freesound 321489](https://freesound.org/people/dslrguide/sounds/321489/) | [官方公开 HQ MP3 预览](https://cdn.freesound.org/previews/321/321489_5485024-hq.mp3) |

下载的是原作页面直接提供的公开高质量 MP3 预览，不是需要登录下载的 WAV 原文件。保存文件与上述 CDN 响应的字节完全一致；没有二次有损编码、AI 生成、合成水滴或变调；持续绘水时在运行时交叉淡入淡出播放原录音片段，不修改保存的素材文件。

## 播放处理

- 页面初始化只预取约 65.6 KB 的本地文件。`prepare()` 在触摸开始时准备解码并尝试恢复已解锁的 Web Audio；它不播放录音。首次轻点在 `touchend` 中调用 `drop()` 解锁声音。Safari 可能要求完成一次轻点后才允许后续长按发声，不绕过浏览器自动播放限制。iOS 的 `suspended` 和 `interrupted` 状态都能由下一次真实交互恢复。
- `drop(x)` 播放自然水花，两个真实水花交替选择；点击间隔至少 170 ms，点击声音最多 3 个，全部水声最多 6 个，为持续绘水保留声音通道。保持原速、原音高和立体声，重叠点击降低新声音增益以保留峰值余量。
- `startTrail(x, strength = 0.15)` 开始一段受按压动作控制的持续水流。录音尚未下载完成时保留请求，在用户仍按着时完成启动；不再要求最低拖动速度、点击后 950 ms 等待或点击声完全结束。
- `trail(x, strength)` 只更新已经开始的水流，不会由悬停自行解锁声音或开启播放。速度越慢声音越轻；`strength = 0` 保留低音量水声，短时间静止按住仍有反馈。左右声像和音量经过平滑过渡。
- 持续水流使用 *Water Swish* 真实录音中约 0.64–0.70 秒片段，约 0.22 秒交叉淡入淡出衔接。片段起点有少量变化，保留录音原速、原音高，无电子噪声或振荡器。小范围预排程使接缝不依赖每一次指针移动事件；没有脱离按压状态的无限后台播放。
- `endTrail()` 取消等待下载或解码的绘水启动，以及尚未开始的点击声；已经播放的连续水流在约 120 ms 内淡出，并移除后续排程。抬起之后即使文件才加载完成，也不会突然补播。
- 若触摸点击声在 `touchend` 才触发，调用顺序应为 `endTrail()` 然后 `drop(x)`；由鼠标按下产生的点击声可自然结束。
- 静音、页面进入后台、音频上下文中断、`suspend()` 和 `dispose()` 会取消异步启动并清理所有声音和排程。返回前台或重新开启声音不会自动恢复上一次已经结束的手势。
- 文件下载或解码失败时保持安静，绝不退回电子水滴合成。不支持 Web Audio 的浏览器继续使用无声水面。

### 接入 API

| 方法 | 用途 |
| --- | --- |
| `prepare()` | 触摸开始时无声准备；首次触摸结束或鼠标按下时可解锁，返回可等待的 Promise |
| `drop(x = 0.5)` | 一次自然水花点击声，`x` 为 0–1 横向位置 |
| `startTrail(x = 0.5, strength = 0.15)` | 一次按压绘水手势开始，可解锁；重复调用更新已有流 |
| `trail(x = 0.5, strength = 0.15)` | 更新已开始流的横向位置与 0–1 强度；不启动新流 |
| `endTrail()` | 松开、取消手势时调用；取消异步待播并淡出持续水流 |
| `setEnabled(boolean)` | 统一音效开关；关闭立即取消和清理 |
| `suspend()` | 停止全部声音/排程并暂停 AudioContext |
| `dispose()` | 移除监听、停止音源、取消请求并关闭 AudioContext |

## 实际检查

已使用 FFmpeg 解码为浮点 PCM，检查解码时长、采样率、声道、均方根响度、峰值和达到数字满幅的采样数，并查看双声道波形。下面为源 MP3 解码后的测量结果，未叠加页面音量包络。

| 文件 | 解码后时长 | 采样率 | 声道 | 文件大小 | 峰值 | RMS | 满幅采样数 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| hand-splash.mp3 | 1.331293 s | 44,100 Hz | 2 | 28,123 B | −0.25 dBFS | −26.73 dBFS | 0 |
| small-splash.mp3 | 0.865442 s | 44,100 Hz | 2 | 18,210 B | −0.15 dBFS | −26.64 dBFS | 0 |
| water-swish.mp3 | 0.875000 s | 48,000 Hz | 2 | 19,272 B | −2.54 dBFS | −32.18 dBFS | 0 |

MP3 容器时长分别为 1.358367 / 0.914286 / 0.912000 秒；与解码后的长度差异来自 MP3 编码延迟和补齐。波形具有不规则瞬态与衰减，没有重复的合成正弦波形。未检测到源文件数字削波。

新增 `tests/water-audio.test.mjs`，通过 10 个使用模拟 AudioContext 与时间推进的行为测试：静默预加载/prepare、慢拖和短暂静止时持续录音流、交叉淡入淡出无排程缺口、首触延迟加载、松开前异步取消、松开淡出、静音、后台停止、iOS interrupted 恢复、快速点击下的音源上限、素材失败静默降级及卸载。测试指令：`node --test tests/water-audio.test.mjs`。物理扬声器或耳机上的主观听感未由本次自动检查验证；测量结果不能替代人工听音。

## SHA-256

```text
hand-splash.mp3   76551fa32cc72ec86f01b6385008ad27993a05036eae75d1d7a662c3f7445324
small-splash.mp3  061f490d945996e5b5c43400e76b0997e53e9338efbf7148c866d092cf45bf18
water-swish.mp3   29f0d61d180a69f921395c5dc8ef3715e8228cb5dd5dcd616ece7416eea6327c
```

移动手势遵守浏览器原生滚动与用户激活规则，参见 [WebKit 用户激活说明](https://webkit.org/blog/13862/the-user-activation-api/)。首次进入建议先轻点水面，再长按空白水面拖动。
