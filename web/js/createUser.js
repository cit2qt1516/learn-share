function createProfile() {
    var name = $('#name').val();
    var username = $('#username').val();
    var email = $('#email').val();
    var pass = $('#pass').val();
    var pass2 = $('#pass2').val();
    var profile = "";
    if (document.getElementById('student').checked)
        profile = "student";
    if (document.getElementById('teacher').checked)
        profile = "teacher";

    if (pass === pass2) {
        var k = new Object();
        k.name = name;
        k.username = username;
        k.email = email;
        k.pass = pass;
        k.profile = profile;
        var data = JSON.stringify(k);

        console.log(data);

        $.ajax({
            url: "http://localhost:3000/" + profile + "s",
            type: 'POST',
            crossDomain: true,
            dataType: "json",
            contentType: 'application/json',
            data: data,
            success: function (data) {
                console.log(data);
                if (profile === "student") {
                    setCookie("studentID", data, "1");
                    setCookie("studentUsername", username, "1");
                    setCookie("profile", profile, "1");

                    window.location.href = "index.html";
                } else {
                    setCookie("teacherID", data, "1");
                    setCookie("teacherUsername", username, "1");
                    setCookie("profile", profile, "1");

                    window.location.href = "indexTeacher.html";
                }
            },
            error: function () {
                window.alert("Ese username ya está en uso");
            }
        });
    } else {
        window.alert("Las contraseñas no coinciden");
    }
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}