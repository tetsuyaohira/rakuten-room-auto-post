import axios from "axios";

export async function getRakutenRankingDataByGenre(
  genreId: string,
  page: number
) {
  const RAKUTEN_RANKING_URL = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?genreId=${genreId}&page=${page}`;

  const response = await axios.get(RAKUTEN_RANKING_URL, {
    params: {
      applicationId: process.env.RAKUTEN_API_KEY,
    },
  });

  // 21件目まで返す.
  // return response.data.Items.slice(0, 21);
  return response.data.Items;
}

export const getRakutenRankingDataByKeyword = async (
  keyword: string,
  page: number
) => {
  const RAKUTEN_SEARCH_URL = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&availability=1&orFlag=0&keyword=${keyword}&page=${page}`;

  const response = await axios.get(RAKUTEN_SEARCH_URL, {
    params: {
      applicationId: process.env.RAKUTEN_API_KEY,
    },
  });

  return response.data.Items;
};
