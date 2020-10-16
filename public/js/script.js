//Zomato api key
//b1c2932740aae152b58849a59384d428
class Zomato {
	constructor() {
		this.api = "406a36928c14de7ad8474610b9e643e3";
		this.header = {
			method: 'GET',
			headers: {
				'user-key': this.api,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin'
		}
	}

	async searchAPI(city, categoryID, ui) {
		//request url
		const categoryURL = `https://developers.zomato.com/api/v2.1/categories
		`;
		//city url
		const cityURL = `https://developers.zomato.com/api/v2.1/cities?q=${city}
		`

		//category data
		const categoryInfo = await fetch(categoryURL, this.header)
		const categoryJSON = await categoryInfo.json();
		const categories = await categoryJSON.categories;


		//search city
		const cityInfo = await fetch(cityURL, this.header);
		const cityJSON = await cityInfo.json()



		const cityLocation = await cityJSON.location_suggestions;

		let cityID = 0
		if (cityLocation.length !== 0) {
			cityID = await cityLocation[0].id
		}



		//search restaurant 
		const restaurantURL = `https://developers.zomato.com/api/v2.1/search?entity_id=${cityID}&entity_type=city&category=${categoryID}&sort=rating
		`
		const restaurantInfo = await fetch(restaurantURL, this.header)
		const restaurantJSON = await restaurantInfo.json()
		const restaurants = await restaurantJSON.restaurants
		console.log(restaurantJSON);





		const markersArray = [];


		if (restaurantJSON.restaurants.length > 0) {
			for (var i = 0; i < restaurantJSON.restaurants.length; i++) {

				// console.log(restaurantJSON.restaurants[i].restaurant)
				addMarker({
					coords: { lat: parseFloat(restaurantJSON.restaurants[i].restaurant.location.latitude), lng: parseFloat(restaurantJSON.restaurants[i].restaurant.location.longitude) },
					content: "<h1>" + restaurantJSON.restaurants[i].restaurant.name + "<h1>"
				})
			}

			// console.log('markers array is', markersArray)

			// for (var i = 0; i < markersArray.length; i++) {
			// 	ui.addMarker(markersArray[i]);
			// }



		}







		return {
			categories,
			cityID,
			restaurants
		}
	}
}

class UI {
	constructor() {
		this.loader = document.querySelector('.loader');
		this.restaurantList = document.querySelector('#restaurant-list')
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
	};

	addSelectOptions(categories) {
		const search = document.getElementById('searchCategory')
		let output = `<option value='0' selected>Select category</option>`;

		categories.forEach(category => {
			output += `
				<option value=${category.categories.id}>${category.categories.name}</option>
			`
		})
		search.innerHTML = output

	}

	showFeedback(text) {
		const feedback = document.querySelector('.feedback');
		feedback.classList.add('showItem')
		feedback.innerHTML = `
			<p>${text}</p>
		`;
		setTimeout(() => {
			feedback.classList.remove('showItem')
		}, 3000)
	}

	showLoader() {
		this.loader.classList.add('showItem');
	}
	hideLoader() {
		this.loader.classList.remove('showItem')
	}

	getRestaurants(restaurants) {
		this.hideLoader()
		if (restaurants.length === 0) {
			this.showFeedback('no such categories exist in the selected city')
		} else {
			this.restaurantList.innerHTML = '';
			restaurants.forEach(restaurant => {
				const { thumb: img, name, location: { address }, user_rating: { aggregate_rating }, cuisines, average_cost_for_two: cost, menu_url, url } = restaurant.restaurant;

				if (img !== '') {
					this.showRestaurant(img, name, address, aggregate_rating, cuisines, cost, menu_url, url)
				}
			})
		}
	}

