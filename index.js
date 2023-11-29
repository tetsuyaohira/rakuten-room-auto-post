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
  "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?genreId=100371&page=6";
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
      const productDescription = await generateProductDescription(
        catchcopy,
        itemName,
        itemCaption
      );
      console.log("2:" + new Date().toLocaleString());

      // const productDescription = `🎄🎁 可愛いクリスマスパッケージに詰まった、神戸風月堂の「クリスマスミニゴーフル 2入」は、クリスマスのお菓子にぴったりです！サンタとクマのかわいいパッケージには、バニラ、ストロベリー風味、チョコレートの3種類のクリームが詰まっています。
      // 小さいサイズなので、ちょっとした贈り物やお土産にも最適です。このクリスマス、心温まるゴーフルで特別なプレゼントをしませんか？😍🎅🐻

      // #クリスマスミニゴーフル #プチギフト #クリスマスプレゼント #お菓子 #可愛いパッケージ #神戸風月堂 #お土産 #小さいサイズ #クリスマス #ギフトアイデア`;

      // 500文字に加工
      const productDescription500 = productDescription.slice(0, 500);
      console.log(productDescription500);

      if (productDescription500) {
        await scrapeWebsite(
          url,
          process.env.USER_ID,
          process.env.USER_PASSWORD,
          productDescription500
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function generateProductDescription(catchcopy, itemName, itemCaption) {
  try {
    const prompt = `以下の商品を購入したくなるように魅力的にフレンドリーに短く書いてください。
250字以内に収めてください。

以下、商品の特徴
${catchcopy} ${itemName}

${itemCaption}
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
    // console.log(completion.choices[0].message.content);

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "";
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeWebsite(url, userId, password, textToPaste) {
  console.log("3:" + new Date().toLocaleString());
  const browser = await puppeteer.launch({ headless: true });
  console.log("4:" + new Date().toLocaleString());
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
  );
  console.log("5:" + new Date().toLocaleString());
  await page.goto(url);
  console.log("6:" + new Date().toLocaleString());
  // await page.waitForNavigation(); // ページ遷移を待つ

  // ログイン処理
  console.log("7:" + new Date().toLocaleString());
  await page.waitForSelector("#loginInner_u", { visible: true });
  await page.type("#loginInner_u", userId);

  console.log("8:" + new Date().toLocaleString());
  await page.waitForSelector("#loginInner_p", { visible: true });
  await page.type("#loginInner_p", password);

  console.log("9:" + new Date().toLocaleString());
  await page.click('input[value="ログイン"]');

  console.log("10:" + new Date().toLocaleString());
  await page.waitForSelector("#collect-content", {
    visible: true,
  });
  await page.click("#collect-content");
  await page.waitForTimeout(500);
  await page.type("#collect-content", textToPaste, { delay: 10 });
  console.log("11:" + new Date().toLocaleString());

  await page.waitForSelector("button", { visible: true });
  const buttonToClick = await page.$x("//button[contains(., '完了')]");
  // await page.waitForTimeout(100); // 100ミリ秒待つ

  if (buttonToClick.length > 0) {
    console.log("12:" + new Date().toLocaleString());
    await buttonToClick[0].click();
    await page.waitForTimeout(500);
  }

  // await page.waitForNavigation(); // ページ遷移を待つ
  console.log("13:" + new Date().toLocaleString());
  await browser.close();
  console.log("14:" + new Date().toLocaleString());
}

getRakutenRankingData();
