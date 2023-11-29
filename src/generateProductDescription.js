import OpenAI from "openai";

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

export async function generateProductDescription(
  catchcopy,
  itemName,
  itemCaption
) {
  const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY });

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
