import './../styles/submitadd.css'

function SubmitAdd(){

  return(
      <div className="container" style={{width: "60%"}}>

        <h1>Add New Listing</h1>
        <div className="form-group submit-ad-form">
          <div className="row">
            <label className="col-lg-3 col-sm-12" for="name">Name:</label>
            <input name="name" id="name" className="col-lg-9 col-sm-12 form-control" type="text" />
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" for="pictureUpload">Upload Picture:</label>
            <input type="file" class="col-lg-9 col-sm-12 form-control-file" id="pictureUpload" name="pictureUpload" accept=".jpg,.png" multiple/>
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" for="desc">Description:</label>
            <textarea class="col-lg-9 col-sm-12 form-control" id="desc" rows="3"></textarea>
          </div>
          <div className="row">
            <label className="col-lg-3 col-sm-12" for="price">Starting Price:</label>
            <input name="price" id="price" className="col-lg-3 col-sm-12 form-control" type="number"/>

            <label className="col-lg-3 col-sm-12" for="increment">Increment:</label>
            <input name="increment" id="increment" className="col-lg-3 col-sm-12 form-control" type="number"/>
          </div>

          <div className="row">
            <label className="col-lg-3 col-sm-12" for="ship">Shipping Details:</label>
            <textarea class="col-lg-9 col-sm-12 form-control" id="ship" rows="3"></textarea>
          </div>

          <div className="row">
            <label className="col-lg-3 col-sm-12" for="payment">Accepted Payments:</label>
            <select select multiple class="col-lg-9 col-sm-12 form-control" id="payment">
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>Dogecoin</option>
              <option>Monero</option>
              <option>Cardano</option>
            </select>
          </div>
          <div className="row">
            <div className="col-md-12 text-center">
              <button id="add-submit-button" type="button" className="btn btn-info">SUBMIT</button>
            </div>
          </div>
        </div>
      </div>
  )
}


export default SubmitAdd;
