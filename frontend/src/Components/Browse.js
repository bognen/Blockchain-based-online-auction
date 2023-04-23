import { Link } from 'react-router-dom';

//Temporary images
import img1 from './../images/img-1.png';
import img2 from './../images/img-2.png';
import img3 from './../images/img-3.png';
import img4 from './../images/img-4.png';

import eye_icon from './../images/eye-icon.png';
import like_icon from './../images/like-icon.png';

function Browse(){

  return(
      <div className="layout_padding promoted_sectipon">
        <div className="container">
          <h1 className="promoted_text">ABA <span style={{borderBottom: '5px solid #4bc714'}}>ADS</span></h1>
          <div className="images_main">
              <div className="row">
              <div className="col-sm-6 col-md-6 col-lg-3">
                 <div className="images"><img src={img1} style={{ width: '100%' }} /></div>
                 <button className="promoted_bt">PROMOTED</button>
                 <div className="eye-icon"><img src={eye_icon}/><span className="like-icon"><img src={like_icon}/></span></div>
                 <div className="numbar_text">30<span className="like-icon">01</span></div>
                 <button className="mobile_bt"><Link to={`/auction/0xf5755431bfF3224976D531284cbFB6a4687aec32`}>TEST ITEM</Link></button>
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
  )
}


export default Browse;
