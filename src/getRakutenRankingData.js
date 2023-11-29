import axios from "axios";
import { scrapeWebsite } from "./scrapeWebsite.js";

const RAKUTEN_RANKING_URL =
  "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?genreId=100371&page=10";
// const RAKUTEN_SEARCH_URL = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&availability=1&orFlag=0&keyword=ディズニー&page=2`;

export async function getRakutenRankingData() {
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
