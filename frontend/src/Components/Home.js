//Temporary images
import img1 from './../images/img-1.png';
import img2 from './../images/img-2.png';
import img3 from './../images/img-3.png';
import img4 from './../images/img-4.png';

import eye_icon from './../images/eye-icon.png';
import like_icon from './../images/like-icon.png';

function Home(){

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
              <select name="Location" className="email_boton home_select">
                  <option value="">Select a location</option>
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
                <select name="category" className="email_boton home_select">
                    <option value="">Select a category</option>
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
                            <button className="search_bt">Search</button>
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
      <div className=" layout_padding promoted_sectipon">
      <div className="container">
        <h1 className="promoted_text">PROMOTED <span style={{borderBottom: '5px solid #4bc714'}}>ADS</span></h1>
        <div className="images_main">
          <div className="row">
          <div className="col-sm-6 col-md-6 col-lg-3">
             <div className="images"><img src={img1} style={{ width: '100%' }} /></div>
             <button className="promoted_bt">PROMOTED</button>
             <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
             <div className="numbar_text">30<span className="like-icon">01</span></div>
             <button className="mobile_bt"><a href="#">Mobiles</a></button>
          </div>
          <div className="col-sm-6 col-md-6 col-lg-3">
             <div className="images"><img src={img2} style={{ width: '100%' }} /></div>
             <button className="promoted_bt">PROMOTED</button>
             <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
             <div className="numbar_text">30<span className="like-icon">01</span></div>
             <button className="mobile_bt"><a href="#">Cyicals</a></button>
           </div>
           <div className="col-sm-6 col-md-6 col-lg-3">
             <div className="images"><img src={img3} style={{ width: '100%' }} /></div>
             <button className="promoted_bt">PROMOTED</button>
             <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
             <div className="numbar_text">30<span className="like-icon">01</span></div>
             <button className="mobile_bt"><a href="#">Cars</a></button>
           </div>
           <div className="col-sm-6 col-md-6 col-lg-3">
             <div className="images"><img src={img4} style={{ width: '100%' }} /></div>
             <button className="promoted_bt">PROMOTED</button>
             <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
             <div className="numbar_text">30<span className="like-icon">01</span></div>
             <button className="mobile_bt"><a href="#">Laptops</a></button>
           </div>


          </div>
        </div>
      </div>
      </div>

    </div>

  )
}

export default Home;
