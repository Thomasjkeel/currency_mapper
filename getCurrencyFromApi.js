var client;
var currencyLayer;
var access_key = '23e32a3cc70242915ea25f64d480fbb7';
var endpoint = "latest";
var allCurrencies; // stores the currency response
var baseCurrency = "GBP";
var lastCurrency = "EUR";
var currentCurrency;

 function getCurrencies(baseCurrency) {
     if (lastCurrency == baseCurrency){
         console.log("Same as last currency so map is not updating")
         return
     } else {
        lastCurrency = baseCurrency;
     }

     client = new XMLHttpRequest();
     // make client request
     var url = 'http://data.fixer.io/api/' + endpoint + '?access_key=' + access_key + '&base=' + baseCurrency;
     client.open('GET', url);
     client.onreadystatechange = currenciesResponse; // earthquakeRepsonse is a method
     client.send();
 };

 // create code to wait for response from the server and process it when recieved
 function currenciesResponse() {
     // listener
     if (client.readyState == 4) {
         var currenciesData = client.responseText;
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
        country.properties.value = NaN;
    });

     for (var curr in allCurrencies.rates) {
        setCurrencyValue(curr, allCurrencies.rates[curr])
     }
     if (countriesjs) {
        countriesjs.remove();
        console.log("Previous layer removed")
    }
     countriesjs = new L.geoJson(countries, {
         onEachFeature: onEachFeature,
         style: style
        }).addTo(mymap);
     mymap.setMaxBounds(countriesjs.getBounds());
    }

 function setCurrencyValue(id, currencyValue) {
    // loop through and update the values of the GeoJSON
    var returned = false
    countries[0].features.forEach(function (country) {
        if (country.properties.currency == id) {
            country.properties.value = currencyValue;
            returned = true;
            return true;
        }
    });
    // give a default value
    if (!returned) {
        return false
    }       
}