import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './../Contexts/UserContext';
import Carousel from 'better-react-carousel';
import { create } from "ipfs-http-client";
import './../styles/auction.css'

function Auction(){
  const { id } = useParams();
  const { loggedIn, account, token } = useContext(UserContext);
  const [userStatus, setUserStatus] = useState('');
  const [auctionCancelled, setAuctionCancelled] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [ipfsData, setIpfsData] = useState(null);
  const [images, setImages] = useState(null);
  const [lastBid, setLastBid] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Entry point method
  useEffect(() => {
      axios.get(process.env.REACT_APP_REST_API_URL+'/api/auction-details/'+id)
      .then(response => {
        setAuctionDetails(response.data.auction);
        setStartDate(new Date(response.data.auction.start * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }));
        setEndDate(new Date(response.data.auction.end * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }));
        fetchIpfsData(response.data.auction.hash);
        determineUserStatus(response.data.auction);
      }).catch(err => {
          console.log("An error occurred obtaining auction details")
      })
  }, [])

  // Use effect used to set IPFS data
  useEffect(() => {
    if (ipfsData && ipfsData.images) {
      let imgArr = []
      ipfsData.images.map((imageCID, index) => {
        imgArr.push(`http://${process.env.REACT_APP_IPFS_URL}:8080/ipfs/${imageCID}`);
      })
      setImages(imgArr)
      setCurrentImage(imgArr[0])
    }
    console.log(ipfsData)
  }, [ipfsData]);

  // The method fetches data from IPFS node
  const fetchIpfsData = async (hash) => {
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

      setIpfsData(jsonData);
    } catch (error) {
      console.error("Error fetching data from IPFS:", error);
    }
  };

  const determineUserStatus = (auction) => {
      if(loggedIn){
          if(account === auction.owner) setUserStatus("owner");
          else{
            axios.get(process.env.REACT_APP_REST_API_URL+'/api/auction-bidding-details/'+id, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }).then(resp => {
              if (resp.data.hasOwnProperty('active')){
                 setUserStatus("activeBidder");
                 setLastBid(resp.data.historical.bid);
              }else if (resp.data.hasOwnProperty('cancelled')) setUserStatus("cancelBidder")
              else if(resp.data.hasOwnProperty('historical') &&
                     !resp.data.hasOwnProperty('active') && !resp.data.hasOwnProperty('active')){
                        setUserStatus("refundedBidder")
                     }
              else setUserStatus('prospectiveBidder')
            }).catch(err => {
                console.log("An error occurred while retrieveing account bidding details")
                console.log(err)
            })
          }
      }
  }

  // Event Handlers
  const caruselImageClick = (image) => {
    setCurrentImage(image);
  };

  return(
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12">
            <img className="selected-image" src={currentImage} />
            {images && images.length > 0 &&
              <Carousel cols={images.length} rows={1} gap={10} loop>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img width="100%" src={image}
                       className={image == currentImage ? 'carousel-image-active' : 'carousel-image-inactive'}
                       onClick={() => caruselImageClick(image)} />
                </Carousel.Item>
                ))}
              </Carousel>
            }
        </div>
        <div className="auction-right-section col-lg-6 col-md-12">

          {ipfsData && (<h2 className="auction-name">{ipfsData.name}</h2>)}
          <label className="auction-label">listed by {auctionDetails.owner}</label>
          { startDate > new Date() ? (
              <div className="row">
                  <div className="col-3">Auction starts:</div>
                  <div className="col-9">{startDate}</div>
              </div>
            ) : ( endDate < new Date() ? (
                <div className="row">
                    <div className="col-3">Auction Ended:</div>
                    <div className="col-9">{endDate}</div>
                </div>
              ) : (
                <div className="row">
                    <div className="col-3">Auction Ends:</div>
                    <div className="col-9">{endDate}</div>
                </div>
              ))}
          <div className="bidding-section row">
              {auctionDetails.highestBid === 0 && ( <div className="col-3" style={{fontSize: "16px"}}>Starting Bid:</div>)}
              {auctionDetails.highestBid > 0 && ( <div className="col-3" style={{fontSize: "16px"}}>Current Bid:</div>)}
              <div className="col-5">
                  {auctionDetails.highestBid === 0 && (<h3>CAD {auctionDetails.price}</h3>)}
                  {auctionDetails.highestBid > 0 && (<h3>CAD {auctionDetails.highestBid}</h3>)}
                  { loggedIn && userStatus !== 'owner' && userStatus !== 'refundedBidder' && (
                    <div>
                      <input placeholder="Enter bid"  className="bid-input"/>
                      {auctionDetails.highestBid === 0 && ( <label className="auction-label">
                          Enter {parseInt(auctionDetails.price)+parseInt(auctionDetails.step)} or more</label>)}
                      {auctionDetails.highestBid > 0 && userStatus === 'prospectiveBidder' &&
                          ( <label className="auction-label">
                          Enter {parseInt(auctionDetails.highestBid)+parseInt(auctionDetails.step)} or more</label>)}
                      {auctionDetails.highestBid > 0 && userStatus === 'activeBidder' &&
                          ( <label className="auction-label">Your last bid was CAD {lastBid}. To overbid current price
                           enter {parseInt(auctionDetails.highestBid)-lastBid+parseInt(auctionDetails.step)} or more</label> )}
                    </div>
                  )}
              </div>
              <div className="col-4 button-container">
                  <span>[{auctionDetails.bidCount} bids]</span>
                  {userStatus === 'activeBidder' || userStatus === 'prospectiveBidder' && (
                    <button type="button" className="btn bid-button">Place Bid</button> )}
                  {userStatus === 'prospectiveBidder' && (
                    <button type="button" className="btn wish-button">Add to Wishlist</button> )}
                  {userStatus === 'owner' && (
                    <button type="button" className="btn wish-button">Cancel Auction</button> )}
                  {userStatus === 'activeBidder' && (
                    <button type="button" className="btn wish-button">Cancel Bid</button> )}
                  {userStatus === 'cancelBidder' && (
                    <button type="button" className="btn wish-button">Withdraw Funds</button> )}
              </div>
          </div>

          <div className="description-section row">
              <div className="col-3">Description:</div>
              {ipfsData && (<div className="col-9">{ipfsData.description}</div>)}
          </div>

          <div className="shipping-section row">
              <div className="col-3">Category:</div>
              {ipfsData && (<div className="col-9">{ipfsData.category}</div>)}
          </div>

          <div className="payments-section row">
              <div className="col-3">Location:</div>
              {ipfsData && (<div className="col-9">{ipfsData.location}</div>)}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Auction;


// Carusel documentation:
// https://reactjsexample.com/react-responsive-carousel-component-with-grid-layout-to-easily-create-a-carousel-like-photo-gallery/
