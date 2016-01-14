/**
 * Created by alfredo on 10/01/16.
 */

function PostProfile() {

//TODO PONER LOS CAMPOS BIEN
    var k = new Object();
    k.name = "Lucia";
    k.username = "lucia";
    k.pass = "1234";
    var data = JSON.stringify(k);

    $.ajax({
        url: "http://localhost:3000/teachers",
        type: 'POST',
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