const AWS = require('aws-sdk')
const { sendResponse, validateSignUpParameters } = require("../utils/helper");

const cognito = new AWS.CognitoIdentityServiceProvider()

module.exports.handler = async (event) => {

      const isValid = validateSignUpParameters(event.body)
      if (!isValid)
        return sendResponse(400, { message: 'Invalid input' })

      const { email, password } = JSON.parse(event.body)
      const { user_pool_id, client_id } = process.env

      const params = {
        ClientId: client_id,
        Password: password,
        Username: email,
        UserAttributes: [
          {
            Name: 'email',
            Value: email
          }
        ]
      };

      try {

        const signUpData = await cognito.signUp(params).promise();
        console.log('Successfully signed up user:', signUpData);
        return sendResponse(200, { message: 'User registration successful' })
      }catch(e){
        const errorMessage = e.message ? e.message : 'Internal Server Error';
        return sendResponse(500, { errorMessage });
      }
}
