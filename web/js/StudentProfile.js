function getProfile() {
//document.cookie="studentUsername=paco";

    // GET
    $.ajax({
        url: "http://localhost:3000/student/" + getCookie("studentUsername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            console.log(data);

            $('<h3> <strong> Nombre: </strong>' + data.name + '</h3>').appendTo($('#student_profile'));
            $('<h3> <strong> Username: </strong>' + data.username + '</h3>').appendTo($('#student_profile'));
            $('<h3> <strong> Email: </strong>' + data.email + '</h3>').appendTo($('#student_profile'));
            $('<h3> <strong> Asignaturas: </strong>' + data.subjects + '</h3>').appendTo($('#student_profile'));
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