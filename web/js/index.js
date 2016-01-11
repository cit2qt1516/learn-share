/**
 * Created by alfredo on 10/01/16.
 */
    //TODO poner las cookies bien para jugar
document.cookie="studentID=5670112c87de8b0325000001"
function GetTeachers() {

    $.ajax({
        url: "http://localhost:3000/teachers/" + getCookie("studentID"),
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
                setCookie("teacherUsernames",data[i].username,"1");
                console.log(getCookie("teachersUsernames"));
            }

        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
}
function GetTeachersByDistance() {

    $.ajax({
        url: "http://localhost:3000/find/"+ getCookie("studentiD"),
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

function GetTeachersByVotes() {

    $.ajax({
        url: "http://localhost:3000/teachersVot",
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

function GetTeachersByName() {

    $.ajax({
        url: "http://localhost:3000/teachersName",
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