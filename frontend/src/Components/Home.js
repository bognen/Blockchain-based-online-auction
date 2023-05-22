import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import AuctionBlock from './AuctionBlock.js';
import { fetchIpfsData } from "./../utils/utils.js";
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import alertify from 'alertifyjs';


function Home(){

  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [searchLocation, setSearchLocation] = useState('default');
  const [searchCategory, setSearchCategory] = useState('default');

  useEffect(() => {
      axios.get(process.env.REACT_APP_REST_API_URL+'/api/get-all-auctions/four')
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
            alertify.error("Cannot Obtain List of Auctions");
            console.log(err);
            console.log(err.response.data);
        })
  }, [])

  const rows = [];
  for (let i = 0; i < auctions.length; i += 4) {
      const rowAuctions = auctions.slice(i, i + 4);
      rows.push(
        <div className="row" key={`row-${i}`}>
          { rowAuctions.map((auction) => (
            <AuctionBlock key={auction.address} img={auction.img} category={auction.category} address={auction.address} promoted={auction.promoted}
                startPrice={auction.startPrice} highestBid={auction.highestBid} bids={auction.bids} />
          ))}
        </div>);
  }

  const searchButtonClick = () => {
    console.log("Click");
  }

  return(
    <div>
      <div className="layout_padding banner_section">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1 className="banner_taital">All You Need Is Here & Classified</h1>
              <p className="browse_text">Browse from more than 15,000,000 adverts while new ones come on daily bassis</p>
              <div className="banner_bt">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="search_box">
          <div className="row">
            <div className="col-sm-3">
              <div className="form-group">
                            <input type="text" className="email_boton" placeholder="Search for" name="Email" />
                        </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
              <select name="Location" className="email_boton home_select" value={searchLocation} onChange={(event) => setSearchLocation(event.target.value)}>
                  <option value="default">Select a location</option>
                  <option value="North America">North America</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Australia&Oceania">Australia&Oceania</option>
              </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <select name="category" className="email_boton home_select" value={searchCategory} onChange={(event) => setSearchCategory(event.target.value)}>
                    <option value="default">Select a category</option>
                    <option value="Auto Mobile">Auto Mobile</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Mother&Child">Mother&Child</option>
                    <option value="Jobs">Jobs</option>
                    <option value="Real estate">Real estate</option>
                    <option value="Pets">Pets</option>
                    <option value="Sport">Sport</option>
                    <option value="More">More</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                  <button className="search_bt"
                  onClick={() => navigate(`/browse?category=${searchCategory}&location=${searchLocation}`)}>Search</button>
              </div>
            </div>
            <div className="fashion_menu">
                          <ul>
                            <li className="active"><a href="#">Auto Mobile</a></li>
                            <li><a href="#">Fashion</a></li>
                            <li><a href="#">Mother&Child</a></li>
                            <li><a href="#">Jobs</a></li>
                            <li><a href="#">Real estate</a></li>
                            <li><a href="#">Pets</a></li>
                            <li><a href="#">Sport</a></li>
                            <li><a href="#">More</a></li>
                          </ul>
                        </div>
          </div>
        </div>
      </div>
      <div className="layout_padding promoted_sectipon">

      <div className="container">
        <h1 className="promoted_text">PROMOTED <span style={{borderBottom: '5px solid #4bc714'}}>ADS</span></h1>
        <div className="images_main">{rows}</div>
      </div>
      </div>

    </div>

  )
}

export default Home;
