/**
 * Created by alfredo on 10/01/16.
 */

function getProfile() {

    var button_vote=document.getElementById("button_vote");

    $("#user_profile").text('');

    $("#user_profile").text('');
    $('<h3> <strong> Name: </strong>' + getCookie('name') + '</h3>').appendTo($('#user_profile'));
    //$('<p>').appendTo($('#user_profile'));

    $('<h4><strong> Username: </strong> ' + getCookie('username') + '<br> </h4>').appendTo($('#user_profile'));

    $('<h4><strong> Email: </strong> ' + getCookie('email') + '<br> </h4>').appendTo($('#user_profile'));

    $('<strong> ' + getCookie('points') + '</strong> Points <br>').appendTo($('#points'));
    $('<strong> Max Points: ' + getCookie('points_max') + '</strong><br>').appendTo($('#points'));

    if (getCookie('groupid') ==0){
        $('<strong> No </strong>'+ 'estas en ningun grupo aun!').appendTo($('#group'));
        $('<button type="button" class="btn btn-primary" style="float:right" id="button_group">Busca un grupo</button>').appendTo($('#group'));
    }
    else if(getCookie('groupid') !=0){
        $('<strong> GroupID: ' + getCookie('groupid') + '</strong><br>').appendTo($('#group'));

        if(getCookie('troll')==true){
            $('<strong> Eres el Troll! </strong>').appendTo($('#group'));
            button_v.style.visibility='hidden';			//oculto
            button_v.style.display = 'none';				//no ocupa espacio
            $("#imagen").attr("src", "/img/utroll.png");
            $("#imagen").attr("height", 150);
        }
        else {
            $('<strong> No eres el Troll del grupo! </strong>').appendTo($('#group'));
        }
    }
}

function modifyUser() {
    var u=getCookie('username');
    var p=getCookie('password');

    var url = API_BASE_URL + '/users';

    var user = new Object();
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    user.username=getCookie('username');
    user.password=getCookie('password');

    user.name = $("#name").val();
    user.email = $("#email").val();
    user.age = $("#age").val();

    if ((user.name=="")||(user.email=="")||(user.age="")) {
        window.alert("Debes rellenar los tres campos!");
    }else if ( !expr.test(user.email) ){
        window.alert("Introduce una dirección de correo valida.");
    }else	{

        var data = JSON.stringify(user);

        $.ajax({
            headers : {
                'Authorization' : "Basic " + btoa(u + ':' + p)
            },
            url : url,
            type : 'PUT',
            crossDomain : true,
            dataType : 'json',
            contentType : 'application/vnd.uTroll.api.user+json',
            data : data,
        }).done(function(data, status, jqxhr) {
            window.alert("Actualizado!");

            document.cookie="name="+user.name;
            document.cookie="email="+user.email;

            window.location.reload();
        }).fail(function() {
            window.alert("FAIL Update User");
        });
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);{
            if (c.indexOf(name) == 0) return c.substring(name.length,c.length);{}}
    }
    return "";
}