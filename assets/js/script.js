//Todo: Add API key from Open Weather Map

var APIKEY = '60729b3ac3b4a0272d0eff20d53db5a2';
window.location.href = 'https://bslockhart.github.io/Weather-Dashboard-Outlook/?#';

//Todo: Extract Long/Lat of a city when searched. // Extracts the Longitude and Latitude of a city that the client searches up THEN execute the MAIN fetch function
var extractGeoData = async (searchedCity) => {
  try {
    //Todo: Update the URL with the searched city and include the API key
    var url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchedCity}&limit=5&appid=${APIKEY}`;
    var res = await fetch(url);
    var location = await res.json();

    if (location.length == 0 || location == null || location == undefined) {
      alert('Please type a valid city');
    } else {
      //Todo: Make sure we ONLY store the valid data
      checkHistoryBtns(searchedCity);
      fetchWeather(location[0].lat, location[0].lon, location[0].name);
    }
    //Todo: If there is no network connection, execute the catch block function
  } catch (error) {
    alert('Failed to connect to API due to network issues');
  }
};