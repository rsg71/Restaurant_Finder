
$(function() {

document.body.onclick = function(e) {   //when the document body is clicked
    if (window.event) {
        e = event.srcElement;           //assign the element clicked to e (IE 6-8)
    }
    else {
        e = e.target;                   //assign the element clicked to e
    }

    if (e.className && e.className.indexOf('addRestaurant') != -1) {
        //if the element has a class name, and that is 'someclass' then...
          event.preventDefault();
        var id = $(this).data("id");
        var favRestuarants = {
            fav : 1
        };

        console.log(id);
        console.log(favRestuarants);
        console.log("CLICKED");
        $.ajax("/api/restaurants/" + id, {
            type: "PUT",
            data: favRestuarants
        }).then(function() {
            console.log("Restaurants added");
            location.reload();
        });
    }
}

function saveRestaurant(event) {
     event.preventDefault();
        var id = $(this).data("id");
        var favRestuarants = {
            fav : 1
        };

        console.log(id);
        console.log(favRestuarants);
        console.log("CLICKED");
        $.ajax("/api/restaurants/" + id, {
            type: "PUT",
            data: favRestuarants
        }).then(function() {
            console.log("Restaurants added");
            location.reload();
        });
}

    $(".addRestaurant").on("click", function(event) {
        event.preventDefault();
        var id = $(this).data("id");
        var favRestuarants = {
            fav : 1
        };

        console.log(id);
        console.log(favRestuarants);
        console.log("CLICKED");
        $.ajax("/api/restaurants/" + id, {
            type: "PUT",
            data: favRestuarants
        }).then(function() {
            console.log("Restaurants added");
            location.reload();
        });
    });

    $("#addRestaurant").on("click", function(event) {
        console.log("CLICKED");
        event.preventDefault();
        const newRestaurant = {
            restaurant_name: $("#restaurantName").val().trim(),
            fav: 0
        };
        $.ajax("/api/restaurants", {
            type: "POST",
            data: newRestaurant
        }).then(function() {
            location.reload();
        });
    });

    $(".deleterestaurant").on("click", function(event) {
        event.preventDefault();
        console.log("CLICKED");
        const restaurantID = $(this).attr("data-id");
        console.log(restaurantID);

        $.ajax("/api/restaurants/" + restaurantID, {
            method: "DELETE"
        }).then(function() {
            window.location = "/"
        });
    });
});