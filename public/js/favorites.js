$.get("/api/restaurants/", function(data) {


    console.log(data)
    // For each favorite that our server sends us back
    for (var i = 0; i < data.length; i++) {
     

        $("#favorites-list").append("<h2>" + data[i].name + "<h2>");
        $("#favorites-list").append("<p>Address: " + data[i].address + "<p>");
        $("#favorites-list").append("<p>Rating: " + data[i].rating + "<p>");
        $("#favorites-list").append("<p>Description: " + data[i].description + "<p>");
        $("#favorites-list").append("<a href=" + data[i].menuLink + ">" + "Website" + "<p>");

  
      
    }
  });