//Zomato api key
//b1c2932740aae152b58849a59384d428
class Zomato {
	constructor() {
		this.api = "b1c2932740aae152b58849a59384d428";
		this.header = {
			method: 'GET',
			headers: {
				'user-key': this.api,
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin'
		}
	}

	async searchAPI(city, categoryID) {
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
	}

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
						zomato.searchAPI(cityValue, categoryValue)
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
