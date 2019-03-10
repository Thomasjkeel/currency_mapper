// function onEachFeature(feature, layer) {
//     layer.setStyle({
//         fillColor: 'red',
//         fillOpacity: 0.5,
//         weight: 1,
//         color: 'darkred',
//         opacity: 1
//     });
// }

var currentCurrency = "EUR";

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 100 ? '#BD0026' :
        d > 10 ? '#E31A1C' :
        d > 1 ? '#FC4E2A' :
        d > 0.1 ? '#FD8D3C' :
        d > 0.01 ? '#FEB24C' :
        d > 0.001 ? '#FED976' :
        '#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.value),
        weight: 2,
        opacity: 1,
        // color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}
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
    info.update(layer.feature.properties.rates);
}
function resetHighlight(e) {
    countriesjs.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
    // console.log(e.target.feature.properties);
    currentCurrency = e.target.feature.properties.currency;
    console.log(currentCurrency);
    
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}



var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' + (props ?
        '<b>' + props.ADMIN + '</b><br />' + props.ADMIN + ' people / mi<sup>2</sup>' :
        'Hover over a state');
};




