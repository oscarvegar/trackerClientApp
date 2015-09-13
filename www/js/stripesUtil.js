jQuery.fn.extend({
    param: function( a ) {
        var s = [];
        // If an array was passed in, assume that it is an array
        // of form elements
        if ( a.constructor == Array || a.jquery ){
            // Serialize the form elements
            jQuery.each( a, function(){
                s.push(unescape(encodeURIComponent(escape(this.name))) + "=" + unescape(encodeURIComponent(escape(this.value))));
            });
        }
        // Otherwise, assume that it's an object of key/value pairs
        else{
            // Serialize the key/values
            for ( var j in a )
                // If the value is an array then the key names need to be repeated
                if ( a[j] && a[j].constructor == Array )
                    jQuery.each( a[j], function(){
                        s.push(unescape(encodeURIComponent(escape(j)) + "=" + encodeURIComponent(escape(this))));
                    });
                else
                    s.push(unescape(encodeURIComponent(escape(j)) + "=" + encodeURIComponent(escape(a[j]))));
        }
        // Return the resulting serialization
        return s.join("&").replace(/ /g, "+");
    },
    serialize: function() {
        return this.param(this.serializeArray());
    }
});


function validateStripes(form, evento) {
    try {
        $('#idIMGLoad').show();
        $('#idSubmit').hide();
        $('#login-btn').hide();
        $('#idSubmitAdjunto').hide();
        $('#idSubmitLink').hide();
        $('#idSubmitImagen').hide();
        $('#idSecurityError').hide();
    } catch(Exception){}
    var params = $(form).serialize();
    params += "&_eventName=" + evento;
    $.ajax({
     type: "POST",
     url: form.action,
     cache: false,
     data: params,
     success: function(data){
        var messages = eval(data);
        for (var field in messages) {
            var message = messages[field];

            for (line in message) {
                eval(message[line]);
                try {
                $('#idIMGLoad').hide();
                $('#idSubmit').show();
                $('#login-btn').show();
                $('#idSubmitAdjunto').show();
                $('#idSubmitLink').show();
                $('#idSubmitImagen').show();
                } catch(Exception){}
            }
        }
     }
 });
}

/**
 * La unica diferencia con el anterior es la imagen de cargando dinamica (por par�metro).
 */
function validateStripes(form, evento, idImgLoad) {
    try {
        $('#' + idImgLoad).show();
        $('#idSubmit').hide();
        $('#login-btn').hide();
        $('#idSubmitAdjunto').hide();
        $('#idSubmitLink').hide();
        $('#idSubmitImagen').hide();
        $('#idSecurityError').hide();
    } catch(Exception){}
    var params = $(form).serialize();
    params += "&_eventName=" + evento;
    $.ajax({
     type: "POST",
     url: form.action,
     cache: false,
     data: params,
     success: function(data){
        var messages = eval(data);
        for (var field in messages) {
            var message = messages[field];

            for (line in message) {
                eval(message[line]);
                try {
                $('#' + idImgLoad).hide();
                $('#idSubmit').show();
                $('#login-btn').show();
                $('#idSubmitAdjunto').show();
                $('#idSubmitLink').show();
                $('#idSubmitImagen').show();
                } catch(Exception){}
            }
        }
     }
 });
}

function invokeStripes(form, event, container) {
    try {
        $('#idIMGLoad').show();
    } catch(Exception){}
    params = {};
    if (event != null) params = event + '&' + $(form).serialize();
    $.ajax({
        type: "POST",
        url: form.action,
        cache: false,
        data: params,
        success: function(data){
            try {
                $('#idIMGLoad').hide();
            } catch(Exception){}
            $(container).html(data);
        }
    });
}



function invokeStripesShowMesage(form, event, container) {
    try {
        $('#idIMGLoad').show();
    } catch(Exception){}
    params = {};
    if (event != null) params = event + '&' + $(form).serialize();
    $.ajax({
        type: "POST",
        url: form.action,
        cache: false,
        data: params,
        success: function(data){
            try {
                $('#idIMGLoad').hide();
            } catch(Exception){}
            //alert(data);
            //alert( "data " + data.indexOf("errorMessage") );
            if( data.indexOf("errorMessage") > 0   ){
                $('#errorMessageCoberturaMovil').show();
            }else{
                $('#errorMessageCoberturaMovil').hide();
            }
            //$(container).html(data);
        }
    });
}



function updateStripes(form, event) {
    params = {};
    if (event != null) {
        params = event + '&' + $(form).serialize();
    }
    $.ajax({
        type: "POST",
        url: form.action,
        cache: false,
        data: params,
        success: function(data) {}
    });
}
