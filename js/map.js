// Global variables
let map;
let lat = 34;
let lon = -118;
let zl = 9;

let geojsonPath = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/data/SpanishPrep.geojson';
let geojson_data;
let geojson_layer;
let lacountypath = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/data/LA%20County%20Projected.geojson'

let brew = new classyBrew();
let legend = L.control({position: 'bottomleft'});
let info_panel = L.control();
let fieldtomap = '' ;
let fieldtype='choropleth'



// initialize+
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getGeoJSON();
});

// create the map
function createMap(lat,lon,zl){
    map = L.map('map').setView([lat,lon], zl);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
	{
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'light-v10',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1Ijoic2FyYWhwZXJlejEiLCJhIjoiY2t0MG9hZDNnMDZ2NDJ1c2M5dzBmb201OSJ9.5fv8NqX5cfA0NMcmEW_63g'
	})
    .addTo(map);
    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),});
        map.addControl(search);
      
      const searchControl = new SearchControl({
          provider: new OpenStreetMapProvider(),
          style: 'bar',
          position: 'topright',
        });
      
        map.addControl(searchControl);


}

// function to get the geojson data
    $.getJSON(geojsonPath,function(data){
        

        // put the data in a global variable
        geojson_data = data;

        // call the map function
        mapGeoJSON(fieldtomap,5,'YlOrRd','quantiles');
    })

