/**
 * Created by alfredo on 10/01/16.
 */

function getProfile() {

    //TODO poner las cookies bien para jugar
    document.cookie = "teachername=juan"
    // GET
    $.ajax({
        url: "http://localhost:3000/teacher/" + getCookie("teachername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {
            $("#user_profile").text('');

            console.log(data);

            $('<h3> <strong> Nombre: </strong>' + data.name + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Username: </strong>' + data.username + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Email: </strong>' + data.email + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Asignaturas: </strong>' + data.subjects + '</h3>').appendTo($('#teacher_profile'));
            $('<h3> <strong> Votos: </strong>' + data.votes + '</h3>').appendTo($('#teacher_profile'));

        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });
    $.ajax({
        url: "http://localhost:3000/comments/" + getCookie("teachername"),
        type: 'GET',
        crossDomain: true,
        dataType: "json",
        contentType: 'application/json',
        success: function (data) {

            $('<h3> <strong> Comentarios: </strong>').appendTo($('#teacher_profile'));

            console.log(data[1]);
            for(var i=0; i<data.length; i++){
                $('<h3> <strong> Nombre: </strong>' + data[i].student + ' '+ data[i].time +'</h3>' ).appendTo($('#teacher_profile'));
                $('<p>'+data[i].content +'</p>').appendTo($('#teacher_profile'));

            }

        },
        error: function () {
            window.alert("NO FUNCIONA");
        }
    });

}
function  PostComment(){
    //TODO PONER LOS CAMPOS BIEN
    var k = new Object();
    k.content = "Lucia";
    k.student = "lucia";
    k.teacher = "juan"
    var data = JSON.stringify(k);

    $.ajax({
        url: "http://localhost:3000/comments",
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