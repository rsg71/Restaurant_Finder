// module.exports 
// require("dotenv").config();

// Getting lat and lng of the center of the city
var lat = 39.955134;
var lng = -75.163718;


// lat and lng are located within the restaurant list within the JSON that the api returns


var restaurantName = "GreatRestaurantExample";


// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcEOHoI8NYfJyNpsmO6e9DZO0icAXUd0o&callback=initMap"
script.defer = true;


window.initMap = initMap;







// Initiate google maps
function initMap() {
    var options = {
        zoom: 13,
        //when we search by city, the center should probably be the middle of the city
        center: { lat: lat, lng: lng }
    }
    var map = new google.maps.Map(document.getElementById("googleMap"), options)



    // ==============================================marker array =================================

    // array of markers


    // console.log(markersArray)
    markersArray = [
        {
            coords: { lat: 39.952759, lng: -75.184654 },
            content: '<h1>' + restaurantName + '</h1>'
        },
        {
            coords: { lat: 39.945587, lng: -75.147017 },
            content: '<h1>' + restaurantName + '</h1>'
        },
        {
            coords: { lat: 39.961706, lng: -75.162767 },
            content: '<h1>' + restaurantName + '</h1>'
        }
    ];


        

    
    //FOR GOOGLE MAPS ON OUR PROJECT
    // we need to push the coords as an object (the JSON object) to the markersArray
    // getting the longitude and latitude for each result (i) from the api query and pushing it to the markers array
    // for (var i = 0; i < object.restaurants.length; i++) {

    //     markersArray.push({
    //         coords: { lat: object.restaurants[i].restaurant.location.latitude, lng: object.restaurants[i].restaurant.location.longitude },
    //         content: "<h1>" + object.restaurants[i].restaurant.name + "<h1>"
    //     })
    // }

    // ==============================================marker array =================================

    //creating the markers on the map by looping through each restaurant on the the markers array
    for (var i = 0; i < markersArray.length; i++) {
        addMarker(markersArray[i]);
    }




    //this is how you would add a single marker for a prefedined lat and lng, referenced above
    // addMarker({
    //     coords: { lat: lat, lng: lng },
    //     content: '<h1>' + restaurantName + '</h1>'
    // });



    //Add Marker function
    function addMarker(props) {
        var marker = new google.maps.Marker({
            position: props.coords,
            map: map,
        });

       
        if (props.content) {
            var infoWindow = new google.maps.InfoWindow({
                content: props.content
            });

            marker.addListener('click', function () {
                infoWindow.open(map, marker);
            });
        }
    };
}

// Append the 'script' element to 'head'
document.head.appendChild(script);