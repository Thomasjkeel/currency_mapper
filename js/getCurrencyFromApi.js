/* This File contains functions pertaining to getting the data from the API and loading the map layer*/

var client; // stores the request to the API 
var currencyLayer; // API response layer
var access_key = '23e32a3cc70242915ea25f64d480fbb7'; // this is my private API -> the code will not work without this API key
var allCurrencies; // stores the currency response from the API
var baseCurrency = "GBP";
var lastCurrency = "EUR";
var currentCurrency = "GBP";

function getCurrencies(baseCurrency) {
     if (lastCurrency == baseCurrency){
         console.log("Selected Country uses the same currency as last currency so map is not updating")
         return
     } else {
        lastCurrency = baseCurrency;
     }

     client = new XMLHttpRequest();
     // make client request from FIXER.IO Live Currency API
     var url = 'http://data.fixer.io/api/latest' + '?access_key=' + access_key + '&base=' + baseCurrency;
     client.open('GET', url);
     client.onreadystatechange = currenciesResponse; // runs the response function
     client.send();
 };

// create code to wait for response from the server and process it when recieved
function currenciesResponse() {
     // listener
     if (client.readyState == 4) {
         var currenciesData = client.responseText;
         console.log("loading GeoJSON layer")
         loadCurrencieslayer(currenciesData);
     }
 }
 
// convert the received data - which is text - to JSON format and add it to the map
function loadCurrencieslayer(currenciesData) {
     // parse the response to JSON
     allCurrencies = JSON.parse(currenciesData);
     updateCurrencieslayer(allCurrencies);
}

function updateCurrencieslayer(allCurrencies) {
countries[0].features.forEach(function (country) {
    country.properties.value = "Data Not Available";
});
// loop through all the currencies and update the 'value' property on the GeoJSON layer for each country
    for (var curr in allCurrencies.rates) {
        setCurrencyValue(curr, allCurrencies.rates[curr])
    }
    // remove previous country GeoJSON layer
    if (countriesjs) {
    countriesjs.remove();
    console.log("Previous layer removed")
}
// update current layer
    countriesjs = new L.geoJson(countries, {
        onEachFeature: onEachFeature,
        style: style
    }).addTo(mymap);
    mymap.setMaxBounds(countriesjs.getBounds());
}

// map the currency value from the API request to the GeoJSON (has the effect of updating the value property each of the countries)
function setCurrencyValue(id, currencyValue) {
    // loop through and update the values of the GeoJSON
    countries[0].features.forEach(function (country) {
        if (country.properties.currency == id) {
            country.properties.value = currencyValue;
            return;
        }
    });    
}
