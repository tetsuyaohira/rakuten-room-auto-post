import scrapeWebsite from "./scrapeWebsite";

async function postRakutenRoom(elements: any) {
  for (const element of elements) {
    try {
      const { catchcopy, itemName, itemCaption, itemCode } = element.Item;

      console.log("-----------------------------------------------");
      const url = `https://room.rakuten.co.jp/mix?itemcode=${itemCode}&scid=we_room_upc60`;
      console.log(url);

      await scrapeWebsite(url, catchcopy, itemName, itemCaption);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

export default postRakutenRoom;
