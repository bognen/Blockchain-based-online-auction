import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Carousel from 'better-react-carousel';
import { create } from "ipfs-http-client";
import './../styles/auction.css'


function Auction(){
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState({});
  const [ipfsData, setIpfsData] = useState(null);
  const [images, setImages] = useState(null);

  // Entry point method
  useEffect(() => {
      axios.post(process.env.REACT_APP_REST_API_URL+'/api/auction-details/'+id)
      .then(response => {
        setAuctionDetails(response.data.auction);
        fetchIpfsData(response.data.auction.hash);
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
          <div className="bidding-section row">
              <div className="col-3" style={{fontSize: "16px"}}>Starting bid:</div>
              <div className="col-5">
                  <h3>CAD {auctionDetails.price}</h3>
                  <input placeholder="Enter bid"  className="bid-input"/>
                  <label className="auction-label">Enter {parseInt(auctionDetails.price)+parseInt(auctionDetails.step)} or more</label>
              </div>
              <div className="col-4 button-container">
                  <span>[{auctionDetails.bidCount} bids]</span>
                  <button type="button" className="btn bid-button">Place Bid</button>
                  <button type="button" className="btn wish-button">Add to Wishlist</button>
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
