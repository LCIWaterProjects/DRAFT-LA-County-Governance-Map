// Global variables
let map;
let lat = 34;
let lon = -118;
let zl = 9;

let geojsonPath = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/data/Op%20Data%20Update.geojson';
let geojson_data;
let geojson_layer;

let brew = new classyBrew();
let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

let fieldtomap = 'Population';


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
	}).addTo(map);



}

// function to get the geojson data
    $.getJSON(geojsonPath,function(data){
        console.log(data)

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
}

function getStyle(feature){
    return {
        stroke: true,
        color: 'white',
        weight: 1,
        fill: true,
        fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
        fillOpacity: 0.8
    }
}

function createLegend(){
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        breaks = brew.getBreaks(),
        labels = [],
        from, to;
        
        for (var i = 0; i < breaks.length; i++) {
            from = breaks[i];
            to = breaks[i + 1];
            if(to) {
                labels.push(
                    '<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
                    from.toFixed(0) + ' &ndash; ' + to.toFixed(0));
                }
            }
            
            div.innerHTML = labels.join('<br>');
            return div;
        };
        
        legend.addTo(map);
}

function createInfoPanel(){

    info_panel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info_panel.update = function (properties) {
        // if feature is highlighted
        if(properties){
            this._div.innerHTML = `<b>${properties['WATER_SYS_1']}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
        }
        // if feature is not highlighted
        else
        {
            this._div.innerHTML = 'Hover over a Water System';
        }
    };

    info_panel.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
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

	var chart = new ApexCharts(document.querySelector('.dashboard'), options2)
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

// create buttons function
function myPopFunction(){
    mapGeoJSON('Population',5,'YlOrRd','quantiles');}

function myServeFunction(){
    mapGeoJSON('Service_Co',5,'Dark2','quantiles');}

function myGovTypeFunction(){
    mapGeoJSON('GovernanceCode',7,'Paired','jenks');}

function myMechTypeFunction(){
    mapGeoJSON('MechanismCode',3,'Accent','natural breaks');}
    

    

