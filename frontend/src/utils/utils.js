import { create } from 'ipfs-http-client';
import AuctionBlock from './../Components/AuctionBlock.js';

export function scrollToTop() {
  window.scrollTo(0, 0);
}

export async function fetchIpfsData(hash){
  try {
      const ipfs = create({ host: process.env.REACT_APP_IPFS_URL, port: "5001", protocol: "http" });
      const dataStream = await ipfs.get(hash);
      const chunks = [];
      for await (const chunk of dataStream) {
          chunks.push(chunk);
      }
      const combinedChunks = chunks.reduce((acc, chunk) => {
          return new Uint8Array([...acc, ...chunk]);
      }, new Uint8Array());

      const jsonString = new TextDecoder().decode(new Uint8Array(combinedChunks));
      const payloadStartIndex = jsonString.indexOf('{');
      const payloadString = jsonString.slice(payloadStartIndex);
      const cleanedPayloadString = payloadString.replace(/\0/g, '').trim();
      const jsonData = JSON.parse(cleanedPayloadString);
      return jsonData;
  } catch (error) {
      console.log("An error occurred ", error)
      throw new Error(`Error Occurred Fetching IPFS Data: ${error.message}`);
  }
};

export function createAuctionRows(auctions) {
  const rows = [];
  for (let i = 0; i < auctions.length; i += 4) {
    const rowAuctions = auctions.slice(i, i + 4);
    rows.push(
      <div className="row auction-row" key={`row-${i}`}>
        { auctions.map((auction) => (
          <AuctionBlock
            img={auction.img}
            category={auction.category}
            address={auction.address}
            promoted={auction.promoted}
            startPrice={auction.startPrice}
            highestBid={auction.highestBid}
            bids={auction.bids}
          />
        ))}
      </div>
    );
  }
  return rows;
}
