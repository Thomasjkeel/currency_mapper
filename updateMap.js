function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 100 ? '#BD0026' :
        d > 10 ? '#E31A1C' :
        d > 1 ? '#FC4E2A' :
        d > 0.1 ? '#FD8D3C' :
        d > 0.01 ? '#FEB24C' :
        d > 0.001 ? '#FED976' :
        '#d3d1c6';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.value),
        weight: 1,
        opacity: 1,
        color: 'white',
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
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    countriesjs.resetStyle(e.target);
    info.update();
}

function setCurrency(e) {
    currentCurrency = e.target.feature.properties.currency;
    console.log(currentCurrency);
    getCurrencies(currentCurrency)
    // highlightFeature(e);
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: setCurrency,
        dblclick: zoomToFeature
    });
}


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>World Currency Comparer</h4>' + (props ?
        '<b> Country = ' + props.ADMIN + '</b><br />' + props.currency + '</b><br />' + "1 " + currentCurrency + "= " + props.value :
        'Hover over a country');
};


var legend = L.control({
    position: 'bottomright'
});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [NaN, 0.001, 0.01, 0.1, 1, 10, 100, 1000];

    div.innerHTML += '<b>Currency Value</b><br>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        // Make the first value No Data Avaialble
        if (i == 0) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 0.000001) + '"></i> ' + "No Data Available" + '<br>';
        } else {
        div.innerHTML += '<i style="background:' + getColor(grades[i]+0.000001) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
    }
    return div;
};

