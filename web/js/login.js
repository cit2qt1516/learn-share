/**
 * Created by alfredo on 10/01/16.
 */

function LoginProfile() {

//TODO PONER LOS CAMPOS BIEN
    var k = new Object();
    k.username = "lucia";
    k.pass = "1234";
    var data = JSON.stringify(k);
      $.ajax({

        url: "http://localhost:3000/login",
        type: 'POST',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data) {
            console.log(data);
            setCookie("username",data.username,"1");
            console.log(getCookie("username"));
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
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