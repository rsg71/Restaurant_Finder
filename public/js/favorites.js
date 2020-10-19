$.get("/api/restaurants/", function(data) {


    console.log(data)
    // For each favorite that our server sends us back
    for (var i = 0; i < data.length; i++) {
     

        $("#favorites-list").append("<p>Name: " + data[i].name + "<p>");
        $("#favorites-list").append("<p>Rating: " + data[i].rating + "<p>");
        $("#favorites-list").append("<p>Address: " + data[i].address + "<p>");
        
  
      
    }
  });