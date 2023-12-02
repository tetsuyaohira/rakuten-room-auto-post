import { CronJob } from "cron";
import dotenv from "dotenv";
dotenv.config();

import { getRakutenRankingData } from "./src/getRakutenRankingData.js";
import { scrapeWebsite } from "./src/scrapeWebsite.js";

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const getNumberFromDayOfYear = (dayOfYear) => {
  let number = dayOfYear % 10;
  if (number === 0) {
    number = 10;
  }
  return number;
};

const genres = {
  9: [100371, 100433],
  12: [216131, 558885],
  15: [216129, 100533],
  18: [551167, 100804],
  21: [558944, 100939],
};

async function main() {
  const today = new Date();
  const dayOfYearToday = getDayOfYear(today);
  const numberToday = getNumberFromDayOfYear(dayOfYearToday);

  const currentHour = today.getHours();
  console.log("numberToday:" + numberToday);
  const targetGenres = genres[currentHour];
  if (!targetGenres) {
    console.log("対象ジャンルなし");
    return;
  }

  for (const genreId of targetGenres) {
    let targerPage = numberToday;
    if (currentHour === 12) {
      targerPage += 10;
    } else if (currentHour === 18) {
      targerPage += 20;
    } else if (currentHour === 21) {
      targerPage += 30;
    }

    const elements = await getRakutenRankingData(genreId, targerPage);

    for (const element of elements) {
      try {
        const { catchcopy, itemName, itemCaption, itemCode } = element.Item;

        console.log("-----------------------------------------------");
        const url = `https://room.rakuten.co.jp/mix?itemcode=${itemCode}&scid=we_room_upc60`;
        console.log(url);
        // continue;

        console.log("1:" + new Date().toLocaleString());
        await scrapeWebsite(url, catchcopy, itemName, itemCaption);
        console.log("3:" + new Date().toLocaleString());
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
}

const job = new CronJob("0 0 9,12,18,21 * * *", () => {
  console.log("Start job:" + new Date().toLocaleString());
  main();
});

// main();
job.start();
