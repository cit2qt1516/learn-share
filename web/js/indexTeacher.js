window.onload = function () {
    document.cookie = "teacherUsername=juan";
    getProfile();
};

function getProfile() {
    // GET perfil profesor
    $.ajax({
        url: "http://localhost:3000/teacher/" + getCookie("teacherUsername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            $('<h3> <strong> Nombre: </strong>' + data.name + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Username: </strong>' + data.username + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Email: </strong>' + data.email + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Asignaturas: </strong>' + data.subjects + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Votos: </strong>' + data.votes + '</h3>').appendTo($('#teacher_profile'));

        },
        error: function () {
            window.alert("No se obtuvo el perfil del profesor");
        }
    });

    // GET comentarios profesor
    $.ajax({
        url: "http://localhost:3000/comments/" + getCookie("teacherUsername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $('<hr>').appendTo($('#teacher_profile'));
            $('<h2> <strong> COMENTARIOS </strong>').appendTo($('#teacher_profile'));

            for (var i = 0; i < data.length; i++) {
                $('<h3> <strong>' + data[i].student + '</strong> ' + data[i].time + '</h2>').appendTo($('#teacher_profile'));
                $('<p>' + data[i].content + '</p>').appendTo($('#teacher_profile'));

            }
        },
        error: function () {
            window.alert("No se obtuvieron los comentarios del profesor");
        }
    });
}

function postComment() {
    var k = new Object();
    k.content = $('#comment').val();
    k.student = getCookie("teacherUsername");
    k.teacher = getCookie("teacherUsername");
    var data = JSON.stringify(k);

    $.ajax({
        url: "http://localhost:3000/comments",
        type: 'POST',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data) {
            location.reload();
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