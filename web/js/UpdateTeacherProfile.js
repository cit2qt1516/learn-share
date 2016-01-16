function updateProfile() {
    var pl = $("#location").val();
    var lat = pl.split(', ')[0];
    var long = pl.split(', ')[1];

    var k = new Object();
    if ($('#name').val() != "") {
        k.name = $('#name').val();
    }
    if ($('#email').val() != "") {
        k.email = $('#email').val();
    }
    if ($('#pass').val() != "") {
        k.pass = $('#pass').val();
    }
    if (document.getElementById("historia").checked) {
        k.subjects = "Historia";
    }
    if (document.getElementById("musica").checked) {
        k.subjects = "Musica";
    }
    if (document.getElementById("matematicas").checked) {
        k.subjects = "Matematicas";
    }
    if (document.getElementById("fisica").checked) {
        k.subjects = "Fisica";
    }
    if (document.getElementById("quimica").checked) {
        k.subjects = "Quimica";
    }
    if (document.getElementById("dibujo").checked) {
        k.subjects = "Dibujo";
    }
    if (document.getElementById("filosofia").checked) {
        k.subjects = "Filosofia";
    }
    if (document.getElementById("literatura").checked) {
        k.subjects = "Literatura";
    }
    if (document.getElementById("programacion").checked) {
        k.subjects = "Programacion";
    }
    if (document.getElementById("tecnologia").checked) {
        k.subjects = "Tecnologia";
    }
    if ($('#location').val() != "") {
        k.lat = lat;
    }
    if ($('#location').val() != "") {
        k.long = long;
    }
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