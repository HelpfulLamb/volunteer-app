const dotenv = require('dotenv');
dotenv.config({path: './.env'});

async function getDistance(volunteerAddress, eventAddress) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(volunteerAddress)}&destinations=${encodeURIComponent(eventAddress)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  if(
    data.rows &&
    data.rows[0] &&
    data.rows[0].elements &&
    data.rows[0].elements[0] &&
    data.rows[0].elements[0].status === 'OK'
  ) {
    return data.rows[0].elements[0].distance.value;
  } else {
    console.error('Google Maps API response error:', JSON.stringify(data, null, 2));
    throw new Error('Invalid distance data received from API');
  }
}

module.exports = {
    getDistance
};