function mapGeoJSON(field,num_classes,color,scheme){

    // clear layers in case it has been mapped already
    if (geojson_layer){
        geojson_layer.clearLayers()
    }
    
    // globalize the field to map
    fieldtomap = field;
    
    // create an empty array
    let values = [];

    // based on the provided field, enter each value into the array
    geojson_data.features.forEach(function(item,index){
        if((item.properties[field] != undefined ) ){
            values.push(item.properties[field])
        }
    })

    // set up the "brew" options
    brew.setSeries(values);
    brew.setNumClasses(num_classes);
    brew.setColorCode(color);
    brew.classify(scheme);

    // create the layer and add to map
    geojson_layer = L.geoJson(geojson_data, {
        style: getStyle, //call a function to style each feature
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);
    
    // turning off fit bounds so that we stay in mainland USA
    // map.fitBounds(geojson_layer.getBounds())

    // create the legend
    createLegend();

    // create the infopanel
    createInfoPanel();

    //create table
    createTable();

 
}//original getstyle commented out
//function getStyle(feature){return {stroke: true,color: 'white', weight: 1, fill: true,fillColor: brew.getColorInRange(feature.properties[fieldtomap]),fillOpacity: 0.8}}

//Coding for English Data
function getStyle(feature){
    if(fieldtomap == 'GovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#cab2d6' :
                   d == 8  ? '#ff7f00' :
                   d == 7  ? '#fdbf6f' :
                   d == 6  ? '#e31a1c' :
                   d == 5  ? '#fb9a99' :
                   d == 4  ? '#33a02c' :
                   d == 3  ? '#b2df8a' :
                   d == 2  ? '#1f78b4' :
                   d == 1  ? '#a6cee3':
                                '#412722';
                              
        }
     }
    else if(fieldtomap == 'MechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#fc8d62' :
                   d == 2  ? '#8da0cb' :
                   d == 1  ? '#66c2a5':
                                '#412722';
                              
        }
    }
    else if(fieldtomap == 'Population'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#33a02c' :
                    d > 270000  ? '#b2df8a' :
                    d > 115000  ? '#1f78b4' :
                    d > 70000  ? '#fb9a99' :
                    d > 35000  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'Service_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#33a02c' :
                    d > 30000  ? '#b2df8a' :
                    d > 10000 ? '#1f78b4' :
                    d > 3300 ? '#fb9a99' :
                    d > 500  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'WaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#b2df8a' :
                    d > 72 ? '#1f78b4' :
                    d > 57 ? '#fb9a99' :
                    d > 38  ? '#a6cee3':
                    d > 0 ? '#cab2d6':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'HMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 8  ? '#cab2d6' :
            d == 7  ? '#ff7f00' :
            d == 6  ? '#fdbf6f' :
            d == 5  ? '#e31a1c' :
            d == 4  ? '#fb9a99' :
            d == 3  ? '#33a02c' :
            d == 2  ? '#b2df8a' :
            d == 1  ? '#1f78b4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'Operator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'No operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
 if(fieldtomap == 'GovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#cab2d6' :
                   d == 8  ? '#ff7f00' :
                   d == 7  ? '#fdbf6f' :
                   d == 6  ? '#e31a1c' :
                   d == 5  ? '#fb9a99' :
                   d == 4  ? '#33a02c' :
                   d == 3  ? '#b2df8a' :
                   d == 2  ? '#1f78b4' :
                   d == 1  ? '#a6cee3':
                                '#412722';
                              
        }
     }
    else if(fieldtomap == 'MechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#fc8d62' :
                   d == 2  ? '#8da0cb' :
                   d == 1  ? '#66c2a5':
                                '#412722';
                              
        }
    }
    else if(fieldtomap == 'Population'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#33a02c' :
                    d > 270000  ? '#b2df8a' :
                    d > 115000  ? '#1f78b4' :
                    d > 70000  ? '#fb9a99' :
                    d > 35000  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'Service_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#33a02c' :
                    d > 30000  ? '#b2df8a' :
                    d > 10000 ? '#1f78b4' :
                    d > 3300 ? '#fb9a99' :
                    d > 500  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'WaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#b2df8a' :
                    d > 72 ? '#1f78b4' :
                    d > 57 ? '#fb9a99' :
                    d > 38  ? '#a6cee3':
                    d > 0 ? '#cab2d6':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'HMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 8  ? '#cab2d6' :
            d == 7  ? '#ff7f00' :
            d == 6  ? '#fdbf6f' :
            d == 5  ? '#e31a1c' :
            d == 4  ? '#fb9a99' :
            d == 3  ? '#33a02c' :
            d == 2  ? '#b2df8a' :
            d == 1  ? '#1f78b4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'Operator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'No operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    //Coding for Spanish Data 
    if(fieldtomap == 'GovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#cab2d6' :
                   d == 8  ? '#ff7f00' :
                   d == 7  ? '#fdbf6f' :
                   d == 6  ? '#e31a1c' :
                   d == 5  ? '#fb9a99' :
                   d == 4  ? '#33a02c' :
                   d == 3  ? '#b2df8a' :
                   d == 2  ? '#1f78b4' :
                   d == 1  ? '#a6cee3':
                                '#412722';
                              
        }
     }
    else if(fieldtomap == 'MechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#fc8d62' :
                   d == 2  ? '#8da0cb' :
                   d == 1  ? '#66c2a5':
                                '#412722';
                              
        }
    }
    else if(fieldtomap == 'Population'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#33a02c' :
                    d > 270000  ? '#b2df8a' :
                    d > 115000  ? '#1f78b4' :
                    d > 70000  ? '#fb9a99' :
                    d > 35000  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'Service_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#33a02c' :
                    d > 30000  ? '#b2df8a' :
                    d > 10000 ? '#1f78b4' :
                    d > 3300 ? '#fb9a99' :
                    d > 500  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'WaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#b2df8a' :
                    d > 72 ? '#1f78b4' :
                    d > 57 ? '#fb9a99' :
                    d > 38  ? '#a6cee3':
                    d > 0 ? '#cab2d6':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'HMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 8  ? '#cab2d6' :
            d == 7  ? '#ff7f00' :
            d == 6  ? '#fdbf6f' :
            d == 5  ? '#e31a1c' :
            d == 4  ? '#fb9a99' :
            d == 3  ? '#33a02c' :
            d == 2  ? '#b2df8a' :
            d == 1  ? '#1f78b4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'Operator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'No operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
                    d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
   //Coding for Spanish Data  
 if(fieldtomap == 'SpanGovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#cab2d6' :
                   d == 8  ? '#ff7f00' :
                   d == 7  ? '#fdbf6f' :
                   d == 6  ? '#e31a1c' :
                   d == 5  ? '#fb9a99' :
                   d == 4  ? '#33a02c' :
                   d == 3  ? '#b2df8a' :
                   d == 2  ? '#1f78b4' :
                   d == 1  ? '#a6cee3':
                                '#412722';
                              
        }
     }
    else if(fieldtomap == 'SpanMechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#fc8d62' :
                   d == 2  ? '#8da0cb' :
                   d == 1  ? '#66c2a5':
                                '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanPopulation'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#33a02c' :
                    d > 270000  ? '#b2df8a' :
                    d > 115000  ? '#1f78b4' :
                    d > 70000  ? '#fb9a99' :
                    d > 35000  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanService_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#33a02c' :
                    d > 30000  ? '#b2df8a' :
                    d > 10000 ? '#1f78b4' :
                    d > 3300 ? '#fb9a99' :
                    d > 500  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanWaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#b2df8a' :
                    d > 72 ? '#1f78b4' :
                    d > 57 ? '#fb9a99' :
                    d > 38  ? '#a6cee3':
                    d > 0 ? '#cab2d6':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanHMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 8  ? '#cab2d6' :
            d == 7  ? '#ff7f00' :
            d == 6  ? '#fdbf6f' :
            d == 5  ? '#e31a1c' :
            d == 4  ? '#fb9a99' :
            d == 3  ? '#33a02c' :
            d == 2  ? '#b2df8a' :
            d == 1  ? '#1f78b4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'SpanOperator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'SpanNo operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else{
    return {
        stroke: true,
        color: 'white',

        weight: 1,
        fill: true,
        fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
        fillOpacity: 0.8
        }
    }
}

