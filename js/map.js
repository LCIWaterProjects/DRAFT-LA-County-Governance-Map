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
	geojson_layer = L.geoJson(geojson_data).addTo(map);

	// fit to bounds
	map.fitBounds(geojson_layer.getBounds())
}