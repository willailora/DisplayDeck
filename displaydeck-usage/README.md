# displaydeck-usage

A tiny Claude Code mod that lets [DisplayDeck](https://github.com/willailora/DisplayDeck) show your Claude usage
(5-hour and weekly limits) — also while you work in the Claude desktop app's Code tab.

Claude Code 用の小さな mod です。DisplayDeck のタッチ画面に、Claude の使用量（5時間・週間）を出せるようにします。
デスクトップアプリの Code タブで作業している間も届きます。

## What it does / していること

After each reply, Claude Code already knows your rate-limit windows (the same `five_hour` / `seven_day` figures its
status line gets). This mod copies them to a small file that DisplayDeck reads:

`%USERPROFILE%\.displaydeck\claude-usage.json`

- No network requests, no tokens used, no extra prompts.
- It never reads your sign-in data (OAuth tokens or cookies). It only uses the official mod API (`session.measure`,
  `$.session.usage()`).

返事のたびに Claude Code が持っている使用枠（ステータスラインと同じ値）を、DisplayDeck が読む上のファイルに書き写すだけです。
通信・トークンの消費・ログイン情報の読み取りはしません（公式の mod の仕組みだけを使います）。

## Install / 入れ方

In a terminal Claude Code session / ターミナル版の Claude Code で:

```
/plugin install displaydeck-usage --marketplace willailora/DisplayDeck
```

From a shell / コマンドから:

```
claude plugin install displaydeck-usage --marketplace willailora/DisplayDeck
```

In the desktop app / デスクトップアプリでは: click **+** next to the prompt box → **Plugins** → **Add marketplace**
with `willailora/DisplayDeck` → **Add plugin** (displaydeck-usage).

Choose the **user** scope so it works in every project. A mod installed this way also runs in the desktop app's Code tab.
入れる範囲は **user**（すべてのプロジェクト）を選んでください。

## Accuracy / 正確さ

The figures are what Claude Code received with its latest reply. They can differ from the Claude app's usage screen by
about 1%, and can lag behind depending on how you use Claude (they stay as they are until the next reply; the remaining
percentage is rounded down).

表示は、Claude Code が最後の返事で受け取った値です。Claude のアプリの使用量の画面と比べて1%前後ずれることや、
使い方によっては反映が遅れることがあります（次の返事が来るまで前の値のままです。残りは小数点以下を切り捨てて出します）。

Mods are an early-access feature of Claude Code, so a future Claude Code update may require an update of this mod.

## License

MIT (this folder only). DisplayDeck itself is distributed separately and is not open source.
