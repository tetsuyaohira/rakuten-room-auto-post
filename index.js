import axios from "axios";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

import { getRakutenRankingData } from "./src/getRakutenRankingData.js";

getRakutenRankingData();
