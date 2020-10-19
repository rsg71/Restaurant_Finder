class Zomato {
  constructor() {
    this.api = "406a36928c14de7ad8474610b9e643e3";
    this.header = {
      method: "GET",
      headers: {
        "user-key": this.api,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    };
  }

  async searchAPI(city, categoryID, ui) {
    //request url
    const categoryURL = `https://developers.zomato.com/api/v2.1/categories
		`;
    //city url
    const cityURL = `https://developers.zomato.com/api/v2.1/cities?q=${city}
		`;

    //category data
    const categoryInfo = await fetch(categoryURL, this.header);
    const categoryJSON = await categoryInfo.json();
    const categories = await categoryJSON.categories;

    if (!city)
      return {
        categories,
      };
    //search city
    const cityInfo = await fetch(cityURL, this.header);
    const cityJSON = await cityInfo.json();

    console.log(cityJSON);

    const cityLocation = await cityJSON.location_suggestions;

    let cityID = 0;
    if (cityLocation.length !== 0) {
      cityID = await cityLocation[0].id;
    }

    //search restaurant
    const restaurantURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&category=${categoryID}&sort=rating
		`;
    const restaurantInfo = await fetch(restaurantURL, this.header);
    const restaurantJSON = await restaurantInfo.json();
    const restaurants = await restaurantJSON.restaurants;
    console.log(restaurantJSON);

    const markersArray = [];

    if (restaurantJSON.restaurants.length > 0) {
      for (var i = 0; i < restaurantJSON.restaurants.length; i++) {
        // console.log(restaurantJSON.restaurants[i].restaurant)
        addMarker({
          coords: {
            lat: parseFloat(
              restaurantJSON.restaurants[i].restaurant.location.latitude
            ),
            lng: parseFloat(
              restaurantJSON.restaurants[i].restaurant.location.longitude
            ),
          },
          content:
            "<h4>" +
            restaurantJSON.restaurants[i].restaurant.name +
            "</h4>" +
            "<p>" +
            restaurantJSON.restaurants[i].restaurant.location.address +
            "</p>",
        });
      }
    }

    return {
      categories,
      cityID,
      restaurants,
    };
  }
}

class UI {
  constructor() {
    this.loader = document.querySelector(".loader");
    this.restaurantList = document.querySelector("#restaurant-list");
    // this.saveRestaurant = function (event) {
    //      event.preventDefault();
    //         var id = $(this).data("id");
    //         var favRestuarants = {
    //             fav : 1
    //         };

    //         console.log(id);
    //         console.log(favRestuarants);
    //         console.log("CLICKED");
    //         $.ajax("/api/restaurants/" + id, {
    //             type: "PUT",
    //             data: favRestuarants
    //         }).then(function() {
    //             console.log("Restaurants added");
    //             location.reload();
    //         });
    // };
    //}

    //saveRestaurant(event) {
    //      event.preventDefault();
    //         var favRestuarants = {
    //             name:$(this).attr("data-name"),
    // 			image:$(this).attr("data-img"),
    // 			address:$(this).attr("data-address"),
    // 			rating:$(this).attr("data-rating"),
    // 			description:$(this).attr("data-description"),
    // 			menuLink:$(this).attr("data-menu")

    //         };

    //         console.log();
    //         console.log(favRestuarants);
    //         console.log("CLICKED");
    //         $.ajax("/api/restaurants/", {
    //             type: "POST",
    //             data: favRestuarants
    //         }).then(function() {
    //             console.log("Restaurants added");
    //             location.reload();
    //         });
    // }
  }

  addSelectOptions(categories) {
    const search = document.getElementById("searchCategory");
    let output = `<option value='0' selected>Select category</option>`;

    categories.forEach((category) => {
      output += `
				<option value=${category.categories.id}>${category.categories.name}</option>
			`;
    });
    search.innerHTML = output;
  }

  showFeedback(text) {
    const feedback = document.querySelector(".feedback");
    feedback.classList.add("showItem");
    feedback.innerHTML = `
			<p>${text}</p>
		`;
    setTimeout(() => {
      feedback.classList.remove("showItem");
    }, 3000);
  }

  showLoader() {
    this.loader.classList.add("showItem");
  }
  hideLoader() {
    this.loader.classList.remove("showItem");
  }

  getRestaurants(restaurants) {
    this.hideLoader();
    if (restaurants.length === 0) {
      this.showFeedback("no such categories exist in the selected city");
    } else {
      this.restaurantList.innerHTML = "";
      restaurants.forEach((restaurant) => {
        const {
          thumb: img,
          name,
          location: { address },
          user_rating: { aggregate_rating },
          cuisines,
          average_cost_for_two: cost,
          menu_url,
          url,
        } = restaurant.restaurant;

        if (img !== "") {
          this.showRestaurant(
            img,
            name,
            address,
            aggregate_rating,
            cuisines,
            cost,
            menu_url,
            url
          );
        }
      });
    }
  }

  showRestaurant(
    img,
    name,
    address,
    aggregate_rating,
    cuisines,
    cost,
    menu_url,
    url
  ) {
    const div = document.createElement("div");
    div.classList.add("container");

    div.innerHTML = `
		<div class="container">
        <div class="col">
            <div class="row">
                <div class="card mb-3" style="max-width: 540px;">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${img}" class="cardimg" alt="...">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
								<h5 class="card-title">${name}</h5>
								<div class="badge badge-success">${aggregate_rating}</div>
                                <p class="card-text">${address}</p>
                                <div class="types">
                                    <p>${cuisines}</p>
                                    <p></p>
                                </div>
                                <a href="${menu_url}" target="_blank"><i class="linkBtn"></i> menu</a>
                            </div>
                        </div>
                    </div>
                </div>
				<div> <button  type="button" data-name="${name}" data-image="${img}" data-address="${address}" data-rating="${aggregate_rating}"  data-description="${cuisines}" data-menu="${menu_url}" id="print" class="addRestaurant btn">Save</button> </div>
            </div>
		</div>
		
    </div>
		`;
    this.restaurantList.appendChild(div);
  }
}

(function() {
  const searchForm = document.getElementById("searchForm");
  const searchCity = document.getElementById("searchCity");
  const searchCategory = document.getElementById("searchCategory");

  const zomato = new Zomato();

  const ui = new UI();

  $(document).on("click", ".addRestaurant", function(event) {
    event.preventDefault();
    var favRestuarants = {
      name: $(this).attr("data-name"),
      image: $(this).attr("data-image"),
      address: $(this).attr("data-address"),
      rating: $(this).attr("data-rating"),
      description: $(this).attr("data-description"),
      menuLink: $(this).attr("data-menu"),
    };

    console.log();
    console.log(favRestuarants);
    console.log("CLICKED");
    $.ajax("/api/restaurants/", {
      type: "POST",
      data: favRestuarants,
    }).then(function() {
      console.log("Restaurants added");
    });
  });

  //add select options
  document.addEventListener("DOMContentLoaded", () => {
    //logic goes here
    zomato.searchAPI().then((data) => {
      ui.addSelectOptions(data.categories);
    });
  });

  //submit form
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    markersArray = [];
    const categoryValue = parseInt(searchCategory.value);
    const cityValue = searchCity.value.toLowerCase();

    if (categoryValue != 0 && cityValue != "") {
      // fetch("http://localhost:8080/api/restaurants/" + cityValue +"/" + categoryValue, {
      // 	method: "GET"
      // }).then(function(results) {
      // 	results.json();
      // }).then(function(results) {

      // 	window.location = "/"
      // })

      // logic goes if populated values
      zomato.searchAPI(cityValue).then((data) => {
        window.initMap = initMap;

        if (data.cityID !== 0) {
          // console.log(data.cityID)
          ui.showLoader();
          zomato.searchAPI(cityValue, categoryValue, ui).then((data) => {
            ui.getRestaurants(data.restaurants);
          });
        } else {
          ui.showFeedback("Please enter a valid city");
        }
      });
    } else {
      ui.showFeedback("please enter a city and select category");
    }
  });
})();

// =======================================================
// Google Maps below
// =======================================================

// Create the script tag, set the appropriate attributes
var script = document.createElement("script");
script.src =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCcEOHoI8NYfJyNpsmO6e9DZO0icAXUd0o&callback=initMap";
script.defer = true;

// window.initMap = initMap;

// Getting lat and lng of the center of the city
// var lat = 39.862082;
// var lng = -97.621599;

var map;

// Initiate google maps
function initMap() {
  var options = {
    zoom: 4,
    // center: { lat: lat, lng: lng }
  };
  map = new google.maps.Map(document.getElementById("googleMap"), options);
  map.setCenter(new google.maps.LatLng(39.862082, -97.621599));
}
//Add Marker function
function addMarker(props) {
  //create empty LatLngBounds object
  var bounds = new google.maps.LatLngBounds();

  var marker = new google.maps.Marker({
    position: props.coords,
    map: map,
  });

  //extend the bounds to include each marker's position
  bounds.extend(marker.position);

  // console.log(bounds)

  //now fit the map to the newly inclusive bounds
  map.fitBounds(bounds);

  map.setZoom(11);

  if (props.content) {
    var infoWindow = new google.maps.InfoWindow({
      content: props.content,
    });

    marker.addListener("click", function() {
      infoWindow.open(map, marker);
    });
  }
}

// Append the 'script' element to 'head'
document.head.appendChild(script);
