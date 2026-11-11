# Translating DisplayDeck / DisplayDeck の翻訳

DisplayDeck's screen text lives in plain JSON files. You can add a language just by placing a file — no build needed
(DisplayDeck 0.9.5 or later).
DisplayDeck の画面の文字は、ただの JSON ファイルです。ファイルを置くだけで言語を増やせます（ビルドは要りません。DisplayDeck 0.9.5 以降）。

DisplayDeck 0.9.5 ships with Japanese, English, Simplified Chinese, Traditional Chinese, Korean, Spanish, French, German,
Italian, Portuguese (Brazil) and Russian. The languages other than Japanese and English are machine translations —
corrections are very welcome.
0.9.5 には日本語・英語のほか、簡体字中国語・繁体字中国語・韓国語・スペイン語・フランス語・ドイツ語・イタリア語・
ポルトガル語（ブラジル）・ロシア語が入っています。日本語と英語以外は機械翻訳なので、直してもらえると助かります。

## How it works / しくみ

- `en.json` in this folder is the template. Each key is the original Japanese text, each value is the English text.
  このフォルダーの `en.json` がひな形です。キーが元の日本語、値が英語です。
- Copy it to `<language code>.json` (for example `ko.json`, `zh-CN.json`, `pt-BR.json`) and replace the **values** with your language.
  Keep the keys exactly as they are.
  `<言語コード>.json` という名前で写し、**値**だけを訳してください。キーは変えないでください。
- Items you leave untranslated (or delete) are shown in English, so a partial translation works too.
  訳していない項目（消した項目）は英語で出るので、途中までの翻訳でも使えます。
- Keep `{0}`, `{1}` … placeholders in your translation (their order may change). `\n` is a line break.
  `{0}` `{1}` などはそのまま残してください（順番は入れ替えてよい）。`\n` は改行です。

The first keys describe the file / 先頭の情報用のキー:

```json
{
  "_name": "한국어",
  "_font": "Malgun Gothic",
  "_author": "Your name",
  ...
}
```

- `_name` — shown in the language list / 言語の一覧に出す名前
- `_font` — a font that comes with Windows and covers your script (Segoe UI if omitted).
  Windows に入っている、その言語の文字を含む字体（省略時は Segoe UI）。
  Examples: `Microsoft YaHei UI` (Simplified Chinese), `Microsoft JhengHei UI` (Traditional Chinese), `Malgun Gothic` (Korean), `Segoe UI` (Latin / Cyrillic)
- `_author` — optional, your name / 任意。訳した人の名前

## Trying it / 試し方

1. Put the file in `%APPDATA%\DisplayDeck\lang\` (or `lang\` next to the app folder in portable mode). Files there survive app updates.
   `%APPDATA%\DisplayDeck\lang\` に置きます（ポータブルで使っている場合はアプリのフォルダーの `lang\`）。ここに置いたものはアプリを更新しても消えません。
2. Settings → Other settings → "Usage, language and more" → choose your language → restart DisplayDeck.
   設定 →「その他の設定」→「使用枠・言語・その他」で言語を選び、DisplayDeck を起動し直します。

The touch screen shrinks text that does not fit, but please keep labels short (button and tile labels are small).
タッチ画面は入りきらない文字を縮めて出しますが、ボタンやタイルの文字はなるべく短くしてください。

## Sharing your translation / 訳を送ってくれる場合

Open an issue or a pull request with your file in this repository. Translations that are sent here may be bundled with
future versions of DisplayDeck, with your name credited if you wish.
このリポジトリに issue か pull request で送ってください。送られた訳は、今後の版に同梱することがあります（希望があれば名前を載せます）。

Translation files in this folder are licensed under the MIT License (see `LICENSE` in this folder). By sending a translation,
you agree that it is published under the same license.
このフォルダーの言語ファイルは MIT ライセンスです（このフォルダーの `LICENSE`）。訳を送ってくれた場合も、同じライセンスで公開することに同意したものとします。
