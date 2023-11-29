import axios from "axios";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
const openai = new OpenAI({
  apiKey: CHATGPT_API_KEY,
});

const ROLE_CONTENT = `Please write short, attractive, friendly sentences to post on Rakuten ROOM so that people will want to buy your products.
- Please do not use "[ and ]" because they are garbled.
- Please use pictograms in moderation.
- Please add a relevant hashtag at the end of the sentence.
- Please keep it within 350 characters.
- Answer in the language asked.`;
// const ROLE_CONTENT = `楽天ROOMに投稿する文章を商品を購入したくなるように魅力的にフレンドリーに短く書いてください。
// - 【と】は文字化けするので絶対に使わないでください。
// - 適度に絵文字を使ってください。
// - 文章の最後に関連するハッシュタグをつけてください
// - 250文字以内でお願いします。`;

const ASSISTANT_CONTENT = `
🦄✨ ユニコーンが誘う魔法のユートピアへようこそ ✨🦄

🌸💖 ジルスチュアートの限定ホリデーコレクションで、幻想的な雲の上の世界へ一足先にトリップしましょう。ユニコーンユートピアコレクションは、ユートピアに咲く花々の香りとスウィートユートピアガーデンの香りが詰まった、夢見心地のセットです。💖🌸

🌈 自分へのご褒美にも、大切な人への特別なギフトにもぴったり。煌びやかなアイシャドウ、ほんのり色づくチーク、唇を彩るルージュ、指先まで美しくするネイルオイル、そして雲形のキュートなポーチまで、このセット一つでメイクの幅が広がります。🌈

🎁 LINEを新規追加で250円OFFクーポンプレゼント中！今すぐお友だちになって、お得に夢のようなホリデーコレクションを手に入れてくださいね。🎁

#JILLSTUART #ユニコーンユートピア #ホリデーコレクション #限定セット #メイクアップ #ギフトセット #特別なプレゼント #スウィートユートピア #メイクの魔法 #LINEキャンペーン #ビューティー体験`;

const RAKUTEN_RANKING_URL =
  "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?genreId=100371&page=9";
// const RAKUTEN_SEARCH_URL = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&availability=1&orFlag=0&keyword=ディズニー&page=2`;

async function getRakutenRankingData() {
  const response = await axios.get(RAKUTEN_RANKING_URL, {
    params: {
      applicationId: process.env.RAKUTEN_API_KEY,
    },
  });

  for (const element of response.data.Items) {
    try {
      const { catchcopy, itemName, itemCaption, itemCode } = element.Item;
      console.log("-----------------------------------------------");
      const url = `https://room.rakuten.co.jp/mix?itemcode=${itemCode}&scid=we_room_upc60`;
      console.log(url);
      // continue;

      console.log("1:" + new Date().toLocaleString());
      await scrapeWebsite(
        url,
        process.env.USER_ID,
        process.env.USER_PASSWORD,
        catchcopy,
        itemName,
        itemCaption
      );
      console.log("3:" + new Date().toLocaleString());
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function generateProductDescription(catchcopy, itemName, itemCaption) {
  const itemCaption1000 = itemCaption.slice(0, 1000);
  try {
    const prompt = `以下の商品を購入したくなるように魅力的にフレンドリーに短く書いてください。
250字以内に収めてください。

以下、商品の特徴
${catchcopy} ${itemName}

${itemCaption1000}
`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: ROLE_CONTENT,
        },
        {
          role: "assistant",
          content: ASSISTANT_CONTENT,
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      // model: "gpt-4-1106-preview",
      // response_format: { type: "json_object" },
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "";
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWebsite(
  url,
  userId,
  password,
  catchcopy,
  itemName,
  itemCaption
) {
  const browser = await puppeteer.launch({ headless: "new" });
  // const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  await page.goto(url);

  // ログイン処理
  await page.waitForSelector("#loginInner_u", { visible: true });
  await page.type("#loginInner_u", userId);
  await page.waitForSelector("#loginInner_p", { visible: true });
  await page.type("#loginInner_p", password);
  await page.click('input[value="ログイン"]');

  // ログイン後のページ遷移を待つ
  await page.waitForSelector("#collect-content", {
    visible: true,
  });

  // コレ！済みの場合は、処理を終了
  let modalElement = null;
  try {
    await page.waitForSelector(".modal-dialog-container", {
      visible: true,
      timeout: 500,
    });
    modalElement = await page.$(".modal-dialog-container");
  } catch (error) {}
  if (modalElement) {
    console.log("「すでにコレしている商品です」のため処理を終了");
    await browser.close();
    return;
  }

  // メッセージ取得
  const productDescription = await generateProductDescription(
    catchcopy,
    itemName,
    itemCaption
  );
  const productDescription500 = productDescription.slice(0, 500);
  console.log("2:" + new Date().toLocaleString());
  console.log(productDescription500);

  //　投稿処理
  await page.waitForSelector("#collect-content", {
    visible: true,
  });
  await page.click("#collect-content");
  await page.type("#collect-content", productDescription500, { delay: 10 });

  await page.waitForSelector("button", { visible: true });
  const buttonToClick = await page.$x("//button[contains(., '完了')]");

  if (buttonToClick.length > 0) {
    console.log("12:" + new Date().toLocaleString());
    await buttonToClick[0].click();
    await page.waitForTimeout(500);
  }

  await browser.close();
}

getRakutenRankingData();
