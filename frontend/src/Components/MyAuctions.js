import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuctionBlock from './AuctionBlock.js';
import { fetchIpfsData, createAuctionRows } from "./../utils/utils.js";
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import alertify from 'alertifyjs';
import { UserContext } from './../Contexts/UserContext';
import styles from './../styles/ResponsiveTabs.module.css';

//Temporary images
import img1 from './../images/img-1.png';
import img2 from './../images/img-2.png';
import img3 from './../images/img-3.png';
import img4 from './../images/img-4.png';

import eye_icon from './../images/price-icon.png';
import like_icon from './../images/bid.png';

function MyAuctions(){

    const [activeTab, setActiveTab] = useState('tab1');
    const [ownedAuctions, setOwnedAuctions] = useState([]);
    const [cancelledAuctions, setCancelledAuctions] = useState([]);
    const [participatedAuctions, setParticipatedAuctions] = useState([]);

    const { token } = useContext(UserContext);
    useEffect(() => {
        axios.get(process.env.REACT_APP_REST_API_URL+'/api/auctions-by-user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }).then(async (response) => {
            const processAuctionItems = async (items) => {
              const processedItems = await Promise.all(
                items.map(async (item) => {
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
              return processedItems;
            };

            const [ownedAuctionsArr, cancelledAuctionsArr, participatedAuctionsArr] = await Promise.all([
              processAuctionItems(response.data.owned),
              processAuctionItems(response.data.cancelled),
              processAuctionItems(response.data.participated),
            ]);

            setOwnedAuctions(ownedAuctionsArr);
            setCancelledAuctions(cancelledAuctionsArr);
            setParticipatedAuctions(participatedAuctionsArr);
          }).catch(err => {
            alertify.error("Cannot Obtain List of Auctions")
            console.log(err);
            console.log(err.response.data)
        })
    }, [])

    const ownedRows = createAuctionRows(ownedAuctions);
    const cancelledRows = createAuctionRows(cancelledAuctions);
    const participatedRows = createAuctionRows(participatedAuctions);

    const renderContent = () => {
      switch (activeTab) {
        case 'tab1':
          return <div>{ownedRows}</div>;
        case 'tab2':
          return <div>{cancelledRows}</div>;
        case 'tab3':
          return <div>{participatedRows}</div>;
        default:
          return <div>{ownedRows}</div>;
      }
    };

  return(
      <div className="layout_padding promoted_sectipon">
        <div className="container">
          <h1 className="promoted_text">My Auctions</h1>
          <div className="images_main">

          <div>
            <div className={styles.tabs}>
                <button className={activeTab === 'tab1' ? styles.tab_active : styles.tab} onClick={() => setActiveTab('tab1')}>Owned</button>
                <button className={activeTab === 'tab2' ? styles.tab_active : styles.tab} onClick={() => setActiveTab('tab2')}>Cancelled</button>
                <button className={activeTab === 'tab3' ? styles.tab_active : styles.tab} onClick={() => setActiveTab('tab3')}>Participated</button>
            </div>
            <select
                    className={styles.select}
                    onChange={(e) => setActiveTab(e.target.value)}
                    value={activeTab}
                >
                <option value="tab1">Tab 1</option>
                <option value="tab2">Tab 2</option>
                <option value="tab3">Tab 3</option>
            </select>

            {renderContent()}
          </div>
          </div>
        </div>
      </div>
  )
}


export default MyAuctions;
