//Facebook
var button;
var accessToken;

//Id de la aplicacion en local
//var facebookOptions = {appId: 1496585770600670, perms:'public_profile,email'};
//Id de la aplicacion en Extranet
//var facebookOptions = {appId: 1501133923465704, perms:'public_profile,email'};
//Id de la aplicacion en Produccion
var facebookOptions = {appId: 1559521200934655, perms:'public_profile,email'};

window.fbAsyncInit = function() {

   FB.init({ appId: facebookOptions.appId, status: true, cookie: true, xfbml: true, oauth: true});

	function update(response) {
		button = document.getElementById('btnFacebook');

			button.onclick = function() {
				FB.login(function(response) {
					if (response.authResponse) {
						FB.api('/me/permissions', function(response){
							if(response.data){
								if (checkPerms(facebookOptions.perms, response.data)){
									passData()
								}
								else { // no tiene permisos
									//console.log('no tiene permisos');
								}
							}
						});
					} else { // no esta logeado
						//console.log('no esta logeado');
					}
				}, {scope:facebookOptions.perms});
				return false;
			}

	}

	// run once with current status and whenever the status changes
	FB.getLoginStatus(update);
	FB.Event.subscribe('auth.statusChange', update);
};

(function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/es_LA/all.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));


function login(response, info){

	if (response.authResponse) {
		accessToken = response.authResponse.accessToken;
		if (facebookOptions.loginCallback && typeof(facebookOptions.loginCallback) === "function" ){
			facebookOptions.loginCallback(info);
		}

	}
}

function logout(response){}

function checkPerms(neededPerms, userPerms){

	neededPerms = neededPerms.replace(/\s/g, '');
	var neededPermsArray = neededPerms.split(',');

	var userPermsObject = {};

	for (var i=0; i<userPerms.length; i++){
		userPermsObject[userPerms[i].permission] = 0;
		if (userPerms[i].status == "granted"){
			userPermsObject[userPerms[i].permission] = 1;
		}
	}
	var access = true;

	for (var i=0; i<neededPermsArray.length; i++){
		if (!userPermsObject.hasOwnProperty(neededPermsArray[i])){
			return false;
		}else{
			if (userPermsObject[neededPermsArray[i]] != 1){
				access = false;
			}
		}
	}

	return access;
}

function passData(){
	FB.api('/me', function(response) {
		var idFB = response.id;
        //var idFB =2147483647;
		var nombreFB = response.name;
		var emailFB = response.email;
		//alert('UIFB=' + idFB + '&nombre=' + nombreFB + '&email=' + emailFB + '&fnacimiento=' +fechaNacimientoFB);
		//console.log('UIFB=' + idFB + '&nombre=' + nombreFB + '&email=' + emailFB);
                post_to_url('login.action',{'loginFB':'','correo':emailFB, 'nombre':nombreFB,  'fbid':idFB });
	});

}




function post_to_url(path, params, method, target) {
    method = method || "post";
	target = target || "_self"; // Set method to post by default, if not specified.
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
	form.setAttribute("target", target);
    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);    // Not entirely sure if this is necessary
    form.submit();
    document.body.removeChild(form);
}
