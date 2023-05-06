import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BlockingContext } from './../App';
import { UserContext } from './../Contexts/UserContext';
import Carousel from 'better-react-carousel';
import SignModal from './SignModal';
import { create } from "ipfs-http-client";
import './../styles/auction.css'
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import alertify from 'alertifyjs';

function Auction(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { loggedIn, account, token } = useContext(UserContext);
  const setBlocking = useContext(BlockingContext);
  const [userStatus, setUserStatus] = useState('');
  const [auctionCancelled, setAuctionCancelled] = useState(false);
  const [updateAuction, setUpdateAuction] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [ipfsData, setIpfsData] = useState(null);
  const [images, setImages] = useState(null);
  const [lastBid, setLastBid] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [showSignModal, setShowSignModal] = useState(false);
  const [requestAction, setRequestAction] = useState();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Entry point method
  useEffect(() => {
      axios.get(process.env.REACT_APP_REST_API_URL+'/api/auction-details/'+id)
      .then(response => {
        console.log(response)
        setAuctionDetails(response.data.auction);
        setStartDate(new Date(response.data.auction.startTime * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
          }));
        setEndDate(new Date(response.data.auction.endTime * 1000).toLocaleString('en-US', {
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
  }, [updateAuction])

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
          if(account === auction.auctionOwner) setUserStatus("owner");
          else{
            axios.get(process.env.REACT_APP_REST_API_URL+'/api/auction-bidding-details/'+id, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }).then(resp => {
              if (resp.data.hasOwnProperty('active') && new Date(endDate) > new Date()){
                  setUserStatus("activeBidder");
                  setLastBid(resp.data.historical.bid);
              }else if (resp.data.hasOwnProperty('active') && new Date(endDate) < new Date()
                        && auctionDetails.bidder === account){
                  setUserStatus("winner");
                  setLastBid(resp.data.historical.bid);
              }else if (resp.data.hasOwnProperty('cancelled')){
                 setUserStatus("cancelBidder")
              }else if(resp.data.hasOwnProperty('historical') &&
                     !resp.data.hasOwnProperty('active') && !resp.data.hasOwnProperty('active')){
                        setUserStatus("refundedBidder")
                     }
              else setUserStatus('prospectiveBidder')
            }).catch(err => {
                console.log("An error occurred while retrieveing account bidding details")
            })
          }
      }
  }

  // Event Handlers
  const caruselImageClick = (image) => {
      setCurrentImage(image);
  };

  // Button Event Handlers
  const postRequest = (privateKey) =>{

      setShowSignModal(false);
      let uri;
      let body;
      let successMessage;
      switch(requestAction){
          case 'placeBid':
            uri = 'place-bid';
            body = {
              address: account,
              privateKey: privateKey,
              bidAmount: bidAmount
            }
            successMessage = 'You Bid Successfully Placed';
            break;
          case 'cancelAuction':
            uri = 'cancel-auction';
            body = {
              address: account,
              privateKey: privateKey
            }
            successMessage = 'Auction Successfully Cancelled';
            break;
          case 'cancelBid':
            uri = 'cancel-bid';
            body = {
              address: account,
              privateKey: privateKey
            }
            successMessage = 'Your Bid Successfully Cancelled';
            break;
          case 'withdrawFunds':
            uri = 'withdraw-funds'
            successMessage = 'Your Funds Were Withdrawn';
            body = {
              address: account,
              privateKey: privateKey,
              isCancelled: true
            }
            break;
          default:
            console.log("Something went wrong");
            alertify.error("An Error Occurred");
      }

      if(uri){
          axios.post(process.env.REACT_APP_REST_API_URL+'/api/'+uri+'/'+id, body, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }).then(response => {
            setTimeout(() => {
                  setBlocking(false);
                  alertify.success(successMessage);
                  setUpdateAuction(!updateAuction);
                  if(requestAction == 'cancelAuction') navigate('/');
              }, 2000);
          }).catch(err => {
              setBlocking(false);
              console.log(`An error: ${err}`)
              if(err.response){
                console.log(`An error occurred ${err.response.data.errorMessage}`)
                const errMess = err.response.data.errorMessage.length < 80
                              ? err.response.data.errorMessage
                              : err.response.data.errorMessage.substring(0, 77)+"...";
                alertify.error(errMess);
              }
          })
      }
  }

  return(
    <div className="container">
      <div className="row">
      <SignModal signModalTitle="Please, Sign The Transaction" signModalInput="Private Key"
        onShow={showSignModal} onHide={() => setShowSignModal(false)}
        onConfirm={(key) => { setBlocking(true); postRequest(key); }}/>
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
          <label className="auction-label">listed by {auctionDetails.auctionOwner}</label>

          { new Date(startDate) > new Date() ? (
              <div className="row">
                  <div className="col-3">Auction starts:</div>
                  <div className="col-9">{startDate}</div>
              </div>
            ) : ( new Date(endDate) < new Date() ? (
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
              {auctionDetails.highestBid == 0 && ( <div className="col-3" style={{fontSize: "16px"}}>Starting Bid:</div>)}
              {auctionDetails.highestBid > 0 && ( <div className="col-3" style={{fontSize: "16px"}}>Current Bid:</div>)}
              <div className="col-5">
                  {auctionDetails.highestBid == 0 && (<h3>{auctionDetails.price} ETH</h3>)}
                  {auctionDetails.highestBid > 0 && (<h3>{auctionDetails.highestBid} ETH</h3>)}
                  { loggedIn && userStatus !== 'owner' && userStatus !== 'refundedBidder' && (
                    <div>
                      {(userStatus !== 'owner' && !auctionDetails.cancelled && userStatus !== 'cancelBidder') && (
                          <input placeholder="Enter bid"  className="bid-input" onChange={(event) => setBidAmount(event.target.value)}/>)}
                      {auctionDetails.highestBid === 0 && ( <label className="auction-label">
                          Enter {parseInt(auctionDetails.price)+parseInt(auctionDetails.step)} or more</label>)}
                      {auctionDetails.highestBid > 0 && userStatus === 'prospectiveBidder' &&
                          ( <label className="auction-label">
                          Enter {parseInt(auctionDetails.highestBid)+parseInt(auctionDetails.step)} or more</label>)}
                      {auctionDetails.highestBid > 0 && userStatus === 'activeBidder' &&
                          ( <label className="auction-label">Your last bid was {lastBid} ETH. To overbid current price
                           enter {parseInt(auctionDetails.highestBid)-lastBid+parseInt(auctionDetails.step)} or more</label> )}
                    </div>
                  )}
              </div>
              <div className="col-4 button-container">
                  <span>[{auctionDetails.bidCount} bids]</span>
                  {(userStatus === 'activeBidder' || userStatus === 'prospectiveBidder') && (
                    <button type="button" className="btn bid-button"
                            onClick={() => { setShowSignModal(true); setRequestAction("placeBid"); }}>Place Bid</button> )}
                  {userStatus === 'prospectiveBidder' && (
                    <button type="button" className="btn wish-button">Add to Wishlist</button> )}
                  {userStatus === 'owner' && (
                    <button type="button" className="btn wish-button"
                            onClick={() => { setShowSignModal(true); setRequestAction("cancelAuction"); }}>Cancel Auction</button> )}
                  {userStatus === 'activeBidder' && (
                    <button type="button" className="btn wish-button"
                          onClick={() => { setShowSignModal(true); setRequestAction("cancelBid"); }}>Cancel Bid</button> )}
                  {(userStatus === 'cancelBidder' || (userStatus === 'owner' && new Date(endDate) < new Date() && !auctionDetails.cancelled)
                    || (userStatus === 'activeBidder' && new Date(endDate) < new Date()) || (userStatus === 'activeBidder' && auctionDetails.cancelled)) && (
                    <button type="button" className="btn wish-button"
                          onClick={() => { setShowSignModal(true); setRequestAction("withdrawFunds");}}>Withdraw Funds</button> )}
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
