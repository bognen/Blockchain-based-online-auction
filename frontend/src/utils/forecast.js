const request = require('request')

const forecast = (lon, lat, callback) => {
  const url = 'http://api.weatherstack.com/current?access_key=a9b1176f885a8d73f84ee153e33007aa&query='+lon+","+lat
  request({ url: url, json: true }, (error, { body }) => {
      if(error){
          console.log('An Error Occurred')
      } else if(body.error){
          console.log('Received wrong status code. Error - '+ body.error)
      } else {
          const temp = body.current.temperature;
          const feels = body.current.feelslike;
          console.log("Outside temperature is "+temp+", due to wind condition it feels like "+feels);
      }

  })
}

module.exports = forecast
