
// Model

// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.


var locations = [
          {
              name: 'The Metropolitan Museum of Art',
              lat: 40.779437,
              lng: -73.963244
          },
          {
              name: 'The Museum of Modern Art (MoMA)',
              lat: 40.761433,
              lng:-73.977622
          },
          {
              name: 'The Frick Collection',
              lat: 40.770970,
              lng: -73.967384
          },
          {
              name: 'The Cloisters',
              lat: 40.864863,
              lng: -73.931727
          },
          {
              name: 'Ellis Island Immigration Museum',
              lat: 40.699475,
              lng: -74.039559
          },
          {
              name: 'Fraunces Tavern Museum',
              lat: 40.703372,
              lng: -74.011373
          },
          {
              name: 'Merchant\'s House Museum',
              lat: 40.727665,
              lng: -73.992340
          },
          {
              name: 'New York Public Library',
              lat: 40.753182,
              lng: -73.982253
          }
    ];



var map;

var ViewModel = function() {

  var self = this;

// This function will loop through the markers array and display them all.
this.showListings = function() {
var bounds = new google.maps.LatLngBounds();
// Extend the boundaries of the map for each marker and display the marker
for (var i = 0; i < self.markers.length; i++) {
  self.markers[i].setMap(map);
  bounds.extend(self.markers[i].position);
}
map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
this.hideListings = function() {
for (var i = 0; i < self.markers.length; i++) {
  self.markers[i].setMap(null);
}
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
 
 this.initMap = function(){
// Constructor creates a new map - only center and zoom are required.
map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 40.7413549, lng: -73.9980244},
  zoom: 13,
  mapTypeControl: false
});


this.largeInfoWindow = new google.maps.InfoWindow();

// Create a new blank array for all the listing markers.
this.markers = [];

// The following group uses the location array to create an array of markers on initialize.
for (var i = 0; i < locations.length; i++) {
  // Get the position from the location array.
  this.lat = locations[i].lat;
  this.lng = locations[i].lng;
  this.name = locations[i].name;
  // Create a marker per location, and put into markers array.
  this.marker = new google.maps.Marker({
    position: {lat: this.lat,
               lng: this.lng},
    name: this.name,
    lat: this.lat,
    lng: this.lng,
    animation: google.maps.Animation.DROP,
    id: i
  });
  // Push the marker to our array of markers.
  this.markers.push(this.marker);
  // Show markers on the map.
  self.showListings();
  // Create an onclick event to open an infowindow at each marker.
  this.marker.addListener('click', function() {
    self.populateInfoWindow(this, self.largeInfoWindow);
    this.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){this.setAnimation(null);}.bind(this),1000);
  });
}

 };

this.initMap();

this.populateInfoWindow = function(marker, infowindow) {
// Check to make sure the infowindow is not already opened on this marker.
 if (infowindow.marker != marker) {
  infowindow.setContent('');
  infowindow.marker = marker;
  
  // Foursquare API credentials
  clientId = 'BPHIHI4RMCH5LAZ1HSM0FY1GNMR2EEX4ZPPB4YFXXZOEEZOF';
  clientSecret = 'EBTSLFFSCJ5UFZREVDK2XFY1DFXP4NFNTZZ0K3L0I12GOZAQ';
  //Foursquare API URL to call
  var fourSquareURL = 'https://api.foursquare.com/v2/venues/search?ll='
                       + marker.lat + ',' + marker.lng + '&client_id='
                       + clientId + '&client_secret=' + clientSecret
                       + '&v=20170801' + '&query=' + marker.name;
  
  // This Foursquare API gets data from Foursquare and stores it in its variables.
  $.getJSON(fourSquareURL).done(function(marker){
    var results = marker.response.venues[0];
    self.name = results.name;
    self.street = results.location.formattedAddress[0];
    self.city = results.location.formattedAddress[1];
    self.country = results.location.formattedAddress[2]; 

    self.htmlContent = '<ul><li><strong>' + self.name + '</strong></li>' +
                         '<li>' + self.street + '</li>'+
                         '<li>' + self.city + '</li>'+
                         '<li>' + self.country + '</li></ul>';               
    
  infowindow.setContent(self.htmlContent);

  }).fail(function(){
   alert("There was an issue with the Foursquare API call. Please refresh the page and try again.");
  });
  infowindow.open(map, marker);
  // Make sure the marker property is cleared if the infowindow is closed.
  infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
  });
}
};

// showListings() is called when show-listings button is clicked.
$('#show-listings').click(this.showListings);

// hideListings() is called when hide-listings button is clicked.
$('#hide-listings').click(this.hideListings);


  this.query = ko.observable("");

// This function adds our locations to the list using data-bind
// It also filters both the list view and map markers
this.locationsFilter = ko.computed(function() {
    var locations = [];
    for (var i = 0; i < this.markers.length; i++) {
        var marker = this.markers[i];
        if (marker.name.toLowerCase().includes(this.query()
                .toLowerCase())) {
            locations.push(marker);
            this.markers[i].setVisible(true);
        } else {
            this.markers[i].setVisible(false);
        }
    }
    return locations;
}, this);

//This function populates infoWindow when the corresponding location in the list is clicked.
this.showMarkerInfo = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){this.setAnimation(null);}.bind(this),1000);

    };
  
};

  $( "#toggle" ).click(function() {
  $( "#text" ).fadeToggle( "fast", "linear" );
});


googleError = function googleError() {
  alert('Oops!! Google Maps did not load. Please refresh the page and try again!');
};



var startApp = function(){
  ko.applyBindings(new ViewModel());
};

