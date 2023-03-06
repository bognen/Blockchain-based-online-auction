const request = require('request')

const geocode = (address, callback) => {
  const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoic3RhcnR1cGlua20iLCJhIjoiY2wwdzFranM3MWNlaTNvcDRib3BpejF0ZCJ9.4MAVDzD-TgXYdGhJoxl4Uw'
  request({ url: url, json: true }, (error, { body }) => {
      if(error){
        callback('An Error Occurred', undefined)
      } else if(body.features.length === 0){
        callback('Received wrong status code. Error - '+ body.error, undefined)
      }else{
        callback(undefined, {
          latitude: body.features[0].center[1],
          longitude: body.features[0].center[0],
          location: body.features[0].place_name
        })

      }
  })
}

module.exports = geocode
