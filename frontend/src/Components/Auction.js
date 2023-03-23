import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Carousel from 'better-react-carousel';

import './../styles/auction.css'


const images = [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
  "https://picsum.photos/800/600?random=3",
  "https://picsum.photos/800/600?random=4",
];

function Auction(){
  const { id } = useParams();

  const [currentImage, setCurrentImage] = useState(images[0]);

  const caruselImageClick = (image) => {
    setCurrentImage(image);
  };

  return(
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12">
            <img className="selected-image" src={currentImage} />
            <Carousel cols={images.length} rows={1} gap={10} loop>
            {images.map((image, index) => (
              <Carousel.Item key={index}>
                <img width="100%" src={image}
                     className={image == currentImage ? 'carousel-image-active' : 'carousel-image-inactive'}
                     onClick={() => caruselImageClick(image)} />
              </Carousel.Item>
              ))}
            </Carousel>
        </div>
        <div className="auction-right-section col-lg-6 col-md-12">

          <h2 className="auction-name">CENTRAL AFRICAN REPUBLIC banknote 1000 Francs {id}</h2>
          <label className="auction-label">listed by Unknown</label>
          <div className="bidding-section row">
              <div className="col-3" style={{fontSize: "16px"}}>Starting bid:</div>
              <div className="col-5">
                  <h3>CAD 75</h3>
                  <input placeholder="Enter bid"  className="bid-input"/>
                  <label className="auction-label">Enter 75 or more</label>
              </div>
              <div className="col-4 button-container">
                  <span>[3 bids]</span>
                  <button type="button" className="btn bid-button">Place Bid</button>
                  <button type="button" className="btn wish-button">Add to Wishlist</button>
              </div>
          </div>

          <div className="description-section row">
              <div className="col-3">Description:</div>
              <div className="col-9">Very good very nice</div>
          </div>

          <div className="shipping-section row">
              <div className="col-3">Shipping:</div>
              <div className="col-9">International shipment of items may be subject to customs processing and additional charges</div>
          </div>

          <div className="payments-section row">
              <div className="col-3">Payments:</div>
              <div className="col-9">Bitcoin, Ethereum, Dogecoin, Cardano</div>
          </div>



        </div>
      </div>
    </div>
  )
}

export default Auction;


// Carusel documentation:
// https://reactjsexample.com/react-responsive-carousel-component-with-grid-layout-to-easily-create-a-carousel-like-photo-gallery/
