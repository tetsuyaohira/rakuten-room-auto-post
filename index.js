import axios from "axios";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

import { getRakutenRankingData } from "./src/getRakutenRankingData.js";
import { scrapeWebsite } from "./src/scrapeWebsite.js";

async function main() {
  const elements = await getRakutenRankingData();

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

main();
