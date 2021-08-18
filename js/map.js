// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = '';
let markers = L.featureGroup();
let csvdata;

// initialize
$( document ).ready(function() {
	createMap(lat,lon,zl);
	readCSV(path);
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
		if(isNaN(item.lat)==false)
		if(isNaN(item.long)==false){
			// circle options
			console.log(item)

			let circleOptions = {
				radius: 10,
				weight: 1,
				color: 'white',
				fillColor: 'red',
				fillOpacity: 0.5
			}
			let marker = L.circleMarker([parseFloat(item.lat),parseFloat(item.long)],circleOptions)
            .on('mouseover',function(){
				this.bindPopup(`${item['ws']}`).openPopup()
			})

			markers.addLayer(marker)	

			// add data to sidebar
			$('.sidebar').append(`<div class="sidebar-item">${item.ws}</div>`)

		}
	});

	markers.addTo(map)
	map.fitBounds(markers.getBounds())
}