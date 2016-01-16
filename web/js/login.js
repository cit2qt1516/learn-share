function LoginProfile() {
    var k = new Object();
    k.username = $('#username').val();
    k.pass = $('#pass').val();
    var data = JSON.stringify(k);
    $.ajax({
        url: "http://localhost:3000/login",
        type: 'POST',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data) {
            if (data.profile === "student") {
                setCookie("studentID", data.ID, "1");
                setCookie("studentUsername", data.username, "1");
                setCookie("profile", data.profile, "1");

                window.location.href = "index.html";
            } else {
                setCookie("teacherID", data.ID, "1");
                setCookie("teacherUsername", data.username, "1");
                setCookie("profile", data.profile, "1");

                window.location.href = "indexTeacher.html";
            }

        },
        error: function () {
            window.alert("USUARIO O CONTRASEÑA INCORRECTOS");
        }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
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