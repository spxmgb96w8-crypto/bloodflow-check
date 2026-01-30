# 血流改善チェック（完成版）

## 使い方
- `index.html` をブラウザで開くと動きます（1ページサイト）
- チェック状態はブラウザに保存されます（戻っても残ります）

## 予約リンクの差し替え
`index.html` の下部「血流改善体験へ」セクションで、以下を自分のお店のURLに変更してください。

- 体験を予約するボタン：
  id="reserveBtn" の href="https://example.com" を差し替え

- LINEで相談するボタン：
  id="lineBtn" の href="https://line.me/R/ti/p/@example" を差し替え

## GitHub Pages で公開
1) GitHubでリポジトリ作成
2) このフォルダ内のファイルをリポジトリ直下にアップ
3) Settings → Pages → Branch を main / root にする
4) URLが発行され公開されます

## 判定ルール（要望どおり）
- 赤に1つでもチェック → 重度
- 赤0で黄に1つでもチェック → 中度
- 赤0・黄0で青に1つでもチェック → 軽度
