/* This File contains functions pertaining to updating and styling of the map */

/* STYLING OF GeoJSON layer. ADAPTED FROM: https: //leafletjs.com/examples/choropleth/*/
function style(feature) {
    return {
        fillColor: getColor(feature.properties.value), // gets the color based on the value of currency compared with base
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

// Function for mapping colors to the currency values returned from the API for each country
function getColor(d) {
    return d > 10000 ? '#540018' :
        d > 1000 ? '#800026' :
        d > 100 ? '#BD0026' :
        d > 10 ? '#E31A1C' :
        d > 5 ? '#FC4E2A' :
        d > 2 ? '#FD8D3C' :
        d > 1 ? '#FEB24C' :
        d > 0.5 ? '#FED976' :
        d > 0.1 ? '#ffe296' :
        d > 0.01 ? '#ffefc4' :
        d > 0.001 ? '#fff7e2' :
        d > 0.00001 ? '#f9f7ef' :
        '#d3d1c6';
}

/* USER INTERACTION WITH GEOJSON LAYER. ADAPTED FROM: https: //leafletjs.com/examples/choropleth/ */
// function that sets rules for user interaction with the GeoJSON layer
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: setCurrency,
        dblclick: zoomToFeature
    });
}

// listener that highlights a country that is hovered over
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

// event listener for resetting highlight of country
function resetHighlight(e) {
    countriesjs.resetStyle(e.target);
    info.update(); 
}

// sets the currency code to pass to the API request (in getCurrencyFromApi.js) which will update the when a country has been clicked
function setCurrency(e) {
    currentCurrency = e.target.feature.properties.currency;
    console.log(currentCurrency);
    getCurrencies(currentCurrency)
    // highlightFeature(e);
}

// double clicking will zoom to the country that is clicked on
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}


/* LEGEND AND MENU. ADAPTED FROM: https: //leafletjs.com/examples/choropleth/ */
// set two new controls for the legend and the hover-over menu on the page
var info = L.control();
var legend = L.control({
    position: 'bottomright'
});

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Live Currency Comparison</h4>' + (props ?
        '<b>' + props.ADMIN + '</b><br /> Currency = ' + props.currency + '</b><br />' + '1 ' + currentCurrency + '= ' + props.value + ' ' + props.currency:
        '<b> Current Base Currency = ' + currentCurrency + '</b> <br>Hover over a country to compare</br>');
};

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
    // loop through the grades
        grades = [NaN, 0.00001, 0.001, 0.01, 0.1, 0.5, 1, 2, 5, 10, 100, 1000, 10000];

    div.innerHTML += '<b>Currency Value</b><br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        // Make the first value No Data Avaialble
        if (i == 0) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 0.0000001) + '"></i> ' + "No Data Available" + '<br>';
        } else {
        div.innerHTML += '<i style="background:' + getColor(grades[i]+0.0000001) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    }
    return div;
};
