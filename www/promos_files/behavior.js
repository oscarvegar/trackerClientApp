var file;
var files = [];
$(document).ready(function(e){
    $('.product-item').css('height', $('.product-item').width() + 'px');
    $('.product-qty1').css('width', $('.product-item').width() + 'px');
    $('.more-qty').click(function(){
        setTimeout(function(){
      	  $('.frm-cart-icon').css('background-size','38px');
      	  $('.frm-cart-icon').css('margin-top','-5px');
        }, 400);
        $('.frm-cart-icon').css('background-size','30px');
        $('.frm-cart-icon').css('margin-top','0px');
      });
    $('.less-qty').click(function(){
        setTimeout(function(){
      	  $('.frm-cart-icon').css('background-size','38px');
      	  $('.frm-cart-icon').css('margin-top','-5px');
        }, 400);
        $('.frm-cart-icon').css('background-size','30px');
        $('.frm-cart-icon').css('margin-top','0px');
      });
    var products = $('#cart').html();
    var $popover = $('#launch').popover({
        html: true,
        container: 'body',
        content: products,
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    $('#launch').on("shown.bs.popover", function() {
    	var products = $('#cart').html();
    	$('.popover-content').html(products);
    });
    $('#user-register').click(function(){
    	$('#email').fadeOut();
    	$('#emailUse').fadeOut();
    	$('#idFechanacimientoError').fadeOut();
    	$('#nombre').fadeOut();
    	$('#password').fadeOut();
    	$('#comoSeEntero').fadeOut();

    	$('#text-nombre').val("");
    	$('#text-email').val("");
    	$('#text-password').val("");
    	$('#dia').val('0');
    	$('#mes').val('0');
    	$('#anio').val('0');
    	$('#enterado').val('0');
    	$('#div-foto-perfil').css("display", "block");
    	$('#idTRInvalidEmail').fadeOut();
    	if ($('#esFacebook').val() == 1) {
    		$('#div-contrasena').css("display", "block");
    		$('#esFacebook').val(0);
    	}
    	$('#IdCmpCorreo').val("");
    	$('#inputPass').val("");
        $('#step-log').fadeOut(function(){
            $('#step-reg').fadeIn(function () {
            });
        });
    });
    $('#user-login').click(function(){
        $('#step-reg').fadeOut(function(){
            $('#step-log').fadeIn();
        });
    });
    $('.carousel').carousel({
        interval: 5000,
        wrap: true
    });

    //Boton login
    $('#btnLogin').click(function (){

		var form = $('form')[0];
		var event = "login";
		try {
			$('#errorMessage').css('display', 'none');
			$('#idTRInvalidEmail').css('display', 'none');
			$('#idTRInvalidPass').css('display', 'none');
	        $('#idIMGLoad').show();
	    } catch(Exception){}
	    var correo = $('input[type=text][name=correo]').val();
	    var password = $('input[type=password][name=password]').val();
	    //var valido = false;
	    var valido = true;

//	    if(correo == '' && password == '') {
//	    	$('#errorMessage').css('display', 'block');
//	    	$('#idIMGLoad').hide();
//	    } else if(correo == '' && password != '') {
//	    	$('#idTRInvalidEmail').css('display', 'block');
//	    	$('#idIMGLoad').hide();
//	    } else if(correo != '' && password == '') {
//	    	$('#idTRInvalidPass').css('display', 'block');
//	    	$('#idIMGLoad').hide();
//	    } else if(correo != '' && password != '') {
//	    	valido = true;
//	    	try {
//				$('#errorMessage').css('display', 'none');
//				$('#idTRInvalidEmail').css('display', 'none');
//				$('#idTRInvalidPass').css('display', 'none');
//		        $('#idIMGLoad').show();
//		    } catch(Exception){}
//	    }

	    correo = '&correo=' + correo;
	    password = '&password=' + password;

	    params = {};

	    if (event != null) params = event + '&' + $(form).serialize();
	    params += correo + password;

	    if(valido) {
	    	$.ajax({
	    	     type: "POST",
	    	     url: form.action,
	    	     cache: false,
	    	     data: params,
	    	     success: function(data) {
	    	    	 var messages = eval(data);
	    	        	for (var field in messages) {
	    	            	var message = messages[field];
	    	            	for (line in message) {
	    	            		eval(message[line]);
	    	                	try {
	    	                		$('#idIMGLoad').hide();
	    	                	} catch(Exception){}
	    	            	}
	    	        	}
	    	     }
	    	 });
	    }
	    return false;
		//solicitarLogin(form, event);
	});
    $('select[id="enterado"][class="service-type"]').change(function () {
    	if ($('select[id="enterado"][class="service-type"] option:selected').val() == 1) {
    		$('#div-codigo-prospectista').fadeIn();
    	} else {
    		$('#div-codigo-prospectista').fadeOut();
    	}
    });
    $('#btnRecuperar').on('click', function(){
    	$('#idTRInvalidEmail1').fadeOut();
        $('#step-log').fadeOut(function(){
            $('#step-recovery').fadeIn();
        });
    });
    $('#log-back').on('click', function(){
    	$('#recuperarCorreo').val("");
    	$('#IdCmpCorreo').val("");
    	$('#inputPass').val("");
    	$('#idTRInvalidEmail').fadeOut();
        $('#step-recovery').fadeOut(function(){
            $('#step-log').fadeIn();
        });
    });

    $('input[type=file][class=selector]').on('change', function(event) {
    	if (event.target.files.length == 1) {
    		file = event.target.files[0];
    		$('#namePhoto').text(file.name);
    	} else {
    		$('#namePhoto').text("Sin foto de perfil");
    	}
    });

    $('#photoSimulador').click(function() {
    	$('#photoSelected').click();
    });

    $('#img-perfil-cf').ready(function () {
    	$.ajax({
            url: $('#img-perfil-cf').attr("src"),
            type: "HEAD",
            success: function () {
            	console.log("Carga exitosa...");
            },
            error: function () {
            	console.log("Carga con error...");
            	var uifb = $('#img-perfil-uifb').val();

            	if (uifb == 0){
            		$('#img-perfil-cf').attr("src", "images/profile-photo-ex_2.jpg");
            	} else {
            		$('#img-perfil-cf').attr("src", "http://graph.facebook.com/" + uifb + "/picture?type=large");
            	}
            }
        });
    });

});
$(window).resize(function(){
    resizeElement();
});
function resizeElement(){
    $('.product-item').css('height', $('.product-item').width() + 'px');
    $('.product-qty1').css('width', $('.product-item').width() + 'px');
}
function launchLogin(){
    $.magnificPopup.open({
        items: {
            src: '#login-popup'
        },
        fixedContentPos: true,
        fixedBgPos: false,
        closeOnBgClick: false,
        showCloseBtn: true,
        closeBtnInside: true,
        preloader: false,
        enableEscapeKey: true,
        type: 'inline',
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    }, 0);
}
function presionarEnter() {
	var form = $('form')[0];
	var event = "login";
	try {
		$('#errorMessage').css('display', 'none');
		$('#idTRInvalidEmail').css('display', 'none');
		$('#idTRInvalidPass').css('display', 'none');
        $('#idIMGLoad').show();
    } catch(Exception){}
    var correo = $('input[type=text][name=correo]').val();
    var password = $('input[type=password][name=password]').val();
    //var valido = false;
    var valido = true;

//    if(correo == '' && password == '') {
//    	$('#errorMessage').css('display', 'block');
//    	$('#idIMGLoad').hide();
//    } else if(correo == '' && password != '') {
//    	$('#idTRInvalidEmail').css('display', 'block');
//    	$('#idIMGLoad').hide();
//    } else if(correo != '' && password == '') {
//    	$('#idTRInvalidPass').css('display', 'block');
//    	$('#idIMGLoad').hide();
//    } else if(correo != '' && password != '') {
//    	valido = true;
//    	try {
//			$('#errorMessage').css('display', 'none');
//			$('#idTRInvalidEmail').css('display', 'none');
//			$('#idTRInvalidPass').css('display', 'none');
//	        $('#idIMGLoad').show();
//	    } catch(Exception){}
//    }

    correo = '&correo=' + correo;
    password = '&password=' + password;

    params = {};

    if (event != null) params = event + '&' + $(form).serialize();
    params += correo + password;

    if(valido) {
    	$.ajax({
    	     type: "POST",
    	     url: form.action,
    	     cache: false,
    	     data: params,
    	     success: function(data) {
    	    	 var messages = eval(data);
    	        	for (var field in messages) {
    	            	var message = messages[field];
    	            	for (line in message) {
    	            		eval(message[line]);
    	                	try {
    	                		$('#idIMGLoad').hide();
    	                	} catch(Exception){}
    	            	}
    	        	}
    	     }
    	 });
    }
    return false;
}

function validaRegistroStripes(form, evento, idImgLoad, params) {

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
     success: function(data) {
    	 if (data.search("promos.action") > 0) {
    		 var oid;
    		 var redireccion;

        	 var messages = eval(data);
        	 for (var field in messages) {
        		 var message = messages[field];
        		 var objeto = JSON.parse(message);
        		 oid = objeto.IOD;
        		 redireccion = [objeto.redireccion];
        	 }
        	 var oMyForm = new FormData();
  		 	 oMyForm.append(oid+".jpg", file);

  		    $.ajax({
  		    	url: "UpLoadServer",
  		        type: 'POST',
  		        dataType: 'text',
  		        enctype: 'multipart/form-data',
  		        processData: false,
  		        contentType: false,
  		        data: oMyForm,
  		        success: function(data1) {
  		        	for (line in redireccion) {
  		        		console.log(redireccion[line]);
  	                	 eval(redireccion[line]);
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
  		    });
         } else {
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
     }
 });
}
