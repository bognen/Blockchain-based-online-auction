import chevron_arrow from './images/chevron-arrow.png';
import footer_logo from './images/footer-logo.png';
import map_flag from './images/map-flag.png';
import email_icon from './images/email-icon.png';
import phone_icon from './images/phone-icon.png';

function Footer(){

  return(
    <div>
      <div className="layout_padding footer_section">
    		<div className="container">
    			<div className="row">
    				<div className="col-sm-6 col-md-6 col-lg-3">
    					<div><img src={footer_logo} /></div>
    					<p className="dolor_text">dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et sdolor sit amet,</p>
    				</div>
    				<div className="col-sm-6 col-md-6 col-lg-3">
    					<h1 className="quick_text">Quick links</h1>
    					<div className="chevron_arrow"><img src={chevron_arrow}/><span className="padding-left">Join Us</span></div>
    					<div className="chevron_arrow"><img src={chevron_arrow}/><span className="padding-left">Maintenance</span></div>
    					<div className="chevron_arrow"><img src={chevron_arrow}/><span className="padding-left">Language Packs</span></div>
    					<div className="chevron_arrow"><img src={chevron_arrow}/><span className="padding-left">LearnPress</span></div>
    					<div className="chevron_arrow"><img src={chevron_arrow}/><span className="padding-left">Release Status</span></div>
    				</div>
    				<div className="col-sm-6 col-md-6 col-lg-3">
    					<h1 className="subscribe_text">Subcribe email</h1>
    					<p className="ipsum_text">Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
    					<input type="text" className="email_text" placeholder="Your Email" name="Name" />
    					<button className="submit_text">Submit</button>
    				</div>
    				<div className="col-sm-6 col-md-6 col-lg-3">
    					<h1 className="quick_text">Contact Us</h1>
    					<div className="map_flag"><img src={map_flag.png}/><span className="padding-left" style={{textAlign: 'left'}}>Instytutska 11, Khmelnytskyi, UKRAINE</span></div>
    					<div className="dolor_text"><img src={email_icon.png}/><span className="padding-left">dima.bognen@gmail.com</span></div>
    					<div className="dolor_text"><img src={phone_icon.png}/><span className="padding-left">+38038998877</span></div>
    				</div>
    			</div>
    		</div>
    	</div>
      <div className="copyright">
        <p className="copyright_text">2023 All Rights Reserved. Final Project for Khmelnytskyi National University</p>
      </div>
    </div>
  )
}

export default Footer;
