import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import parseCommandLineArgs from "./src/parseCommandLineArgs";
import {
  getRakutenRankingDataByGenre,
  getRakutenRankingDataByKeyword,
} from "./src/getRakutenRankingData";
import getGenreIdsByTime from "./src/getGenreIdsByTime";
import getNumberToday from "./src/lib/getNumberToday";
import postRakutenRoom from "./src/postRakutenRoom";

async function runJob() {
  const today = new Date();
  const currentHour = today.getHours();
  const targetGenres = getGenreIdsByTime(currentHour);
  if (targetGenres.length === 0) {
    console.log("対象ジャンルなし");
    return;
  }

  for (const genreId of targetGenres) {
    main(getRakutenRankingDataByGenre, genreId);
  }
  console.log("End job:" + new Date().toLocaleString());
}

async function main(
  getRakutenRankingData: (genreOrKeyword: string, numberToday: number) => any,
  genreOrKeyword: string
) {
  const numberToday = getNumberToday();
  const elements = await getRakutenRankingData(genreOrKeyword, numberToday);
  await postRakutenRoom(elements);
  console.log("End job:" + new Date().toLocaleString());
}

const args = process.argv.slice(2);
const options = parseCommandLineArgs(args);
if (options.genre) {
  main(getRakutenRankingDataByGenre, options.genre);
} else if (options.keyword) {
  main(getRakutenRankingDataByKeyword, options.keyword);
} else {
  const job = new CronJob("0 0 9,12,15,18,21 * * *", () => {
    console.log("Start job:" + new Date().toLocaleString());
    runJob();
  });
  job.start();
}
