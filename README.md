# rakuten-room-auto-post

楽天 ROOM に自動投稿する Node.js アプリケーションです。楽天 API を利用して商品情報を取得し、ChatGPT API で生成した商品の紹介文とともに、スクレイピングを用いて楽天 ROOM に自動投稿します。

## 特徴

- 楽天 API から商品情報を取得
- ChatGPT API を使用して商品紹介文を自動生成
- Puppeteer を用いたスクレイピングによる楽天 ROOM への自動投稿
- cron を使用した定期実行機能

## 前提条件

- Node.js がインストールされていること
- 楽天 API キーと ChatGPT API キーが必要です

## セットアップ

リポジトリをクローンした後、以下のコマンドを実行して依存関係をインストールします。

```bash
git clone https://github.com/tetsuyaohira/rakuten-room-auto-post.git
cd rakuten-room-auto-post
npm install
```

## 使用方法

1.`.env`ファイルを作成し、必要なAPIキーを設定します。
```plaintext
RAKUTEN_API_KEY=あなたの楽天APIキー
CHATGPT_API_KEY=あなたのChatGPT APIキー
```
2.アプリケーションを実行します。
```bash
npm start
```

## ライセンス
このプロジェクトは MITライセンス の下で公開されています。

## コントリビューション
プルリクエストやフィードバックはいつでも歓迎します。新しい機能の提案やバグ報告は、GitHubのIssuesに投稿してください。

## 作者
[tetsuya ohira](https://github.com/tetsuyaohira)