function createLegend(){
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        breaks = brew.getBreaks(),
        labels = [],
        from, to;
        console.log('mapping '+fieldtomap)

        //Coding for English Legends

        if(fieldtomap == 'GovernanceCode'){
            div.innerHTML =
            '<b>Water System Governance Type</b>'+
            '<div style="background-color: #a6cee3"></div>City/Municpal<br>' +
            '<div style="background-color: #1f78b4"></div>County<br>' +
            '<div style="background-color: #b2df8a"></div>Mutual Water Company<br>'+
            '<div style="background-color: #33a02c"></div>Investor Owned Utility<br>' +
            '<div style="background-color: #fb9a99"></div>Special District<br>' +
            '<div style="background-color: #e31a1c"></div>Mobile Home<br>' +
            '<div style="background-color: #fdbf6f"></div>Irrigation District<br>'+
            '<div style="background-color: #ff7f00"></div>Other Private<br>'+
            '<div style="background-color: #cab2d6"></div>Unknown<br>'
            return div;
            
    
        }
        else if(fieldtomap == 'MechanismCode'){
            div.innerHTML =
            '<b>Governance Mechanism</b>'+
            '<div style="background-color: #66c2a5"></div>Election<br>'+
            '<div style="background-color: #8da0cb"></div>Appointment<br>'+
            '<div style="background-color: #fc8d62"></div>No Data<br>'
            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Population'){
            div.innerHTML =
            '<b>Water System Population</b>'+
            '<div style="background-color: #412722"></div>0 - 35,000<br>'+
            '<div style="background-color: #8da0cb"></div>35,001 - 70,000<br>'+
            '<div style="background-color: #8da0cb"></div>70,001 - 115,000<br>'+
            '<div style="background-color: #8da0cb"></div>115,001 - 270,000<br>'+
            '<div style="background-color: #8da0cb"></div>270,001 - 476000 <br>'+
            '<div style="background-color: #8da0cb"></div>Over 476,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Service_Co'){
            div.innerHTML =
            '<b>Water System Service Connections</b>'+
            '<div style="background-color: #412722"></div>0 - 500<br>'+
            '<div style="background-color: #8da0cb"></div>501 - 3,300<br>'+
            '<div style="background-color: #8da0cb"></div>3,301 - 10,000<br>'+
            '<div style="background-color: #8da0cb"></div>10,001 - 30,000<br>'+
            '<div style="background-color: #8da0cb"></div>30,001 - 100,000 <br>'+
            '<div style="background-color: #8da0cb"></div>Over 100,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'WaterBill'){
            div.innerHTML =
            '<b>Average Household Water Bill</b>'+
            '<div style="background-color: #8da0cb"></div>$0 - $38<br>'+
            '<div style="background-color: #8da0cb"></div>$38 -$57<br>'+
            '<div style="background-color: #8da0cb"></div>$57 - $72<br>'+
            '<div style="background-color: #8da0cb"></div>$72 - $90 <br>'+
            '<div style="background-color: #8da0cb"></div>Over $90<br>'+
            '<div style="background-color: #412722"></div>No Rate Data<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'HMW'){
            div.innerHTML =
            '<b>Hours At Minimum Wage</b>'+
            '<div style="background-color: #a6cee3"></div>1 Hour<br>' +
            '<div style="background-color: #1f78b4"></div>2 Hours<br>' +
            '<div style="background-color: #b2df8a"></div>3 Hours<br>'+
            '<div style="background-color: #33a02c"></div>4 Hours<br>' +
            '<div style="background-color: #fb9a99"></div>5 Hours<br>' +
            '<div style="background-color: #e31a1c"></div>6 Hours<br>' +
            '<div style="background-color: #fdbf6f"></div>7 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>8 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>No Data<br>'


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Operator Below Required'){
            div.innerHTML =
            '<b>Operator Below Required</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'No operator'){
            div.innerHTML =
            '<b>Does my water system have an operator</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
//Coding for Spanish Legends 

        if(fieldtomap == 'SpanGovernanceCode'){
            div.innerHTML =
            '<b>Water System Governance Type</b>'+
            '<div style="background-color: #a6cee3"></div>City/Municpal<br>' +
            '<div style="background-color: #1f78b4"></div>County<br>' +
            '<div style="background-color: #b2df8a"></div>Mutual Water Company<br>'+
            '<div style="background-color: #33a02c"></div>Investor Owned Utility<br>' +
            '<div style="background-color: #fb9a99"></div>Special District<br>' +
            '<div style="background-color: #e31a1c"></div>Mobile Home<br>' +
            '<div style="background-color: #fdbf6f"></div>Irrigation District<br>'+
            '<div style="background-color: #ff7f00"></div>Other Private<br>'+
            '<div style="background-color: #cab2d6"></div>Unknown<br>'
            return div;
            
    
        }
        else if(fieldtomap == 'SpanMechanismCode'){
            div.innerHTML =
            '<b>Governance Mechanism</b>'+
            '<div style="background-color: #66c2a5"></div>Election<br>'+
            '<div style="background-color: #8da0cb"></div>Appointment<br>'+
            '<div style="background-color: #fc8d62"></div>No Data<br>'
            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanPopulation'){
            div.innerHTML =
            '<b>Water System Population</b>'+
            '<div style="background-color: #412722"></div>0 - 35,000<br>'+
            '<div style="background-color: #8da0cb"></div>35,001 - 70,000<br>'+
            '<div style="background-color: #8da0cb"></div>70,001 - 115,000<br>'+
            '<div style="background-color: #8da0cb"></div>115,001 - 270,000<br>'+
            '<div style="background-color: #8da0cb"></div>270,001 - 476000 <br>'+
            '<div style="background-color: #8da0cb"></div>Over 476,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanService_Co'){
            div.innerHTML =
            '<b>Water System Service Connections</b>'+
            '<div style="background-color: #412722"></div>0 - 500<br>'+
            '<div style="background-color: #8da0cb"></div>501 - 3,300<br>'+
            '<div style="background-color: #8da0cb"></div>3,301 - 10,000<br>'+
            '<div style="background-color: #8da0cb"></div>10,001 - 30,000<br>'+
            '<div style="background-color: #8da0cb"></div>30,001 - 100,000 <br>'+
            '<div style="background-color: #8da0cb"></div>Over 100,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanWaterBill'){
            div.innerHTML =
            '<b>Average Household Water Bill</b>'+
            '<div style="background-color: #8da0cb"></div>$0 - $38<br>'+
            '<div style="background-color: #8da0cb"></div>$38 -$57<br>'+
            '<div style="background-color: #8da0cb"></div>$57 - $72<br>'+
            '<div style="background-color: #8da0cb"></div>$72 - $90 <br>'+
            '<div style="background-color: #8da0cb"></div>Over $90<br>'+
            '<div style="background-color: #412722"></div>No Rate Data<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanHMW'){
            div.innerHTML =
            '<b>Hours At Minimum Wage</b>'+
            '<div style="background-color: #a6cee3"></div>1 Hour<br>' +
            '<div style="background-color: #1f78b4"></div>2 Hours<br>' +
            '<div style="background-color: #b2df8a"></div>3 Hours<br>'+
            '<div style="background-color: #33a02c"></div>4 Hours<br>' +
            '<div style="background-color: #fb9a99"></div>5 Hours<br>' +
            '<div style="background-color: #e31a1c"></div>6 Hours<br>' +
            '<div style="background-color: #fdbf6f"></div>7 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>8 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>No Data<br>'


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanOperator Below Required'){
            div.innerHTML =
            '<b>Operator Below Required</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanNo operator'){
            div.innerHTML =
            '<b>Does my water system have an operator</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else {
            console.log('mapping other var')
            for (var i = 0; i < breaks.length; i++) {
                from = breaks[i];
                to = breaks[i + 1];
                if(to) {
                    labels.push(
                        '<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
                        from.toFixed(0) + ' &ndash; ' + to.toFixed(0));
                    }
                }
                
                div.innerHTML =
              '<b>Data Legend <b>Data Legend in Spanish'
               
                return div;
            }; 
    
    
    
        }
    
        
        legend.addTo(map);
}

