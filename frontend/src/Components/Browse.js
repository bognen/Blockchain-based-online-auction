import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuctionBlock from './AuctionBlock.js';
import { fetchIpfsData } from "./../utils/utils.js";
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import alertify from 'alertifyjs';

function Browse(){
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
      axios.get(process.env.REACT_APP_REST_API_URL+'/api/get-all-auctions/all')
        .then(async (response) => {
            const auctionsArr = await Promise.all(
              response.data.auctions.map(async (item) => {
                let ipfsData = await fetchIpfsData(item.hash);
                return {
                  img: ipfsData.images[0],
                  category: ipfsData.category,
                  address: item.auctionAddress,
                  promoted: item.promoted,
                  startPrice: item.price,
                  highestBid: item.highestBid,
                  bids: item.bidCount,
                };
              })
            );
            setAuctions(auctionsArr);
        }).catch(err => {
            alertify.error("Cannot Obtain List of Auctions")
            console.log(err);
            console.log(err.response.data)
        })
  }, [])

  const rows = [];
  for (let i = 0; i < auctions.length; i += 4) {
      const rowAuctions = auctions.slice(i, i + 4);
      rows.push(
        <div className="row" key={`row-${i}`}>
          { rowAuctions.map((auction) => (
            <AuctionBlock img={auction.img} category={auction.category} address={auction.address} promoted={auction.promoted}
                startPrice={auction.startPrice} highestBid={auction.highestBid} bids={auction.bids} />
          ))}
        </div>);
  }

  return(
      <div className="layout_padding">
        <div className="container">
          <h1 className="promoted_text">ABA <span style={{borderBottom: '5px solid #4bc714'}}>ADS</span></h1>
          <div className="images_main">{rows}</div>
        </div>
      </div>
  )
}

export default Browse;
