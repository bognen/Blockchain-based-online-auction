const { sendResponse, deployDataToIPFS } = require("../utils/helper");

// module.exports.handler = async (event) => {
//     return sendResponse(200, { message: `Email ${event.requestContext.authorizer.claims.email} has been authorized` })
// }

module.exports.handler = async (event) => {
    let imgArr = []
    let strArr = []
    try {
      let ipfsHash = await deployDataToIPFS(strArr, imgArr);
      console.log("Response Received");
      //return sendResponse(200, { message: `Success: ${ipfsHash}` });
      return sendResponse(200, { message: `Email ${event.requestContext.authorizer.claims.email} has been authorized. Received Responnse ${ipfsHash}` })
    } catch (err) {
      console.log("Something went wrong");
      console.log(err);
      const errorMessage = err.message ? err.message : 'Internal Server Error rertret';
      return sendResponse(500, { errorMessage });
    }
}
