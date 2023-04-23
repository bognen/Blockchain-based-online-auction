import './../styles/submitadd.css';
import axios from 'axios';
import { create } from 'ipfs-http-client';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useNavigate  } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import MessageModal from './MessageModal';
import { UserContext } from './../Contexts/UserContext';


function SubmitAdd(){

  const navigate = useNavigate();
  const { loggedIn } = useContext(UserContext);
  // DialogModal Variables
  const [dialogModalTitle, setDialogModalTitle] = useState('');
  const [dialogModalBody, setDialogModalBody] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  useEffect(() => {
    // if(!loggedIn){
    //     navigate('/');
    //   }else if (!window.ethereum) {
    //     setDialogModalTitle("No Metamask Detected");
    //     setDialogModalBody("In order to proceed Metamask Extenetion need to be installed");
    //     setShowMessageModal(true);
    //     setMetamaskInstalled(false);
    // }
  }, [])

  const [auctionFormData, setAuctionFormData] = useState({
    name: '',
    pictures: '',
    desc: '',
    price: 0,
    step: 0,
    category: '',
    location: ''
  });
  //
  const submitForm = async (event) => {
console.log(auctionFormData);

  //   const ipfs = create({ host: process.env.REACT_APP_IPFS_URL, port: '5001', protocol: 'http' });
  //   const files = auctionFormData.pictures;
  //   const uploadedImages = [];
  //
  //   for (const file of files) {
  //       try {
  //           const addedFile = await ipfs.add(file);
  //           uploadedImages.push(addedFile.path);
  //       } catch (error) {
  //           console.error('Error uploading file:', error);
  //       }
  //   }
  //
  //   const stringObj = {
  //     name: auctionFormData.name,
  //     description: auctionFormData.desc,
  //     category: auctionFormData.category,
  //     location: auctionFormData.location,
  //     images: uploadedImages
  //   }
  //
  //   const textEncoder = new TextEncoder();
  //   const dataBuffer = textEncoder.encode(JSON.stringify(stringObj));
  //   const dataResult = await ipfs.add(dataBuffer);
  //   console.log("CID for Upload >> ", dataResult.cid.toString())
  //
  //   // Create a new FormData object
  //   const formData = new FormData();
  //
  //   formData.append('address', '0x4Af27cd88744C4db9954a187D834aE97d593670e');
  //   formData.append('privateKey', 'd22d65681e51efee2eb95319f26a12b4e5d9e02e24a62e2fbf3753a9ccc98340');
  //
  //   // Append form fields to formData
  //   formData.append('ipfsHash', dataResult.cid.toString());
  //   formData.append('promoted', auctionFormData.promoted);
  //   formData.append('start', auctionFormData.startTime);
  //   formData.append('end', auctionFormData.endTime);
  //   formData.append('price', auctionFormData.price);
  //   formData.append('step', auctionFormData.step);
  //
  //   // Send a POST request with formData as the request body
  //   try {
  //     const response = await axios.post(process.env.REACT_APP_REST_API_URL+'/api/create-auction',
  //     formData, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     console.log('Upload successful:', response.data);
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  }

  const auctionFormChange = (event) => {
    if (event.target.name === 'pictures') {
           const files = event.target.files;
           setAuctionFormData({ ...auctionFormData, pictures: files });
     }else{
         setAuctionFormData({
           ...auctionFormData,
           [event.target.name]: event.target.value,
         });
     }
  };

  const setPromoted = (event) => {
    setAuctionFormData({ ...auctionFormData, promoted: event.target.checked });
  }

  const setStartTime = (event) => {
    const date = new Date(event.$d);
    const timestamp = date.getTime() / 1000;
    setAuctionFormData({ ...auctionFormData, startTime: timestamp });
  }

  const setEndTime = (event) => {
    const date = new Date(event.$d);
    const timestamp = date.getTime() / 1000;
    setAuctionFormData({ ...auctionFormData, endTime: timestamp });
  }

  return(
    <div className="layout_padding promoted_sectipon">
      <div className="container" style={{width: "60%"}}>

      <MessageModal title={dialogModalTitle}
          body={dialogModalBody}
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
      />

        <div className="form-group submit-ad-form">
        <h1 style={{marginBottom:'25px'}}>Add New Listing</h1>
        <Form>
          <Form.Group className="row" controlId="auctionName">
            <Form.Label  className="col-lg-3 col-sm-12">Name:</Form.Label>
            <Form.Control type="text" placeholder="Auction name..." name="name"
                className="col-lg-5 col-sm-12 login-form-control"
                value={auctionFormData.name}
                onChange={auctionFormChange}/>
            <Form.Check className="col-lg-1 col-sm-12" type="checkbox" name="promoted" style={{paddingLeft:'2.25rem'}}
                label="Promote"
                value={auctionFormData.promoted}
                onChange={setPromoted}/>
          </Form.Group>
          <Form.Group className="row" controlId="pictures">
            <Form.Label  className="col-lg-3 col-sm-12">Upload Picture:</Form.Label>
            <Form.Control type="file" name="pictures" style={{ backgroundColor: '#e6e6e6' }}
                className="col-lg-9 col-sm-12 login-form-control"
                accept=".jpg,.png" multiple
                onChange={auctionFormChange}/>
          </Form.Group>

          <Form.Group className="row" controlId="auctionStartTime">
            <Form.Label className="col-lg-3 col-sm-6">Start Time:</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker name="startTime" onChange={setStartTime}  />
              </LocalizationProvider>
            <Form.Label className="col-lg-3 col-sm-6">End Time:</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker name="endTime" onChange={setEndTime}  />
              </LocalizationProvider>
          </Form.Group>
          <Form.Group className="row" controlId="auctionPics">
            <Form.Label  className="col-lg-3 col-sm-12">Description:</Form.Label>
            <Form.Control as="textarea" rows={3} name="desc"
                className="col-lg-9 col-sm-12 login-form-control"
                value={auctionFormData.desc}
                onChange={auctionFormChange}/>
          </Form.Group>
          <Form.Group className="row" controlId="auctionPrice">
            <Form.Label  className="col-lg-3 col-sm-12">Starting Price:</Form.Label>
            <Form.Control type="number" name="price"
                className="col-lg-3 col-sm-12 form-control"
                value={auctionFormData.price}
                onChange={auctionFormChange}/>
            <Form.Label  className="col-lg-3 col-sm-12">Increment:</Form.Label>
            <Form.Control type="number" name="step"
                className="col-lg-3 col-sm-12 form-control"
                value={auctionFormData.step}
                onChange={auctionFormChange}/>
          </Form.Group>
          <Form.Group className="row">
            <Form.Label  className="col-lg-3 col-sm-12">Location:</Form.Label>
            <Form.Select name="location" className="col-lg-3 col-sm-12 form-control"
              value={auctionFormData.location}
              onChange={auctionFormChange}>
                <option value="">Select a location</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="Australia&Oceania">Australia&Oceania</option>
            </Form.Select>
            <Form.Label  className="col-lg-3 col-sm-12">Category:</Form.Label>
            <Form.Select name="category" className="col-lg-3 col-sm-12 form-control"
              value={auctionFormData.category}
              onChange={auctionFormChange} >
                <option value="">Select a category</option>
                <option value="Auto Mobile">Auto Mobile</option>
                <option value="Fashion">Fashion</option>
                <option value="Mother&Child">Mother&Child</option>
                <option value="Jobs">Jobs</option>
                <option value="Real estate">Real estate</option>
                <option value="Pets">Pets</option>
                <option value="Sport">Sport</option>
                <option value="More">More</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="row">
          </Form.Group>
        </Form>
        <div className="row">
          <div className="col-md-12 text-center">
            <Button id="add-submit-button" type="button"
                className="btn btn-info" onClick={submitForm}>SUBMIT</Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}


export default SubmitAdd;
