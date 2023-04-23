// In your AWS Lambda function
//const IPFS = require('ipfs-core');

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

module.exports = {
  sendResponse, validateSignUpParameters, validateLoginParameters
}
