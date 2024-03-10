import scrapeWebsite from "./scrapeWebsite";

async function postRakutenRoom(elements: any) {
  for (const element of elements) {
    try {
      const { catchcopy, itemName, itemCode } = element.Item;

      console.log("-----------------------------------------------");
      const url = `https://room.rakuten.co.jp/mix?itemcode=${itemCode}&scid=we_room_upc60`;
      console.log(url);

      await scrapeWebsite(url, catchcopy, itemName);

      await new Promise((resolve) => setTimeout(resolve, 60000)); // 1分待つ
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export default postRakutenRoom;
