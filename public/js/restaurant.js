
$(function() {

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
            console.log("Restuarants added");
            location.reload();
        });
    });

    $("#addRestaurant").on("click", function(event) {
        console.log("CLICKED");
        event.preventDefault();
        const newRestaurant = {
            restaurant_name: $("#restaurantName").val().trim(),
            devoured: 0
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

        $.ajax("/api/restaurants/" + burgID, {
            method: "DELETE"
        }).then(function() {
            window.location = "/"
        });
    });
});