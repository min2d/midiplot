# midiplot
midi -> extendscript (-> adobe illustrator path)

## 環境
nodjs 12.13.1

## ビルド
`npx webpack`

## 構成
* バンドルはwebpackで直接docsに出力
* extendscriptはエラー回避のため2ファイル構成
  * 読み込む方のサイズが大きすぎると動作しないため、データ部と処理部で分けています
  * 処理部はtemplates.jsをそのまま出力します
  * データ部は文字列として出力します