// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/data/SystemCoordinates.csv';
let markers = L.featureGroup();
let csvdata;
let geojsonPath = 'data/County Boundaries.geojson';
let geojson_data;
let geojson_layer;

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
	getGeoJSON();
});


// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			// put the data in a global variable
			csvdata = data;
			mapCSV()

		}
	});
}

//function to map CSV
function mapCSV(){

	// loop through each entry
	csvdata.data.forEach(function(item,index){
		if(isNaN(item.Lat)==false)
		if(isNaN(item.Long)==false){
			// circle options
			console.log(item)

			let circleOptions = {
				radius: 5,
				weight: 1,
				color: 'white',
				fillColor: 'red',
				fillOpacity: 0.5
			}
			let marker = L.circleMarker([parseFloat(item.Lat),parseFloat(item.Long)],circleOptions)
            .on('mouseover',function(){
				this.bindPopup(`${item['Name']}`).openPopup()
			})

			markers.addLayer(marker)	

		

		}
	});

	markers.addTo(map)
	map.fitBounds(markers.getBounds())
}
// function to get the geojson data
function getGeoJSON(){

	$.getJSON(geojsonPath,function(data){
		console.log(data)

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON()
	})
}
// function to map a geojson file
function mapGeoJSON(){

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data,{
			style: getStyle //call a function to style each feature
		
		
	}).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())
}
// style each feature
function getStyle(feature){
	return {
		stroke: true,
		color: 'white',
		weight: 1,
		fill: true,
		fillColor: getColor(feature.properties['objectid']),
		fillOpacity: 0.8
	}
}
// return the color for each feature
function getColor(d) {

	return d > 22 ? '#800026' :
		   d > 500000000  ? '#BD0026' :
		   d > 200000000  ? '#E31A1C' :
		   d > 100000000  ? '#FC4E2A' :
		   d > 50000000   ? '#FD8D3C' :
		   d > 20000000   ? '#FEB24C' :
		   d > 10000000   ? '#FED976' :
					  '#FFEDA0';
}