# DisplayDeck

Free Windows app that turns a touch monitor into a panel of buttons and PC stats.
Taps never move your mouse cursor or steal focus from the window you are working in.

タッチモニターを、ボタンと PC 情報のパネルにする Windows の無料アプリです。

The app itself is distributed on the download pages below (it is not open source).
アプリはダウンロードページから配布しています（ソースは公開していません）。

- itch.io: https://willlive.itch.io/displaydeck
- BOOTH: https://ailorawill.booth.pm/items/9117668
- Ko-fi: https://ko-fi.com/s/f547e14904

## What is in this repository / このリポジトリにあるもの

- `version.json` — read by DisplayDeck once at startup to tell you about a new version (can be turned off in "About DisplayDeck").
  更新の知らせに使うファイル（「このアプリについて」でオフにできます）。
- `displaydeck-usage/` — a small Claude Code mod (MIT) that hands your Claude usage (5-hour / weekly) to DisplayDeck,
  also while you use the Claude desktop app. See [displaydeck-usage/README.md](displaydeck-usage/README.md).
  Claude の使用量を DisplayDeck に渡す、Claude Code 用の小さな mod（MIT ライセンス）。
- `lang/` — the screen-text template (`en.json`) and how to add your own language. See [lang/README.md](lang/README.md).
  画面の文字のひな形と、言語の増やし方（MIT ライセンス）。

Install the mod in a terminal Claude Code session / mod の入れ方（ターミナル版の Claude Code で）:

```
/plugin install displaydeck-usage --marketplace willailora/DisplayDeck
```

It works in sessions opened after you install it; close and reopen sessions that were already open.
入れたあとに開いたセッションで動きます。開いていたセッションは一度閉じて開き直してください。
