# Shiro Public Image Library

シロちゃん公開ページ用の画像素材置き場です。

ここには、現在HPで使用している代表画像だけを置きます。元素材の保管場所は `private-video-library/Shiro/Source-Assets/Images/`、作品単位の動画制作データは `private-video-library/Shiro/Projects/` です。

## 基本ルール

- 新しい画像は、まず `private-video-library/Shiro/Source-Assets/Images/00_inbox/` に置く。
- 作品単位で使うものは `private-video-library/Shiro/Projects/` にまとめる。
- HPへ採用した代表画像だけを `public/images/shiro/` へコピーする。
- 迷ったら削除しない。Private側へ残して、こーちゃんへ確認する。
- Publicを整理するときは `python3 tools/archive_shiro_public_assets.py` で計画を確認し、こーちゃんが照合してから適用する。
- `Source-Assets` はGitの対象外なので、GitHubや公開HPには出ません。

## フォルダの考え方

### 00_inbox

現在HPで使用している画像のうち、まだ正式カテゴリへ移していないもの。

新しい元素材の投函先は、Private側の `Source-Assets/Images/00_inbox` です。

### 00_reference-base

基本設定・基準画像。

- シロちゃんの基本姿
- 主要な見た目の基準
- ぬいぐるみペットたちの基準

### 02_shiro

シロちゃん単体・行動・表情。

例: 噛む、怒る、寝る、遊ぶ、困る、得意げ。

ただし、動画作品としてまとまっているものは `private-video-library/Shiro/Projects/` を優先します。

### 03_tencho

店長さん関連。

店長さんは顔出しなし。基本は手、指、作業風景、店長さんの気配。

### 04_tukuroi

ぬいぐるみペット専門店「繕」。

店内、棚、カフェコーナー、ピクニックの丘、店長さんが作ったミニチュアやジオラマ。

### 05_toy-pets

シロちゃん以外のぬいぐるみペットたち。

### 06_making

制作・手仕事・作品。

シロちゃんが作ったもの、衣装制作、刺繍、布、道具、制作途中。

### 07_video-candidates

公開予定・動画候補。

YouTube、Instagram、note、HPで使うかもしれない画像やサムネ候補。

### 08_outfits-crafts

旧: 衣装・手仕事の仮棚。

今後は `06_making` に寄せていく予定。残っているものは順次確認。

### 09_shiro-mama

シロちゃんママ、赤ちゃん、家族系。

シロちゃんに似ていても、シロちゃん本人ではないものはここ。

### 10_story-sets

ストーリー単位の候補画像。

ただし、動画制作としてまとまる場合は `private-video-library/Shiro/Projects/` へ移す。

### 11_short-ready / 12_needs-bgm / 13_needs-se

動画化の作業状態。

- `11_short-ready`: すぐショート化できそう
- `12_needs-bgm`: BGMが必要
- `13_needs-se`: 効果音が必要

### 90_review

確認待ち・保留・あとで見たい素材。

### 99_archive

退避・旧版・使わないかもしれない素材。

## 主軸と副軸

### 主軸: 作品箱

動画や投稿にする単位。

例:

- `20260714_shiro_カップメン`
- `20260714_shiro_cafe`
- `shiro_lolita_fashion`

これは `private-video-library/Shiro/Projects/` に置きます。

### 副軸: タグ・行動・素材種別

検索や見返し用。

例:

- 噛む
- 怒る
- 店長さん
- シロママ
- 赤ちゃん
- 衣装
- カフェ
- 要BGM
- 要SE

副軸はフォルダで増やしすぎず、Workshopのステータス・メモ・タグで管理します。
