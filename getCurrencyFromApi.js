var client;
var currencyLayer;
var access_key = '23e32a3cc70242915ea25f64d480fbb7';
var endpoint = "latest";
var allCurrencies; // stores the currency response
// var baseCurrency = "GBP";

 function getCurrencies(baseCurrency) {
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
     for (var curr in allCurrencies.rates) {
        setCurrencyValue(curr, allCurrencies.rates[curr])
     }
     countriesjs = new L.geoJson(countries, {
         onEachFeature: onEachFeature,
         style: style
     }).addTo(mymap);
     mymap.setMaxBounds(countriesjs.getBounds());
}

 function setCurrencyValue(id, currencyValue) {
    countries[0].features.forEach(function (country) {
        if (country.properties.currency == id) {
            country.properties.value = currencyValue;
             console.log(country.properties)
            return;
        }
    });
}


    //  for (var i = 0; i < countries[0].features.length; i++) {
    //      if (countries[0].features[i].properties.ISO_A3 == id) {
    //          countries[0].features[i].properties.value = currencyValue;
    //         //  console.log(countries[0].features[i].properties.value, currencyValue)
    //          return;
    //      } else {
    //          continue
    //         //  console.log(countries[0].features[i].properties.ISO_A3)
    //         //  console.log("No data" + id +  countries[0].features[i].properties.currency)
    //      }
    //  }

    // countries = countries[0].features.properties.update(
    //     list.findIndex(function (item) {
    //         return item.get("currency") === id;
    //     }),
    //     function (item) {
    //         return item.set("value", currencyValue);
    //     }
    // );
