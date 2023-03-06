

function About(){
  return(
    <div class="layout_padding about_section">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1 className="about_taital">About Our Auction</h1>
            <p className="lorem_text">
            Our auction is a model of a decentralized, dynamic auction market platform (e.g., eBay) in which a continuum of buyers and sellers participate in simultaneous, single-unit auctions each period. Our model accounts for the endogenous entry of agents and the impact of intertemporal optimization on bids. We estimate the structural primitives of our model using Kindle sales on eBay. We find that just over-one third of Kindle auctions on eBay result in an inefficient allocation with deadweight loss amounting to 14% of total possible market surplus.

      We also find that partial centralization–for example, running half as many 2-unit, uniform-price auctions each day–would eliminate a large fraction of the inefficiency, but yield slightly lower seller revenues. Our results also highlight the importance of understanding platform composition effects–selection of agents into the market–in assessing the implications of market redesign. We also prove that the equilibrium of our model with a continuum of buyers and sellers is an approximate equilibrium of the analogous model with a finite number of agents.
            </p>
          </div>
        </div>
      </div>
    </div>

  )
}

export default About;
