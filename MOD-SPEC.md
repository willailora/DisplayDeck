# DisplayDeck MOD 仕様書 / DisplayDeck MOD Specification

MOD を作る人向けの仕様です。DisplayDeck 1.6.0 のコードで確かめた内容です（当てはまる版は最後の節）。
This is the specification for people who make MODs. It was checked against the DisplayDeck 1.6.0 code (see the last section for versions).

- [日本語](#日本語)
- [English](#english)

---

## 日本語

### 1. MOD とは

MOD は、DisplayDeck とは別に配る小さなプログラムです。利用者が mods フォルダーに入れ、設定画面で「この MOD を確かめて使う」を押したものだけが動きます。

種類は 2 つです。

| 種類（`kind`） | 使われる所 | いつ動くか |
|---|---|---|
| `tile` | タイル。設定画面でタイルの種類を「MOD（追加の機能）」にして選ぶ。結果をタイルに出す（長押しの動作にしたときは、画面の下の知らせに出す） | タイルを押したとき |
| `weather` | 天気の取り先。「その他の設定…」→「時計・予定・OBS」→「天気」の「取り先」で選ぶ。時計のカードの天気の行・天気のタイル・天気の部品に出る | 決めた間隔ごと |

天気の MOD を取り先にしている間は、気象庁の警報・注意報は出ません。

### 2. フォルダーの形と置き場所

```
mods\
  my-mod\          ← フォルダーの名前は何でもよい（MOD を見分けるのは mod.json の id）
    mod.json       ← このフォルダーの直下に置く
    my-mod.ps1     ← mod.json の command に書いたファイル（直下）
    icon.png       ← 任意（直下）
```

| 場所 | どこか |
|---|---|
| 利用者の mods | ふつうは `%APPDATA%\DisplayDeck\mods\`。持ち運び用の設定（portable.txt）では `<DisplayDeck のフォルダー>\mods\`。設定画面の「MOD のフォルダーを開く」で開く（無ければ作る） |
| プログラムの場所の mods | `<DisplayDeck のフォルダー>\mods\`。配布用の zip に入っているダイス MOD はここ |

- 同じ id の MOD が両方にあるときは、利用者の mods のほうを使います。
- 同じ場所に同じ id の MOD が 2 つあると、片方しか読みません。id は、種類（tile・weather）が違っても重ねないでください。
- 一覧は名前の順です。設定画面を開いたまま MOD を入れたときは「一覧を更新」を押します。

**一覧に出る条件**（1 つでも外れると、知らせを出さずに一覧から外れます）

- `mods\<フォルダー>\mod.json` がある。もう 1 段深い所は読みません（zip を展開してフォルダーが 2 段になっていないか確かめてください）。
- mod.json が 64KB 以下で、JSON のオブジェクトとして読める。
- `kind`・`id`・`command` が 3 節の決まりどおりで、command のファイルがある。
- MOD のフォルダー・mod.json・command のファイルが、リンク（シンボリックリンク・ジャンクション）でない。

一覧に出ても、「確かめて使う」にはさらに次が要ります（8 節）: フォルダーの中が全部で 200 ファイル・20MB まで、サブフォルダーは 8 段まで、どこにもリンクが無い。

### 3. mod.json

- 文字コードは UTF-8（BOM はあってもなくてもよい）。
- 項目の名前は、大文字・小文字まで表のとおりに書きます。表に無い項目は読みません。
- 文字の項目に数などを書いたとき・空の文字のときは、書かなかったのと同じです。

| 項目 | 型 | 必須 | 既定 | 決まり |
|---|---|---|---|---|
| `id` | 文字 | 必須 | — | 1〜40 文字。英小文字か数字で始まり、そのあとは英小文字・数字・`_`・`-` だけ |
| `kind` | 文字 | 必須 | — | `tile` か `weather`（小文字） |
| `name` | 文字 | | id | 一覧とタイルに出る名前。40 文字で切る |
| `name_ja` | 文字 | | `name` | 画面が日本語のときの名前 |
| `version` | 文字 | | 空 | 名前の隣に出す版。20 文字で切る |
| `command` | 文字 | 必須 | — | 動かすファイルの名前。MOD のフォルダーの直下のファイルだけ（`\`・`/`・`:` を含めない。`.`・`..` も不可）。拡張子は `.ps1` か `.exe`（`.bat`・`.cmd` は不可） |
| `icon` | 文字 | | DisplayDeck の MOD のアイコン | タイルのアイコン。直下の `.png` か `.jpg`、2MB まで（4 節）。合わないときは既定のアイコン |
| `iconTint` | 真偽 | | `false` | `true` のときだけ、アイコンをテーマの色に付け替える（`.png` のアイコンだけ。4 節。1.6.1 から。1.6.1 の公開時期は未定） |
| `hosts` | 文字の配列 | | なし | 通信先。確かめる画面と設定画面に出す。1 つ 100 文字で切り、10 個まで（それより多いと「…」）。出すだけで、DisplayDeck は通信を確かめたり止めたりしない |
| `settings` | 配列 | | なし | 設定の欄（下の表） |
| `intervalMinutes` | 整数 | | `30` | 天気だけ。動かす間隔（分）。15〜360 に収める。`30.0` や `"30"` と書くと読まずに 30 |
| `credit` | 文字 | | なし | 天気だけ。出典。200 文字で切る。設定画面と「このアプリについて」に出す。`creditShort` が無ければ天気の隣にも出す |
| `credit_ja` | 文字 | | `credit` | 画面が日本語のときの出典 |
| `creditUrl` | 文字 | | なし | 天気だけ。出典のページ。`https://` で始まるものだけ使う（ほかは無視）。天気の行・天気のタイルを押すと開く |
| `creditShort` | 文字 | | `credit` | 天気だけ。天気の隣に出す短い出典。40 文字で切る |

**`settings` の各欄**

| 項目 | 型 | 必須 | 既定 | 決まり |
|---|---|---|---|---|
| `key` | 文字 | 必須 | — | 1〜30 文字の英字・数字・`_`。環境変数の名前になる（6 節）。大文字・小文字だけ違う key は 1 つ目だけ使う |
| `label` | 文字 | | key | 欄の名前。60 文字で切る |
| `label_ja` | 文字 | | `label` | 画面が日本語のときの欄の名前 |
| `default` | 文字 | | なし | 欄が空のときに渡す値。200 文字で切る |

- 使う欄は 3 つまでです（4 つ目からは無視。key が決まりに合わない欄は数えずに飛ばします）。
- 利用者が欄に入れられるのは 200 文字までです。タイルの設定では、空の欄に `default` を薄い字で出します。

**日本語の項目（`_ja`）**: `name_ja`・`label_ja`・`credit_ja` は、DisplayDeck の画面の言語が日本語のときだけ使います（無ければ `_ja` の無いほう）。ほかの言語の項目（`name_de` など）はありません。`creditShort` に `_ja` はありません。

**文字の扱い**: 画面に出す文字（name・version・credit・creditShort・hosts・label）は、制御文字（改行など）を空白にし、前後の空白を取ってから長さを切ります。`default` は制御文字を空白にするだけです。

### 4. アイコン（ボタンの画像）

#### 今の決まり

- 使うのはタイルの MOD だけです（天気の MOD の `icon` は使いません）。
- `icon` には MOD のフォルダーの直下のファイルの名前を書きます。`.png` か `.jpg`（`.jpeg` は不可）、2MB まで、リンクは不可です。書かないとき・合わないときは、DisplayDeck の MOD のアイコンを出します。
- 正方形の絵として描きます（正方形でない絵は正方形に引き伸ばされます）。同梱のアイコンと同じ、384×384・透明の地の PNG がおすすめです。
- 大きさはタイルの大きさと「アイコンの大きさ」の設定で決まります。名前はふつうアイコンの下です（設定で重ねる・出さないもできます）。
- 一度押すと、アイコンの所に結果を出します（7 節）。
- 利用者はタイルごとにアイコンを別の画像に替えられます。MOD のタイルでは「アイコンの出し方」の「タイルいっぱい」は使えません。
- テーマの色（「背景・テーマ…」の「アイコンの色」と、タイルごとの「アイコンの色」）に付け替わるのは、mod.json に `"iconTint": true` と書いた MOD の `.png` のアイコンだけです（1.6.1 から。1.6.1 の公開時期は未定で、今の版では元の色のまま。下の「テーマの色に付け替わるアイコンの作り方」）。書かないとき・`.jpg` のときは、元の色のまま出ます。
  - `icon` を書かない MOD が出す既定のアイコンは DisplayDeck の同梱のアイコンなので、こちらはいつも付け替わります。

#### テーマの色に付け替わるアイコンの作り方

mod.json に `"iconTint": true` を書くと、そのアイコンを同梱のアイコンと同じように付け替えます（DisplayDeck 1.6.1 から。1.6.1 の公開時期は未定です。今の版はこの項目を読み飛ばすので、先に書いておいても害はありません）。付け替えるのは、`icon` が `.png` で、利用者が「この MOD を確かめて使う」を押した MOD だけです。下は、その付け替えの決まり（コードにあるもの）です。見本は同梱のダイス MOD（1.1.0 から `iconTint` を使っています）。

**付け替えのしくみ**

1. アイコンの縁の少し内側の帯（下の表）から、「板の色」（色合い・鮮やかさ・明るさ）を拾います。
2. 板の色合いに近く、鮮やかな画素だけを、テーマの色合いに塗り替えます。白・灰色・黒の所と、板と違う色合いの所はそのままです。
3. 塗り替えた板の明るさと鮮やかさは、決まった幅にそろえます（平均の輝度を 48〜92（0〜255 のうち）、鮮やかさの平均を 0.62。利用者がタイルごとに色を選んだときは鮮やかさ 0.12〜0.95・輝度 40〜120）。画素ごとの明るさの違い（グラデーション・陰影）は、比で残ります。
4. 「単色（灰色）」のときは、板の画素を灰色にします。
5. 付け替えは、絵を 64〜384px の正方形にしてから行います（384px より大きく作っても細かくはなりません）。

**板の色を拾う帯**（絵の幅・高さに対する割合）

| 帯 | 縦の範囲 | 横の範囲 |
|---|---|---|
| 上 | 6〜11% | 20〜80% |
| 下 | 92〜95% | 20〜80% |
| 左 | 20〜80% | 6〜11% |
| 右 | 20〜80% | 89〜94% |

- 数えるのは不透明な画素（アルファ 200 以上）だけです。白に近い画素（明るさ 0.9 より上で鮮やかさ 0.12 未満）は数えません。
- 数えた画素が 20 より少ないと、付け替えません。

**作り方**

- 384×384 の PNG、地は透明にします。
- 角丸の色付きの板を、絵のほぼ全体に敷きます。同梱のアイコンは、縁から 14px の所に 356×356・角の丸み 64px の板、縁取りは 3px（板と同じ色合いの明るい色）です。
- 板は 1 色か、同じ系統の 2 色のグラデーションにします（同梱のアイコンは斜め 45° のグラデーション）。灰色の板でもかまいません。
- 上の表の 4 つの帯は、板の色だけにします。記号・文字・ほかの色をそこに描かないでください（そこで板の色を拾うため）。
- 記号は白にします（同梱のアイコンは RGB 240, 246, 255）。白・灰色・黒は付け替わりません。
- 意味のある色（閉じるの赤など）は、板と違う色合いにすると残ります。板の色合いからおよそ 30° 以上離れた色は塗り替えません（色合いは 10° ずつの区切りで比べます）。確実に残すには 40° 以上離してください。鮮やかさが低い色（0.04 以下）も塗り替えません。
- 灰色の板のときは、板と同じくらいの鮮やかさで、板より明るすぎない所が塗り替わります。白い記号は残ります。
- キー名などの帯を入れるときは、下の帯（92〜95%）より上に置きます（同梱のアイコンは 300〜346px）。

### 5. 動かし方

| | `.ps1` | `.exe` |
|---|---|---|
| 起動のしかた | `%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<.ps1 のフルパス>"`（Windows PowerShell 5.1。PowerShell 7 の pwsh ではない） | そのファイルをそのまま起動 |
| 引数 | なし | なし |

- 窓を出さない指定で起動します（シェルは通しません）。自分で窓を開くプログラムは窓が出ます。
- 作業フォルダーは決めていません（DisplayDeck を起動したときのフォルダーのままで、MOD のフォルダーとは限りません）。自分のファイルは、スクリプトの場所（`$PSScriptRoot`）や exe の場所から開いてください。
- 標準入力には何も渡しません。標準エラー出力は読み捨てます（画面にもログにも出ません）。
- 実行ポリシーは Bypass なので、.ps1 に署名は要りません。
- .ps1 に日本語などを書くときは、BOM 付きの UTF-8 で保存してください（Windows PowerShell 5.1 は BOM の無い UTF-8 を読み違えます）。
- 打ち切り: タイルは 15 秒、天気は 20 秒。過ぎたら、MOD が起動した子プロセスごと止めます。
- MOD のプロセスが終わると、そのとき残っている子プロセスも止めます（裏で動き続けるものは作れません）。

**いつ動くか**

- タイル: 押したとき（長押しの動作にしたときは長押しで）と、設定画面の「今すぐ試す」。
  - 動いている間に同じタイルを押しても受け付けません。
  - 同じ MOD のタイルを 2 枚置いたときや「今すぐ試す」とは、同時に動くことがあります。
- 天気: 「天気を時計の下に出す」・天気のタイル・天気の部品のどれかを使っていて、取り先にこの MOD を選んでいるときだけ動きます。
  - DisplayDeck を起動したときと、取り先・天気の MOD の設定を変えたときにすぐ動きます。うまくいったら、そのあとは `intervalMinutes` ごとです。
  - 失敗したら 5 分後にもう一度。MOD が見つからない・まだ確かめていないときは、30 秒ごとに見直します。
  - 天気の MOD は 1 つずつ動きます。「その他の設定」の「試しに読む」とは同時に動くことがあります。
- 動かすたびに mod.json を読み直し、確かめた印（8 節）も見直します。

### 6. 環境変数

| 名前 | 中身 | 例 |
|---|---|---|
| `DISPLAYDECK_SETTING_<KEY>` | 設定の欄の値。`<KEY>` は settings の key を大文字にしたもの。利用者の値が空なら `default`、それも無ければ空の文字。宣言した欄の分は必ず作る。制御文字は空白にし、200 文字まで。前後の空白は消さない | key が `place` なら `DISPLAYDECK_SETTING_PLACE` |
| `DISPLAYDECK_LANG` | DisplayDeck の画面の言語のコード。`ja`・`en`・同梱の言語（`zh-CN`・`zh-TW`・`ko`・`es`・`fr`・`de`・`it`・`pt-BR`・`ru`）か、利用者が足した言語ファイルのコード | `ja`、`pt-BR` |
| `DISPLAYDECK_USER_AGENT` | 通信するときに使える User-Agent | `DisplayDeck/1.6.0 (+https://github.com/willailora/DisplayDeck)` |
| `DISPLAYDECK_MOD_DATA` | MOD が書き込みに使ってよいフォルダー。`<設定のフォルダー>\data\mods\<id>`（ふつうは `%APPDATA%\DisplayDeck\data\mods\<id>`、持ち運び用の設定では `<DisplayDeck のフォルダー>\data\mods\<id>`）。動かす前に作る | `…\DisplayDeck\data\mods\counter` |

- このほか、DisplayDeck が受け継いだふつうの環境変数（`PATH` など）は、そのまま引き継がれます。
- 設定の値は、タイルの MOD ではタイルごとです（2 枚置けば別々の値）。天気の MOD の値は、天気の MOD すべてで 1 つの表（key ごと）に保存するので、同じ key を使う天気の MOD どうしは値を分け合います。
- 値の前後の空白は消さないので、要るなら MOD の側で取り除いてください。言語は `-` の前（`pt-BR` なら `pt`）で見ると扱いやすくなります。

### 7. 出力

- 標準出力に、JSON のオブジェクトを 1 つ書きます。
- 文字コードは UTF-8 にします（BOM はあってもよい）。UTF-8 として読めないときは、Windows の OEM のコードページ（日本語の Windows なら Shift_JIS）として読みます。
- 読むのは先頭の 4,000 文字までです（約 16KB で読むのをやめます）。長すぎると JSON が途中で切れて読めません。
- 前後の空白を取ってから、最初の `{` から最後の `}` までを JSON として読みます。JSON のほかには何も書かないでください。
- 項目の名前は小文字で、表のとおりに書きます。

**タイル**

| 項目 | 型 | 省けるか | 意味 |
|---|---|---|---|
| `text` | 文字 | `text` か `sub` のどちらかは要る | タイルに大きく出す結果。24 文字で切る。短いほど大きく出る（4 文字まで・8 文字まで・それより長い、の 3 段） |
| `sub` | 文字 | 〃 | 下に小さく出す補足。80 文字で切る。タイルの名前と同じなら出さない |
| `error` | 文字か null | 省ける | うまくいかなかったときの短い説明。空でない文字なら、ほかの項目は見ずにこれを出す。120 文字で切る |

- `text`・`sub` は文字で書きます（数の `57` は読みません。`"57"` と書きます）。
- 出し方: 上に名前を小さく、真ん中に `text`、下に `sub`。動いている間は前の結果を薄く出します（まだ結果が無ければ「実行しています…」）。高さの低いタイルでは `text` だけです。長押しの動作にしたときは、画面の下の知らせに `text` と `sub` を並べて出します。
- 結果は DisplayDeck が覚えておくだけで、保存しません。DisplayDeck を起動し直したときや設定を変えたときは、アイコンと名前の表示に戻ります。

**天気**

| 項目 | 型 | 省けるか | 意味 |
|---|---|---|---|
| `area` | 文字 | 省ける | 地域の名前。40 文字で切る |
| `weather` | 文字 | ※ | 天気の文（例「くもり」）。40 文字で切る |
| `icon` | 文字 | 省ける | 天気のアイコン。`sun`・`partly`（晴れ時々くもり）・`cloud`・`rain`・`snow`・`thunder`・`fog` のどれか（小文字）。ほかの値・空はアイコンなし |
| `max` | 数 | ※ | 最高気温（℃）。整数に丸める |
| `min` | 数 | ※ | 最低気温（℃）。整数に丸める |
| `pop` | 数 | 省ける | 降水確率（%）。整数に丸める。無ければ「—」 |
| `now` | 数 | 省ける | 今の気温（℃）。小数 1 桁に丸める。-70〜70 の外は出さない |
| `tomorrow` | 真偽 | 省ける | `true` なら明日の予報として「明日」を付ける（真偽の `true` のときだけ） |
| `error` | 文字か null | 省ける | タイルと同じ |

※ `weather`・`max`・`min` のうち、1 つは要ります。

- 出し方: 時計のカードに「明日 地域 天気 今 15.3°（18°/9°） 降水10%」のような 1 行と、その隣に出典（`creditShort`）。天気のタイル・天気の部品には、アイコンと気温・降水確率と出典。
- 結果は 12 時間まで出します。それより古くなると出しません。

**うまくいかなかったとき**（画面に出る文）

| 何が起きたか | タイル | 天気 |
|---|---|---|
| JSON が読めない・要る項目が無い・何も書かずに終了コード 0 | 「MOD の出力を読めません」 | 「天気の MOD の出力を読めません」 |
| `error` に文字がある | その文 | その文 |
| 何も書かずに、終了コードが 0 以外 | 「終了コード N」 | 同じ |
| 時間切れ | 「15秒たっても終わらないので止めました」 | 「20秒たっても…」 |
| 起動できない | 「動かせません: …」 | 同じ |
| MOD が見つからない | 「MOD が見つかりません（mods フォルダーに入っていません）」 | 「天気の MOD が見つかりません」 |
| まだ確かめていない | 「まだ確かめていない MOD です（設定画面で確認すると動きます）」 | 「まだ確かめていない天気の MOD です（設定画面で確認すると動きます）」 |

- 何か書いて終わったときは、終了コードを見ません。うまくいかなかったときも、`error` を入れた JSON を書いて 0 で終わるのがおすすめです（見本の MOD もそうしています）。
- タイルは、失敗の文を出して枠の色を変えます。失敗は DisplayDeck のログ（`<設定のフォルダー>\logs\displaydeck-yyyyMMdd.log`）にも「MOD の失敗: <id> <文>」と残ります。
- 天気は、前にうまくいった結果（12 時間以内）があれば、失敗してもそれを出したままにします。無ければ、失敗の文を天気の行に出します。

### 8. 安全と確かめ

- MOD は、この PC で、利用者と同じ権限のふつうのプログラムとして動きます。DisplayDeck は MOD を囲いません（ファイル・通信・ほかのプログラムについて、利用者ができることは MOD もできます）。だから、利用者が「この MOD を確かめて使う」を押したものだけを動かします。
- **確かめる画面に出すもの**: 名前と版、フォルダー（フルパス）、実行するファイル（フルパス）、通信先（`hosts`。無ければ「-」）と、「MOD はこの PC でプログラムとして動きます。信頼できる配布元のものだけを使ってください。」。既定のボタンは「いいえ」です。
- **確かめた印**: MOD のフォルダーの中のすべてのファイル（README・画像・サブフォルダーの中も）を、名前の順に、相対パス・大きさ・中身ごと SHA-256 でハッシュしたものです。`<id> <ハッシュ>` の 1 行を `<設定のフォルダー>\data\mod-approved.txt` に足します。
- 確かめる画面を出す前にハッシュを取り、それを許可します（画面を出している間に中身が変わっても、見た中身だけを許可します）。
- **確かめ直しになるとき**: 中のファイルを 1 つでも書き換える・足す・消す・名前を変える、id を変える。もう一度押すまで動きません（前に確かめた中身に戻せば、また動きます）。設定の欄の値を変えても、確かめ直しは要りません。
  - だから MOD は、自分のフォルダーの中に書き込まないでください（記録・キャッシュは `DISPLAYDECK_MOD_DATA` へ）。
- **使えない MOD**: ファイルが 200 より多い・全部で 20MB より大きい・サブフォルダーが 8 段より深い・リンクを含む・読めない MOD は、「この MOD は使えません（…）」と出て確かめられません。作っている途中のフォルダーに `.git` などを置いたままだと、200 ファイルを超えやすくなります。
- 確かめた印はこの PC だけのものです。配った先では、使う人がそれぞれ押します。
- **DisplayDeck が MOD に渡すもの**は、6 節の環境変数と、DisplayDeck が受け継いだふつうの環境変数だけです。DisplayDeck の設定ファイルの中身・ほかのタイルの設定・カレンダーの URL や OBS のパスワードのような秘密は渡しません（ただし MOD は利用者の権限で動くので、利用者が読めるファイルは MOD も読めます）。
- 設定の欄の値は、暗号化せずに設定ファイル（`config\layout.json`）に保存され、設定の書き出しにも入ります。

### 9. 作る人へのお願い

決まりではなく、お願いです。

- 利用者の情報（ファイルの中身・場所・PC の名前など）を、利用者に分からない形で送らないでください。
- 通信する先は、すべて `hosts` に正直に書いてください（DisplayDeck は `hosts` を確かめないので、書いてあることが頼りです）。
- ほかのサービス（天気の API など）を使うときは、そのサービスの規約・回数の制限・出典の表示の決まりを守ってください。出典は `credit`・`creditShort`・`creditUrl` に書きます。非公開の API や、ほかのアプリのログイン情報（トークン・Cookie など）は使わないでください。
- 通信するときは `DISPLAYDECK_USER_AGENT` を使ってください。
- 出力は UTF-8 の JSON を 1 つ。失敗したときも、`error` を入れた JSON を書いてください。
- 打ち切り（タイル 15 秒・天気 20 秒）より十分早く終わるようにしてください。通信には自分で短い時間切れを付けてください（見本の MOD は 10 秒）。
- 同じ問い合わせを何度も繰り返さないでください（結果を `DISPLAYDECK_MOD_DATA` にためるなど）。天気の `intervalMinutes` は、使うサービスの制限に合わせてください。
- 同じ MOD が同時に動くことがあるので、`DISPLAYDECK_MOD_DATA` のファイルが壊れない書き方にしてください。
- パスワードや API キーのような秘密を、設定の欄で受け取らないでください（暗号化されずに保存・書き出しされます）。
- `error` などの文は、`DISPLAYDECK_LANG` を見て利用者の言語で出してください（無理なら英語で）。

### 10. 最小の例

どちらも通信しません。フォルダーごと mods に入れ、「一覧を更新」→ 選ぶ →「この MOD を確かめて使う」→「今すぐ試す」（天気は「試しに読む」）で試せます。.ps1 は英数字だけで書いてあるので、BOM が無くても動きます。

**タイル: 押すたびに数を数える**（`mods\counter\`）

`mod.json`

```json
{
  "id": "counter",
  "kind": "tile",
  "name": "Counter",
  "name_ja": "カウンター",
  "version": "1.0.0",
  "command": "counter.ps1",
  "hosts": [],
  "settings": [
    { "key": "step", "label": "Step", "label_ja": "増やす数", "default": "1" }
  ]
}
```

`counter.ps1`

```powershell
# Counts up each time the tile is pressed. No network.
$ErrorActionPreference = 'Stop'

function Out-Json($obj) {
    $json = ConvertTo-Json -InputObject $obj -Compress
    $bytes = (New-Object System.Text.UTF8Encoding($false)).GetBytes($json)
    $out = [Console]::OpenStandardOutput()
    $out.Write($bytes, 0, $bytes.Length)
    $out.Flush()
}
trap { Out-Json @{ error = 'Failed' }; exit 0 }

$step = 0
if (-not [int]::TryParse($env:DISPLAYDECK_SETTING_STEP.Trim(), [ref]$step)) {
    Out-Json @{ error = 'Step must be a whole number' }
    exit 0
}
$file = Join-Path $env:DISPLAYDECK_MOD_DATA 'count.txt'
$n = 0
if (Test-Path -LiteralPath $file) { $n = [int](Get-Content -LiteralPath $file -Raw) }
$n += $step
Set-Content -LiteralPath $file -Value $n -Encoding ASCII
Out-Json @{ text = [string]$n; sub = 'step ' + $step }
```

**天気: 決まった天気を返す**（`mods\sample-weather\`）

`mod.json`

```json
{
  "id": "sample-weather",
  "kind": "weather",
  "name": "Sample weather",
  "name_ja": "見本の天気",
  "version": "1.0.0",
  "command": "weather.ps1",
  "intervalMinutes": 60,
  "credit": "Sample data (not real weather)",
  "credit_ja": "見本のデータ（本当の天気ではありません）",
  "creditShort": "Sample",
  "hosts": [],
  "settings": [
    { "key": "area", "label": "Area name", "label_ja": "地域の名前", "default": "Sample City" }
  ]
}
```

`weather.ps1`

```powershell
# Returns a fixed forecast. A real MOD would read a weather service here.
$ErrorActionPreference = 'Stop'

function Out-Json($obj) {
    $json = ConvertTo-Json -InputObject $obj -Compress
    $bytes = (New-Object System.Text.UTF8Encoding($false)).GetBytes($json)
    $out = [Console]::OpenStandardOutput()
    $out.Write($bytes, 0, $bytes.Length)
    $out.Flush()
}
trap { Out-Json @{ error = 'Failed' }; exit 0 }

Out-Json @{
    area = $env:DISPLAYDECK_SETTING_AREA.Trim()
    weather = 'Sunny'
    icon = 'sun'
    max = 18; min = 9; pop = 10; now = 15.3
    tomorrow = $false
    error = $null
}
```

**見本のリポジトリ**

- ダイス MOD（タイル）: https://github.com/willailora/DiceDisplayDeckMOD — 設定の読み方、言語ごとの文、アイコン、UTF-8 での出し方の見本。DisplayDeck の配布用 zip にも入っています。
- Open-Meteo MOD（天気）: https://github.com/willailora/Open-MeteoDisplayDeckMOD — 通信して天気を取る MOD の作り方の見本です（`hosts`・出典・`DISPLAYDECK_MOD_DATA` へのためおき・通信の時間切れ）。DisplayDeck の機能ではありません。

### 11. この仕様が当てはまる版

- MOD は DisplayDeck 1.0.0（2026 年 11 月）で入りました。ダイス MOD を配布用 zip に入れ、プログラムの場所の mods も読むのも 1.0.0 からです。
- この仕様書は 1.6.0 のコード（と 1.6.1 の `iconTint`）で確かめました。1.0.0 から 1.6.0 まで、mod.json・環境変数・出力の決まりは変わっていません。
- 1.2.0: 確かめる画面の既定のボタンを「いいえ」にしました。
- 1.5.0: アイコンの色の付け替えが入りましたが、MOD のアイコンは対象外です（4 節）。
- 1.6.1（公開時期は未定）: mod.json に `iconTint` が入ります（4 節）。古い版の DisplayDeck は、この項目を読み飛ばします（アイコンは元の色のまま）。

---

## English

### 1. What a MOD is

A MOD is a small program distributed separately from DisplayDeck. The user puts it in the mods folder, and only MODs the user approves with "Verify and use this MOD" in the settings ever run.

There are two kinds.

| Kind (`kind`) | Where it is used | When it runs |
|---|---|---|
| `tile` | A tile. In the settings, set a tile's type to "MOD (add-on)" and choose it. The result is shown on the tile (when set as the long-press action, it is shown in the notice at the bottom of the screen) | When the tile is pressed |
| `weather` | A weather source. Choose it under "Other settings…" → "Clock, Calendar, OBS" → "Weather" → "Source". It appears in the weather line of the clock card, the weather tile and the weather part | At a fixed interval |

While a weather MOD is the source, the Japan Meteorological Agency's warnings and advisories are not shown.

### 2. Folder layout and location

```
mods\
  my-mod\          <- any folder name (a MOD is identified by the id in mod.json)
    mod.json       <- directly inside this folder
    my-mod.ps1     <- the file named in "command" (directly inside)
    icon.png       <- optional (directly inside)
```

| Location | Where |
|---|---|
| The user's mods | Usually `%APPDATA%\DisplayDeck\mods\`. With portable settings (portable.txt): `<DisplayDeck folder>\mods\`. "Open the MOD folder" in the settings opens it (and creates it if missing) |
| The program's mods | `<DisplayDeck folder>\mods\`. The Dice MOD included in the release zip is here |

- If both contain a MOD with the same id, the one in the user's mods is used.
- If one location has two MODs with the same id, only one of them is read. Do not reuse an id, even across kinds (tile and weather).
- The list is sorted by name. If the settings were open while you added a MOD, press "Refresh list".

**Conditions for appearing in the list** (if any one fails, the MOD is silently left out)

- `mods\<folder>\mod.json` exists. Deeper levels are not read (check that unzipping did not create a nested folder).
- mod.json is 64 KB or smaller and parses as a JSON object.
- `kind`, `id` and `command` follow the rules in section 3, and the command file exists.
- The MOD folder, mod.json and the command file are not links (symbolic links, junctions).

Even when listed, approving it also requires (section 8): at most 200 files and 20 MB in total, subfolders at most 8 levels deep, and no links anywhere.

### 3. mod.json

- Encoding: UTF-8 (with or without BOM).
- Write field names exactly as in the table, including case. Fields not in the table are ignored.
- A text field given a number (or any non-string), or an empty string, counts as not written.

| Field | Type | Required | Default | Rules |
|---|---|---|---|---|
| `id` | text | yes | — | 1–40 characters. Starts with a lowercase letter or digit; after that only lowercase letters, digits, `_` and `-` |
| `kind` | text | yes | — | `tile` or `weather` (lowercase) |
| `name` | text | | id | Name shown in the list and on the tile. Cut at 40 characters |
| `name_ja` | text | | `name` | Name used when the screen is in Japanese |
| `version` | text | | empty | Version shown next to the name. Cut at 20 characters |
| `command` | text | yes | — | Name of the file to run. Only a file directly inside the MOD folder (no `\`, `/` or `:`; not `.` or `..`). Extension `.ps1` or `.exe` (`.bat` and `.cmd` are not allowed) |
| `icon` | text | | DisplayDeck's MOD icon | Tile icon. A `.png` or `.jpg` directly inside the folder, up to 2 MB (section 4). Otherwise the default icon |
| `iconTint` | boolean | | `false` | Only when `true`, the icon is recolored to the theme (`.png` icons only. Section 4. Since 1.6.1; its release date is not decided yet) |
| `hosts` | array of text | | none | Hosts it talks to. Shown on the approval screen and in the settings. Each is cut at 100 characters; up to 10 (more are shown as "…"). Display only: DisplayDeck does not check or block network access |
| `settings` | array | | none | Setting fields (table below) |
| `intervalMinutes` | integer | | `30` | Weather only. Interval in minutes, kept within 15–360. Written as `30.0` or `"30"`, it is ignored and 30 is used |
| `credit` | text | | none | Weather only. Attribution. Cut at 200 characters. Shown in the settings and in "About DisplayDeck…". Also shown next to the weather when `creditShort` is missing |
| `credit_ja` | text | | `credit` | Attribution used when the screen is in Japanese |
| `creditUrl` | text | | none | Weather only. Attribution page. Used only if it starts with `https://` (otherwise ignored). Opened when the weather line or the weather tile is tapped |
| `creditShort` | text | | `credit` | Weather only. Short attribution shown next to the weather. Cut at 40 characters |

**Each entry of `settings`**

| Field | Type | Required | Default | Rules |
|---|---|---|---|---|
| `key` | text | yes | — | 1–30 letters, digits or `_`. Becomes the environment variable name (section 6). Keys that differ only in case: only the first is used |
| `label` | text | | key | Field name. Cut at 60 characters |
| `label_ja` | text | | `label` | Field name used when the screen is in Japanese |
| `default` | text | | none | Value passed when the field is empty. Cut at 200 characters |

- Up to 3 fields are used (from the 4th on they are ignored; entries with an invalid key are skipped and not counted).
- Users can type up to 200 characters. In tile settings, an empty field shows `default` as faint placeholder text.

**Japanese fields (`_ja`)**: `name_ja`, `label_ja` and `credit_ja` are used only when DisplayDeck's screen language is Japanese (otherwise, or if missing, the field without `_ja`). There are no fields for other languages (such as `name_de`). `creditShort` has no `_ja`.

**Text handling**: text shown on screen (name, version, credit, creditShort, hosts, label) has control characters (line breaks, etc.) turned into spaces and is trimmed before being cut. `default` only has control characters turned into spaces.

### 4. Icon (the button image)

#### Current rules

- Only tile MODs use it (a weather MOD's `icon` is not used).
- In `icon`, write the name of a file directly inside the MOD folder: `.png` or `.jpg` (`.jpeg` is not accepted), up to 2 MB, not a link. If missing or not valid, DisplayDeck's MOD icon is shown.
- It is drawn as a square (a non-square image is stretched to a square). A 384×384 PNG with a transparent background, like the bundled icons, is recommended.
- The size depends on the tile size and the "Icon size" setting. The name is usually below the icon (the settings can also overlay it or hide it).
- After the first press, the result is shown where the icon was (section 7).
- Users can replace the icon per tile. MOD tiles cannot use "Fill the tile" under "Icon display".
- An icon follows the theme ("Icon color" in "Background and theme…" and the per-tile "Icon color") only when mod.json says `"iconTint": true` and the icon is a `.png` (since 1.6.1, whose release date is not decided yet; current versions keep the icon's own colors; see "Making an icon that follows the theme color" below). Otherwise, and for `.jpg` icons, the icon keeps its own colors.
  - The default icon shown for a MOD without `icon` is one of DisplayDeck's bundled icons, so that one is always recolored.

#### Making an icon that follows the theme color

Writing `"iconTint": true` in mod.json makes DisplayDeck recolor the icon the same way as the bundled icons (since DisplayDeck 1.6.1; its release date is not decided yet. Current versions skip this field, so it is safe to add it now). Only a `.png` icon of a MOD that the user has approved ("Verify and use this MOD") is recolored. The rules below are the recoloring rules in the code. The bundled Dice MOD uses `iconTint` since its version 1.1.0, as a sample.

**How recoloring works**

1. It picks up the "plate color" (hue, saturation, brightness) from bands just inside the icon's edges (table below).
2. Only pixels close to the plate's hue and saturated enough are repainted in the theme hue. White, gray and black areas, and areas with a hue different from the plate, are left as they are.
3. The repainted plate's brightness and saturation are brought into a fixed range (average luminance 48–92 out of 0–255, average saturation 0.62; when the user picks a color for the tile, saturation 0.12–0.95 and luminance 40–120). Brightness differences between pixels (gradients, shading) are kept as ratios.
4. With "Single color (gray)", plate pixels become gray.
5. Recoloring is done after the image is resized to a 64–384 px square (making it larger than 384 px does not add detail).

**Bands where the plate color is picked up** (as a fraction of the image width and height)

| Band | Vertical range | Horizontal range |
|---|---|---|
| Top | 6–11% | 20–80% |
| Bottom | 92–95% | 20–80% |
| Left | 20–80% | 6–11% |
| Right | 20–80% | 89–94% |

- Only opaque pixels (alpha 200 or more) are counted. Near-white pixels (brightness above 0.9 and saturation below 0.12) are not counted.
- If fewer than 20 pixels are counted, the icon is not recolored.

**How to make one**

- A 384×384 PNG with a transparent background.
- Put a colored plate with rounded corners over almost the whole image. The bundled icons use a 356×356 plate placed 14 px from each edge, with a 64 px corner radius and a 3 px outline (a lighter color of the same hue).
- Make the plate one color, or a gradient of two shades of the same family (the bundled icons use a 45° diagonal gradient). A gray plate is fine too.
- Keep the four bands in the table plate-colored only. Do not draw symbols, text or other colors there (that is where the plate color is picked up).
- Make the symbol white (the bundled icons use RGB 240, 246, 255). White, gray and black are not recolored.
- Colors with a meaning (such as a red "close") stay if their hue differs from the plate. Colors roughly 30° or more away from the plate hue are not repainted (hues are compared in 10° steps). To be sure they stay, keep them 40° or more away. Colors with low saturation (0.04 or less) are not repainted either.
- With a gray plate, areas about as saturated as the plate and not much brighter than it are repainted. White symbols stay.
- If you add a strip for a key name or similar, place it above the bottom band (92–95%) (the bundled icons use 300–346 px).

### 5. How MODs are run

| | `.ps1` | `.exe` |
|---|---|---|
| How it starts | `%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy Bypass -File "<full path of the .ps1>"` (Windows PowerShell 5.1, not PowerShell 7 / pwsh) | The file is started directly |
| Arguments | none | none |

- It is started with no window (not through a shell). A program that opens its own window will show it.
- The working folder is not set (it stays whatever folder DisplayDeck was started in, not necessarily the MOD folder). Open your own files relative to the script's location (`$PSScriptRoot`) or the exe's location.
- Nothing is passed on standard input. Standard error is read and discarded (shown neither on screen nor in the log).
- The execution policy is Bypass, so a .ps1 does not need to be signed.
- If a .ps1 contains non-ASCII text (such as Japanese), save it as UTF-8 with BOM (Windows PowerShell 5.1 misreads UTF-8 without BOM).
- Time limit: 15 seconds for tiles, 20 seconds for weather. After that, the MOD is stopped together with any child processes it started.
- When the MOD's process ends, any child processes still running are stopped too (you cannot leave something running in the background).

**When it runs**

- Tile: when pressed (or long-pressed, when set as the long-press action), and with "Try it now" in the settings.
  - Pressing the same tile while it is running is ignored.
  - With two tiles of the same MOD, or with "Try it now", it can run at the same time.
- Weather: only while "Show the weather under the clock", a weather tile or the weather part is in use and this MOD is chosen as the source.
  - It runs right away when DisplayDeck starts and when the source or the weather MOD's settings change. After a success, it runs every `intervalMinutes`.
  - After a failure it tries again 5 minutes later. If the MOD is not found or not approved yet, it checks again every 30 seconds.
  - Weather MOD runs happen one at a time. It can run at the same time as "Test read" in "Other settings".
- Every run re-reads mod.json and re-checks the approval (section 8).

### 6. Environment variables

| Name | Content | Example |
|---|---|---|
| `DISPLAYDECK_SETTING_<KEY>` | A setting field's value. `<KEY>` is the settings key in upper case. If the user's value is empty, `default`; if there is none, an empty string. Always created for every declared field. Control characters become spaces; up to 200 characters. Leading and trailing spaces are kept | For key `place`: `DISPLAYDECK_SETTING_PLACE` |
| `DISPLAYDECK_LANG` | Language code of DisplayDeck's screen: `ja`, `en`, a bundled language (`zh-CN`, `zh-TW`, `ko`, `es`, `fr`, `de`, `it`, `pt-BR`, `ru`), or the code of a language file the user added | `ja`, `pt-BR` |
| `DISPLAYDECK_USER_AGENT` | User-Agent to use for network requests | `DisplayDeck/1.6.0 (+https://github.com/willailora/DisplayDeck)` |
| `DISPLAYDECK_MOD_DATA` | A folder the MOD may write to: `<settings folder>\data\mods\<id>` (usually `%APPDATA%\DisplayDeck\data\mods\<id>`; with portable settings `<DisplayDeck folder>\data\mods\<id>`). Created before each run | `…\DisplayDeck\data\mods\counter` |

- Besides these, the ordinary environment variables DisplayDeck inherited (such as `PATH`) are passed on as they are.
- For tile MODs, settings are per tile (two tiles can have different values). Weather MOD values are stored in a single table (by key) shared by all weather MODs, so weather MODs that use the same key share the value.
- Leading and trailing spaces are not removed, so trim them in the MOD if needed. For the language, looking at the part before `-` (`pt` for `pt-BR`) is easiest.

### 7. Output

- Write one JSON object to standard output.
- Use UTF-8 (a BOM is fine). If the output is not valid UTF-8, it is read in Windows' OEM code page (Shift_JIS on Japanese Windows).
- Only the first 4,000 characters are read (reading stops at about 16 KB). If it is longer, the JSON is cut off and cannot be read.
- After trimming, everything from the first `{` to the last `}` is parsed as JSON. Do not write anything other than the JSON.
- Write field names in lowercase, exactly as in the tables.

**Tile**

| Field | Type | Optional | Meaning |
|---|---|---|---|
| `text` | text | at least one of `text` and `sub` is needed | The result, shown large on the tile. Cut at 24 characters. The shorter, the larger (three steps: up to 4 characters, up to 8, longer) |
| `sub` | text | 〃 | A note shown small below. Cut at 80 characters. Not shown if it equals the tile's name |
| `error` | text or null | yes | A short message when something went wrong. If it is a non-empty string, it is shown and the other fields are ignored. Cut at 120 characters |

- Write `text` and `sub` as strings (the number `57` is not read; write `"57"`).
- Layout: the name small at the top, `text` in the middle, `sub` at the bottom. While running, the previous result is shown faded ("Running..." if there is no result yet). On low tiles only `text` is shown. When used as the long-press action, `text` and `sub` are shown side by side in the notice at the bottom of the screen.
- DisplayDeck only keeps the result in memory and does not save it. After DisplayDeck restarts or the settings change, the tile goes back to showing the icon and name.

**Weather**

| Field | Type | Optional | Meaning |
|---|---|---|---|
| `area` | text | yes | Area name. Cut at 40 characters |
| `weather` | text | * | Weather description (e.g. "Cloudy"). Cut at 40 characters |
| `icon` | text | yes | Weather icon: one of `sun`, `partly` (partly cloudy), `cloud`, `rain`, `snow`, `thunder`, `fog` (lowercase). Any other value or empty means no icon |
| `max` | number | * | High temperature (°C). Rounded to an integer |
| `min` | number | * | Low temperature (°C). Rounded to an integer |
| `pop` | number | yes | Chance of precipitation (%). Rounded to an integer. "—" if missing |
| `now` | number | yes | Current temperature (°C). Rounded to one decimal. Not shown outside -70 to 70 |
| `tomorrow` | boolean | yes | If `true`, shown as tomorrow's forecast (only for the boolean `true`) |
| `error` | text or null | yes | Same as for tiles |

\* At least one of `weather`, `max` and `min` is needed.

- Layout: one line on the clock card such as "Tomorrow Area Weather Now 15.3° (18°/9°) rain 10%", with the attribution (`creditShort`) next to it. The weather tile and weather part show the icon, temperatures, chance of precipitation and attribution.
- A result is shown for up to 12 hours. After that it is no longer shown.

**When something goes wrong** (text shown on screen)

| What happened | Tile | Weather |
|---|---|---|
| JSON cannot be read, a needed field is missing, or nothing was written and the exit code is 0 | "Cannot read the MOD's output" | "Cannot read the weather MOD's output" |
| `error` contains text | That text | That text |
| Nothing was written and the exit code is not 0 | "Exit code N" | Same |
| Time limit exceeded | "Stopped: it did not finish within 15 seconds" | "…within 20 seconds" |
| It cannot be started | "Cannot run: …" | Same |
| MOD not found | "MOD not found (it is not in the mods folder)" | "The weather MOD was not found" |
| Not approved yet | "This MOD has not been approved yet (approve it in the settings to use it)" | "This weather MOD has not been approved yet (approve it in the settings to use it)" |

- If something was written, the exit code is not looked at. Even when something goes wrong, it is best to write JSON with `error` and exit with 0 (the sample MODs do this).
- A tile shows the failure text and changes its frame color. Failures are also written to DisplayDeck's log (`<settings folder>\logs\displaydeck-yyyyMMdd.log`) as "MOD の失敗: <id> <text>".
- For weather, if there is an earlier successful result (within 12 hours), it stays on screen after a failure. If there is none, the failure text is shown in the weather line.

### 8. Safety and approval

- A MOD runs on this PC as an ordinary program with the same rights as the user. DisplayDeck does not sandbox MODs (whatever the user can do with files, the network and other programs, a MOD can do too). That is why only MODs the user approved with "Verify and use this MOD" are run.
- **The approval screen shows**: name and version, the folder (full path), the file that will run (full path), the hosts (`hosts`, or "-" if none), and "A MOD runs as a program on this PC. Only use MODs from sources you trust." The default button is "No".
- **The approval mark**: a SHA-256 hash over every file in the MOD folder (README, images and subfolders included), in name order, covering each relative path, size and content. One line, `<id> <hash>`, is added to `<settings folder>\data\mod-approved.txt`.
- The hash is taken before the approval screen is shown, and that hash is what gets approved (if the contents change while the screen is open, only what was shown is approved).
- **When approval is needed again**: changing, adding, removing or renaming any file in the folder, or changing the id. The MOD will not run until it is approved again (going back to contents that were approved before makes it run again). Changing values in the setting fields does not need re-approval.
  - So a MOD should not write into its own folder (put logs and caches in `DISPLAYDECK_MOD_DATA`).
- **MODs that cannot be used**: more than 200 files, more than 20 MB in total, subfolders deeper than 8 levels, any links, or unreadable files. The message "This MOD cannot be used (…)" appears and it cannot be approved. Leaving `.git` or similar in a folder you are working on makes it easy to go over 200 files.
- The approval mark belongs to this PC only. Wherever you distribute a MOD, each user approves it themselves.
- **What DisplayDeck passes to a MOD** is only the environment variables in section 6 and the ordinary environment variables DisplayDeck inherited. It does not pass the contents of DisplayDeck's settings file, other tiles' settings, or secrets such as the calendar URL or the OBS password (but since a MOD runs with the user's rights, it can read any file the user can).
- Values in the setting fields are stored unencrypted in the settings file (`config\layout.json`) and are included in settings exports.

### 9. Requests to MOD makers

These are requests, not rules.

- Do not send the user's information (file contents, locations, the PC's name, etc.) in ways the user cannot see.
- List every host you connect to in `hosts`, honestly (DisplayDeck does not check `hosts`, so users rely on what you write).
- When using another service (a weather API, etc.), follow its terms, rate limits and attribution rules. Put the attribution in `credit`, `creditShort` and `creditUrl`. Do not use private APIs or other apps' login data (tokens, cookies, etc.).
- Use `DISPLAYDECK_USER_AGENT` for network requests.
- Output one UTF-8 JSON object. Even on failure, write JSON with `error`.
- Finish well within the time limit (15 seconds for tiles, 20 for weather). Give network requests your own short timeout (the sample MODs use 10 seconds).
- Do not repeat the same request over and over (keep results in `DISPLAYDECK_MOD_DATA`, for example). Set a weather MOD's `intervalMinutes` to fit the service's limits.
- The same MOD can run more than once at the same time, so write files in `DISPLAYDECK_MOD_DATA` in a way that does not corrupt them.
- Do not ask for secrets such as passwords or API keys in the setting fields (they are stored and exported unencrypted).
- Show `error` and other text in the user's language by looking at `DISPLAYDECK_LANG` (English if that is not possible).

### 10. Minimal examples

Neither uses the network. Put the folder in mods, then "Refresh list" → choose it → "Verify and use this MOD" → "Try it now" ("Test read" for weather). The .ps1 files use only ASCII, so they work without a BOM.

**Tile: counts up on each press** (`mods\counter\`)

`mod.json`

```json
{
  "id": "counter",
  "kind": "tile",
  "name": "Counter",
  "name_ja": "カウンター",
  "version": "1.0.0",
  "command": "counter.ps1",
  "hosts": [],
  "settings": [
    { "key": "step", "label": "Step", "label_ja": "増やす数", "default": "1" }
  ]
}
```

`counter.ps1`

```powershell
# Counts up each time the tile is pressed. No network.
$ErrorActionPreference = 'Stop'

function Out-Json($obj) {
    $json = ConvertTo-Json -InputObject $obj -Compress
    $bytes = (New-Object System.Text.UTF8Encoding($false)).GetBytes($json)
    $out = [Console]::OpenStandardOutput()
    $out.Write($bytes, 0, $bytes.Length)
    $out.Flush()
}
trap { Out-Json @{ error = 'Failed' }; exit 0 }

$step = 0
if (-not [int]::TryParse($env:DISPLAYDECK_SETTING_STEP.Trim(), [ref]$step)) {
    Out-Json @{ error = 'Step must be a whole number' }
    exit 0
}
$file = Join-Path $env:DISPLAYDECK_MOD_DATA 'count.txt'
$n = 0
if (Test-Path -LiteralPath $file) { $n = [int](Get-Content -LiteralPath $file -Raw) }
$n += $step
Set-Content -LiteralPath $file -Value $n -Encoding ASCII
Out-Json @{ text = [string]$n; sub = 'step ' + $step }
```

**Weather: returns a fixed forecast** (`mods\sample-weather\`)

`mod.json`

```json
{
  "id": "sample-weather",
  "kind": "weather",
  "name": "Sample weather",
  "name_ja": "見本の天気",
  "version": "1.0.0",
  "command": "weather.ps1",
  "intervalMinutes": 60,
  "credit": "Sample data (not real weather)",
  "credit_ja": "見本のデータ（本当の天気ではありません）",
  "creditShort": "Sample",
  "hosts": [],
  "settings": [
    { "key": "area", "label": "Area name", "label_ja": "地域の名前", "default": "Sample City" }
  ]
}
```

`weather.ps1`

```powershell
# Returns a fixed forecast. A real MOD would read a weather service here.
$ErrorActionPreference = 'Stop'

function Out-Json($obj) {
    $json = ConvertTo-Json -InputObject $obj -Compress
    $bytes = (New-Object System.Text.UTF8Encoding($false)).GetBytes($json)
    $out = [Console]::OpenStandardOutput()
    $out.Write($bytes, 0, $bytes.Length)
    $out.Flush()
}
trap { Out-Json @{ error = 'Failed' }; exit 0 }

Out-Json @{
    area = $env:DISPLAYDECK_SETTING_AREA.Trim()
    weather = 'Sunny'
    icon = 'sun'
    max = 18; min = 9; pop = 10; now = 15.3
    tomorrow = $false
    error = $null
}
```

**Sample repositories**

- Dice MOD (tile): https://github.com/willailora/DiceDisplayDeckMOD — an example of reading settings, per-language text, icons and UTF-8 output. It is also included in DisplayDeck's release zip.
- Open-Meteo MOD (weather): https://github.com/willailora/Open-MeteoDisplayDeckMOD — an example of how to make a weather MOD that fetches data over the network (`hosts`, attribution, caching in `DISPLAYDECK_MOD_DATA`, network timeouts). It is not a DisplayDeck feature.

### 11. Versions this specification applies to

- MODs were added in DisplayDeck 1.0.0 (November 2026). Bundling the Dice MOD in the release zip, and also reading the program's mods folder, started in 1.0.0.
- This specification was checked against the 1.6.0 code (and `iconTint` in 1.6.1). From 1.0.0 to 1.6.0, the rules for mod.json, environment variables and output have not changed.
- 1.2.0: the default button on the approval screen became "No".
- 1.5.0: icon recoloring was added, but MOD icons are not included (section 4).
- 1.6.1 (release date not decided yet): `iconTint` is added to mod.json (section 4). Older versions of DisplayDeck skip this field (the icon keeps its own colors).
