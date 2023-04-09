const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

const validateSignUpParameters = (data) => {
    const body = JSON.parse(data);
    const { email, password, password_confirmation } = body;
    if (!email || !password || password !== password_confirmation)
        return false
    return true
}

const validateLoginParameters = (data) => {
    const body = JSON.parse(data);
    const { email, password } = body;
    if (!email || !password )
        return false
    return true
}

const deployDataToIPFS = (stringArr, imgArr) => {
  return new Promise(function(resolve, reject) {
     setTimeout(function() {
       resolve("&Dasia0!)kslakdjalhad-0as1");
       // else
       // reject(new Error("Something went wrong"));
     }, 3000);
   });
}


module.exports = {
  sendResponse, validateSignUpParameters, validateLoginParameters, deployDataToIPFS
}