	showRestaurant(img, name, address, aggregate_rating, cuisines, cost, menu_url, url) {
		const div = document.createElement('div');
		div.classList.add('container');

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
		`
		this.restaurantList.appendChild(div)
	}
}




(function () {
	const searchForm = document.getElementById('searchForm')
	const searchCity = document.getElementById('searchCity')
	const searchCategory = document.getElementById('searchCategory')

	const zomato = new Zomato()

	const ui = new UI()

	$(document).on("click", ".addRestaurant", function(event){     event.preventDefault();
        var favRestuarants = {
            name:$(this).attr("data-name"),
			image:$(this).attr("data-image"),
			address:$(this).attr("data-address"),
			rating:$(this).attr("data-rating"),
			description:$(this).attr("data-description"),
			menuLink:$(this).attr("data-menu")

        };

        console.log();
        console.log(favRestuarants);
        console.log("CLICKED");
        $.ajax("/api/restaurants/", {
            type: "POST",
            data: favRestuarants
        }).then(function() {
            console.log("Restaurants added");
            location.reload();
        });})

	//add select options
	document.addEventListener('DOMContentLoaded', () => {
		//logic goes here
		zomato.searchAPI()
			.then(data => {
				ui.addSelectOptions(data.categories)
			})
	})

	//submit form
	searchForm.addEventListener('submit', e => {
		e.preventDefault()
		const categoryValue = parseInt(searchCategory.value)
		const cityValue = searchCity.value.toLowerCase()

		if (categoryValue != 0 && cityValue != '') {
			//logic goes if populated values
			zomato.searchAPI(cityValue)
				.then(data => {
					if (data.cityID !== 0) {
						// console.log(data.cityID)
						ui.showLoader()
						zomato.searchAPI(cityValue, categoryValue, ui)
							.then(data => {
								ui.getRestaurants(data.restaurants)
							})
					} else {
						ui.showFeedback('Please enter a valid city')
					}
				})
		} else {
			ui.showFeedback('please enter a city and select category')
		}
	})



})()







// =======================================================
// Google Maps below 
// =======================================================



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





var map;

// Initiate google maps
function initMap() {
	var options = {
		zoom: 13,
		//when we search by city, the center should probably be the middle of the city
		center: { lat: lat, lng: lng }
	}
	map = new google.maps.Map(document.getElementById("googleMap"), options)



	// ==============================================marker array =================================

	// array of markers


	// console.log(markersArray)
	// markersArray = [
	// 	{
	// 		coords: { lat: 39.952759, lng: -75.184654 },
	// 		content: '<h1>' + restaurantName + '</h1>'
	// 	},
	// 	{
	// 		coords: { lat: 39.945587, lng: -75.147017 },
	// 		content: '<h1>' + restaurantName + '</h1>'
	// 	},
	// 	{
	// 		coords: { lat: 39.961706, lng: -75.162767 },
	// 		content: '<h1>' + restaurantName + '</h1>'
	// 	}
	// ];





	//FOR GOOGLE MAPS ON OUR PROJECT
	// we need to push the coords as an data (the JSON data) to the markersArray
	// getting the longitude and latitude for each result (i) from the api query and pushing it to the markers array
	// for (var i = 0; i < restaurantJSON.restaurants.length; i++) {

	// 	console.log(restaurantJSON.restaurants[i].restaurant)
	//     // markersArray.push({
	//     //     coords: { lat: restaurantJSON.restaurants[i].restaurant.location.latitude, lng: restaurantJSON.restaurants[i].restaurant.location.longitude },
	//     //     content: "<h1>" + restaurantJSON.restaurants[i].restaurant.name + "<h1>"
	//     // })
	// }

	// ==============================================marker array =================================

	//creating the markers on the map by looping through each restaurant on the the markers array





	//this is how you would add a single marker for a prefedined lat and lng, referenced above
	// addMarker({
	//     coords: { lat: lat, lng: lng },
	//     content: '<h1>' + restaurantName + '</h1>'
	// });


}
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


// Append the 'script' element to 'head'
document.head.appendChild(script);