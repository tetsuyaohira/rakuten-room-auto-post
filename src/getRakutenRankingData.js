import axios from "axios";

const RAKUTEN_RANKING_URL =
  "https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?genreId=100371&page=10";
// const RAKUTEN_SEARCH_URL = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&availability=1&orFlag=0&keyword=ディズニー&page=2`;

export async function getRakutenRankingData() {
  const response = await axios.get(RAKUTEN_RANKING_URL, {
    params: {
      applicationId: process.env.RAKUTEN_API_KEY,
    },
  });

  return response.data.Items;
}