function createInfoPanel(){

    info_panel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info_panel.update = function (properties) {
        // if feature is highlighted
        //English Info Panel Code here 
        if(properties){
            this._div.innerHTML =`<br><b> ${properties['Name']}</b>`
            if(fieldtomap == 'GovernanceCode'){
            this._div.innerHTML =`<br><b>Governance Information</b>
            <div><b>${properties['Name']}</b>
            <br>Link to Water System Website if able
            <br><b>Governance Type:</b> ${properties['GovernanceType']}
            <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
            <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
            <br>Table with appointed members and compensation
            <br>Participation Info here? 
            <br><b>Service Connections</b> ${properties['Service_Co']}
            <br><b>System Population:</b> ${properties['Population']}
            <br> Insert Population Chart here?
            <br`}    
        else if(fieldtomap == 'MechanismCode'){
            this._div.innerHTML = `<br><b>Governance Information</b>
            <div><b>${properties['Name']}</b>
            <br>Link to Water System Website if able
            <br><b>Governance Type:</b> ${properties['GovernanceType']}
            <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
            <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
            <br>Table with appointed members and compensation
            <br>Participation Info here? 
            <br><b>Service Connections</b> ${properties['Service_Co']}
            <br><b>System Population:</b> ${properties['Population']}
            <br> Insert Population Chart here?
            <br`}    
            else if(fieldtomap == 'Population'){
                this._div.innerHTML = `<br><b>Governance Information</b>
                <div><b>${properties['Name']}</b>
                <br>Link to Water System Website if able
                <br><b>Governance Type:</b> ${properties['GovernanceType']}
                <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                <br>Table with appointed members and compensation
                <br>Participation Info here? 
                <br><b>Service Connections</b> ${properties['Service_Co']}
                <br><b>System Population:</b> ${properties['Population']}
                <br> Insert Population Chart here?
                <br`}    

       else if(fieldtomap == 'Service_Co'){
                this._div.innerHTML = `<br><b>Governance Information</b>
                                        <div><b>${properties['Name']}</b>
                                        <br>Link to Water System Website if able
                                        <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                        <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                        <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                        <br>Table with appointed members and compensation
                                        <br>Participation Info here? 
                                        <br><b>Service Connections</b> ${properties['Service_Co']}
                                        <br><b>System Population:</b> ${properties['Population']}
                                        <br> Insert Population Chart here?
                                        <br`}    
        else if(fieldtomap == 'WaterBill'){
                this._div.innerHTML = `<b>Water Bill Information</b>
                                    <br>Couple sentences about how we calculate average water bill and what that means. 
                                    <div><b>${properties['Name']}</b>
                                    <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                    <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                    <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                     <br`}     
        else if(fieldtomap == 'HMW'){
                 this._div.innerHTML =`<b>Water Bill Information</b>
                                        <br>Couple sentences about how we calculate average water bill and what that means. 
                                        <div><b>${properties['Name']}</b>
                                        <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                        <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                        <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                        <br`}  
        else if(fieldtomap == 'Operator Below Required'){
                this._div.innerHTML =`<b>System Performance</b>
                                            <br>Describe system performance here
                                            <div><b>${properties['Name']}</b>
                                            <br>link to CCR report? 
                                            <br>Required System Operator Level 
                                            <br>Does my system have an operator?
                                            <br>Does my system have the required operator level? 
                                            <br>DO we want to add NA or LA NA Risk scores here?
                                            <br>Perhaps adding an MCL variable to the map (button and here)
                                            <br`}  
        else if(fieldtomap == 'No Operator'){
                this._div.innerHTML =`<b>System Performance</b>
                                            <br>Describe system performance here
                                            <div><b>${properties['Name']}</b>
                                            <br>link to CCR report? 
                                            <br>Required System Operator Level 
                                            <br>Does my system have an operator?
                                            <br>Does my system have the required operator level? 
                                            <br>DO we want to add NA or LA NA Risk scores here?
                                            <br>Perhaps adding an MCL variable to the map (button and here)
                                            <br`}  
//Spanish Info Box Code Here 
                                            if(fieldtomap == 'SpanGovernanceCode'){
                                                this._div.innerHTML =`<br><b>Governance Information</b>
                                                <div><b>${properties['Name']}</b>
                                                <br>Link to Water System Website if able
                                                <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                <br>Table with appointed members and compensation
                                                <br>Participation Info here? 
                                                <br><b>Service Connections</b> ${properties['Service_Co']}
                                                <br><b>System Population:</b> ${properties['Population']}
                                                <br> Insert Population Chart here?
                                                <br`}    
                                            else if(fieldtomap == 'SpanMechanismCode'){
                                                this._div.innerHTML = `<br><b>Governance Information</b>
                                                <div><b>${properties['Name']}</b>
                                                <br>Link to Water System Website if able
                                                <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                <br>Table with appointed members and compensation
                                                <br>Participation Info here? 
                                                <br><b>Service Connections</b> ${properties['Service_Co']}
                                                <br><b>System Population:</b> ${properties['Population']}
                                                <br> Insert Population Chart here?
                                                <br`}    
                                                else if(fieldtomap == 'SpanPopulation'){
                                                    this._div.innerHTML = `<br><b>Governance Information</b>
                                                    <div><b>${properties['Name']}</b>
                                                    <br>Link to Water System Website if able
                                                    <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                    <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                    <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                    <br>Table with appointed members and compensation
                                                    <br>Participation Info here? 
                                                    <br><b>Service Connections</b> ${properties['Service_Co']}
                                                    <br><b>System Population:</b> ${properties['Population']}
                                                    <br> Insert Population Chart here?
                                                    <br`}    
                                    
                                           else if(fieldtomap == 'SpanService_Co'){
                                                    this._div.innerHTML = `<br><b>Governance Information</b>
                                                                            <div><b>${properties['Name']}</b>
                                                                            <br>Link to Water System Website if able
                                                                            <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                                            <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                                            <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                                            <br>Table with appointed members and compensation
                                                                            <br>Participation Info here? 
                                                                            <br><b>Service Connections</b> ${properties['Service_Co']}
                                                                            <br><b>System Population:</b> ${properties['Population']}
                                                                            <br> Insert Population Chart here?
                                                                            <br`}    
                                            else if(fieldtomap == 'SpanWaterBill'){
                                                    this._div.innerHTML = `<b>Water Bill Information</b>
                                                                        <br>Couple sentences about how we calculate average water bill and what that means. 
                                                                        <div><b>${properties['Name']}</b>
                                                                        <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                                                        <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                                                        <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                                                         <br`}     
                                            else if(fieldtomap == 'SpanHMW'){
                                                     this._div.innerHTML =`<b>Water Bill Information</b>
                                                                            <br>Couple sentences about how we calculate average water bill and what that means. 
                                                                            <div><b>${properties['Name']}</b>
                                                                            <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                                                            <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                                                            <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                                                            <br`}  
                                            else if(fieldtomap == 'SpanOperator Below Required'){
                                                    this._div.innerHTML =`<b>System Performance</b>
                                                                                <br>Describe system performance here
                                                                                <div><b>${properties['Name']}</b>
                                                                                <br>link to CCR report? 
                                                                                <br>Required System Operator Level 
                                                                                <br>Does my system have an operator?
                                                                                <br>Does my system have the required operator level? 
                                                                                <br>DO we want to add NA or LA NA Risk scores here?
                                                                                <br>Perhaps adding an MCL variable to the map (button and here)
                                                                                <br`}  
                                            else if(fieldtomap == 'SpanNo Operator'){
                                                    this._div.innerHTML =`<b>System Performance</b>
                                                                                <br>Describe system performance here
                                                                                <div><b>${properties['Name']}</b>
                                                                                <br>link to CCR report? 
                                                                                <br>Required System Operator Level 
                                                                                <br>Does my system have an operator?
                                                                                <br>Does my system have the required operator level? 
                                                                                <br>DO we want to add NA or LA NA Risk scores here?
                                                                                <br>Perhaps adding an MCL variable to the map (button and here)
                                                                                <br`}                                             
    }
        else if(properties){
            this._div.innerHTML = `
                                    <div><b>${properties['Name']}</b>
                                    <br><b>Service Connections</b> ${properties['Service_Co']}
                                    <br><b>System Population:</b> ${properties['Population']}
                                    <br> Insert Population Chart here?
                                    <p class = "info-value">Test</p>
                                    <div id=apexchart style= "width:400px;height:400px"></div>
                                    <br><b>Governance Information</b>
                                    <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                    <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                    <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                    <br><b>Water Bill</b>
                                    <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                    <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                    <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                    
                                    `
                                    ;}

       
        // if feature is not highlighted
        else
        {
            this._div.innerHTML = 'Click on a Water System/add Spanish Translation';
        }
    };

    info_panel.addTo(map);

}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
    layer.on({
        //mouseover: highlightFeature,
        //mouseout: resetHighlight,
        //click: zoomToFeature,
        click: highlightFeature,
       
    });
}

