function updateProfile() {
    var pl = $("#location").val();
    var lat = pl.split(', ')[0];
    var long = pl.split(', ')[1];

    var k = new Object();
    k.name = $('#name').val();
    k.email = $('#email').val();
    k.lat = lat;
    k.long = long;
    var data = JSON.stringify(k);

    $.ajax({
        url: "http://localhost:3000/teacher/juan",
        type: 'PUT',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data) {
            window.alert("FUNCIONA");
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        {
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            {
            }
        }
    }
    return "";
}

// Google Maps - Geocoding
var geocoder;
var map;
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(41.275493, 1.986945);
    var mapOptions = {
        zoom: 11,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

function codeAddress() {
    var address = $('#address').val();
    console.log(address);
    geocoder.geocode({'address': address}, function (results, status) {
        console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
            $("#location").val(results[0].geometry.viewport.N.N.toFixed(4) + ", " + results[0].geometry.viewport.j.N.toFixed(4));
            console.log(results[0].geometry.location);
            map.setCenter(results[0].geometry.location);
            map.setZoom(15);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

google.maps.event.addDomListener(window, 'load', initialize);