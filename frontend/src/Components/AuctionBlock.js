import React from 'react';
import { Link } from 'react-router-dom';
import eye_icon from './../images/price-icon.png';
import like_icon from './../images/bid.png';

function AuctionBlock ({img, category, address, promoted, startPrice, highestBid, bids}){
  bids = Number(bids) < 10 ? "0"+bids.toString() : bids;
  return(
      <div className="col-sm-6 col-md-6 col-lg-3" style={{marginTop: '15px'}}>
        <div className="images">
          <img src={`http://${process.env.REACT_APP_IPFS_URL}:8080/ipfs/${img}`} style={{ width: '100%' }} />
        </div>
        {promoted && <button className="promoted_bt">PROMOTED</button>}
        <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
        {highestBid == 0 ? (
          <div className="numbar_text">{startPrice}<span className="like-icon">{bids}</span></div>
        ):(
          <div className="numbar_text">{highestBid}<span className="like-icon">{bids}</span></div>
        )  }

        <button className="mobile_bt"><Link to={`/auction/${address}`}>{category}</Link></button>
      </div>
  )
}

export default AuctionBlock;