// on mouse over, highlight the feature
function highlightFeature(e) {
    var layer = e.target;

    // style to use on mouse over
    layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info_panel.update(layer.feature.properties);
    createDashboard(layer.feature.properties);
    
   
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
    geojson_layer.resetStyle(e.target);
    info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Creating dashboard
function createDashboard(properties){

	// clear dashboard
	$('.dashboard').empty();


	// chart title
	let title = 'Racial Demographics ' + properties['Name'];
	// data values
	let data = [
            properties['Hispanic'],
            properties['White'],
            properties['Black'],
            properties['AIAN'],
            properties['Asian'],
            properties['NHOPI'],
            properties['OtherRace'],
            properties['TwoMore'],
    ]
    
	
	// data fields
	let fields = [
		'Hispanic Population',
		'White Population',
		'Black Population',
		'American Indian and Alaskan Native Population ',
		'Asian Population',
        'Native Hawaiian and other Pacific Islander Population',
        'Other Race Population',
        'Two or more Race Population',
	]

	var options2 = {
		chart: {
			type: 'pie',
			height: 300,
			width: '100%',	
			animations: {
				enabled: false,
			}
		},
		title: {
			text: 'Water System Demographics ' + properties['name'],
		},
		series: data,
		labels: fields,
		legend: {
			position: 'bottomright',
			offsetY: 0,
			height: 230,
		  }
	};

	var chart = new ApexCharts(document.querySelector('#apexchart'), options2)
	chart.render()
  
}
// Creating dashboard
function createNewDashboard(properties){

	// clear dashboard
	$('.popdash').empty();

	console.log(properties)

	// chart title
	let title = 'Racial Demographics ' + properties['name'];
	// data values
	let data = [
            properties['Hispanic_Pop'],
            properties['White_Pop'],
            properties['Black_Pop'],
            properties['AIAN_Pop'],
            properties['Asian_Pop'],
            properties['NHOPI_Pop'],
            properties['OtherRace_Pop'],
            properties['TwoMore_Pop'],
    ]
    
	
	// data fields
	let fields = [
		'Hispanic Population',
		'White Population',
		'Black Population',
		'American Indian and Alaskan Native Population ',
		'Asian Population',
        'Native Hawaiian and other Pacific Islander Population',
        'Other Race Population',
        'Two or more Race Population',
	]

	// chart options
	var options = {
		chart: {
			type: 'bar',
			height: 300,
			animations: {
				enabled: false,
			}
		},
		title: {
			text: title
		},
		plotOptions: {
			bar: {
				horizontal: true
			}
		},
		series: [
			{
				data: data
			}
		],
		xaxis: {
			categories: fields
		}
	}
	
	var options2 = {
		chart: {
			type: 'pie',
			height: 300,
			width: '100%',	
			animations: {
				enabled: false,
			}
		},
		title: {
			text: 'Water System Demographics ' + properties['name'],
		},
		series: data,
		labels: fields,
		legend: {
			position: 'right',
			offsetY: 0,
			height: 230,
		  }
	};

	var chart = new ApexCharts(document.querySelector('.popdash'), options)
	chart.render()
  
}

// Creating dashboard
function createBillDashboard(properties){

	// clear dashboard
	$('.billdash').empty();

	console.log(properties)   

    var options = {
        series: [{
        name: 'Average Bill Cost',
        data: [ properties ['WaterBill'], {
          min: 10,
          max: 120
        }]
      }],
        chart: {
        height: 350,
        type: 'scatter',
        zoom: {
          enabled: true,
          type: 'xy'
        }
      },
      xaxis: {
        tickAmount: 10,
        labels: {
          formatter: function(val) {
            return parseFloat(val).toFixed(1)
          }
        }
      },
      yaxis: {
        tickAmount: 7
      },
      title: {
        text: 'Average Bill ' + properties['name']
      }
      };

      var chart = new ApexCharts(document.querySelector(".billdash"), options);
      chart.render();
  
}

// Creating dashboard
function createBillInfoDashboard(properties){

	// clear dashboard
	$('.billinfodash').empty();

	console.log(properties)

	// chart options
	var options = {
		series: [
            {
              name: "basic",
              data: [
                  properties['POA'],
                  properties['HMW'],
              ]
            }
        ],
        chart: {
            type: "bar",
            height: 350
        },
        plotOptions: {
              bar: {
              horizontal: true
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [
              "Percent of County-wide Average",
              "Hours of Minimum Wage to Pay Bill"
            ]
        },
        title: {
			text: 'Bill Information ' + properties['name']
		}
	}

	var chart = new ApexCharts(document.querySelector('.billinfodash'), options)
	chart.render()
  
}

function zoomTo(geoid){

	let zoom2poly = geojson_layer.getLayers().filter(item => item.feature.properties.GEO_ID === geoid)

	map.fitBounds(zoom2poly[0].getBounds())
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

// Second dropdown button
function myGovDropFunction() {
    document.getElementById("myGovDropdown").classList.toggle("show");
  }
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  // Third dropdown button
function myBillDropFunction() {
    document.getElementById("myBillDropdown").classList.toggle("show");
  }
  
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  // Fourth dropdown button
function myOperatorDropFunction() {
    document.getElementById("myOpDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

// create buttons function
function myPopFunction(){
    mapGeoJSON('Population',5,'YlOrRd','quantiles');}
function myServeFunction(){
    mapGeoJSON('Service_Co',5,'Dark2','quantiles');}

function myGovTypeFunction(){
    mapGeoJSON('GovernanceCode',7,'Paired','jenks');}

function myMechTypeFunction(){
    mapGeoJSON('MechanismCode',3,'Accent','equal interval');}

function myBillFunction(){
    mapGeoJSON('WaterBill',5,'YlOrRd','quantiles');}

function MinWageFunction(){
        mapGeoJSON('HMW',5,'YlOrRd','natural breaks');}
    
function myOpBelowFunction(){
    mapGeoJSON('Operator Below Required',4,'Accent','natural breaks');}

function myNoOpFunction(){
    mapGeoJSON('No operator',5,'Accent','natural breaks');}