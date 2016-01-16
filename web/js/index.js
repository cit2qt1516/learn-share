//TODO poner las cookies bien para jugar
//document.cookie = "studentID=5670112c87de8b0325000001";
//document.cookie = "studentID=566d36c5e9c246690f000001";

window.onload = function () {
    GetTeachers();
    GetTopTeachers();
    GetDistanceTeachers();
};

function GetTeachers() {
    $.ajax({
        url: "http://localhost:3000/teachers/" + getCookie("studentID"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var text = '<tr onclick=gotoTeacherProfile(\"' + data[i].username + '\")> <td>' + data[i].subjects[0] + '</td> <td>' + data[i].username + '</td> <td>' + data[i].votes + '</td> </tr>';
                $(text).appendTo($('#main_table_body'));
            }
        },
        error: function () {
            window.alert("No se ha obtenido la lista de profesores");
        }
    });
}

function GetTopTeachers() {
    $.ajax({
        url: "http://localhost:3000/teachersVotes",
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var text = '<tr onclick=gotoTeacherProfile(\"' + data[i].username + '\")> <td>' + data[i].subjects[0] + '</td> <td>' + data[i].username + '</td> <td>' + data[i].votes + '</td> </tr>';
                $(text).appendTo($('#top_table_body'));
            }
        },
        error: function () {
            window.alert("No se ha obtenido el Top de profesores");
        }
    });
}

function GetDistanceTeachers() {
    $.ajax({
        url: "http://localhost:3000/find/" + getCookie("studentID"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var text = '<tr onclick=gotoTeacherProfile(\"' + data[i].username + '\")> <td>' + data[i].subjects[0] + '</td> <td>' + data[i].username + '</td> <td>' + data[i].votes + '</td> </tr>';
                $(text).appendTo($('#distance_table_body'));
            }
        },
        error: function () {
            window.alert("No se ha obtenido la lista de profesores por distancia");
        }
    });
}

function gotoTeacherProfile(i) {
    document.cookie = "teacherUsername=" + i;
    window.location.href = "TeacherProfile.html";
}

function GetTeachersByDistance() {
    $.ajax({
        url: "http://localhost:3000/find/" + getCookie("studentID"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            console.log(data);
            for (var i = 0; i < data.length; i++) {
                $('<h3> <strong> Nombre: </strong>' + data[i].name + '</h3>').appendTo($('#teacher_profile'));
                $('<h3> <strong> Asignaturas: </strong>' + data[i].subjects[0] + '</h3>').appendTo($('#teacher_profile'));
                $('<h3> <strong> Votos: </strong>' + data[i].votes + '</h3>').appendTo($('#teacher_profile'));
            }

        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function GetTeachersByVotes(order) {
    $.ajax({
        url: "http://localhost:3000/teachersVot/" + getCookie("studentID"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (dat) {
            var data;
            if (order == 0)
                data = dat.reverse();
            else
                data = dat;

            $('#main_table_body').empty();
            for (var i = 0; i < data.length; i++) {
                var text = '<tr onclick=gotoTeacherProfile(\"' + data[i].username + '\")> <td>' + data[i].subjects[0] + '</td> <td>' + data[i].username + '</td> <td>' + data[i].votes + '</td> </tr>';
                $(text).appendTo($('#main_table_body'));
            }
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function GetTeachersByName(order) {
    $.ajax({
        url: "http://localhost:3000/teachersName/" + getCookie("studentID"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (dat) {
            var data;
            if (order == 0)
                data = dat.reverse();
            else
                data = dat;

            $('#main_table_body').empty();
            for (var i = 0; i < data.length; i++) {
                var text = '<tr onclick=gotoTeacherProfile(\"' + data[i].username + '\")> <td>' + data[i].subjects[0] + '</td> <td>' + data[i].username + '</td> <td>' + data[i].votes + '</td> </tr>';
                $(text).appendTo($('#main_table_body'));
            }
        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}

function GetTeachersByNameInv() {
    $.ajax({
        url: "http://localhost:3000/teachersNameInv",
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            console.log(data);
            for (var i = 0; i < data.length; i++) {
                $('<h3> <strong> Nombre: </strong>' + data[i].name + '</h3>').appendTo($('#teacher_profile'));
                $('<h3> <strong> Asignaturas: </strong>' + data[i].subjects[0] + '</h3>').appendTo($('#teacher_profile'));
                $('<h3> <strong> Votos: </strong>' + data[i].votes + '</h3>').appendTo($('#teacher_profile'));
            }

        },
        error: function () {
            window.alert("NO FUNCIONA");
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