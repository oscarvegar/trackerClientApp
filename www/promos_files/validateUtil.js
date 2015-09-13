/*
 *  ValidateUtil JavaScript framework, version XX
 *  (c) 2009 Horacio Cruz
 *
 *  ValidateUtil is freely distributable
 */
var request;
var queryString;

/**
 * Se usa en la validación de front, para cuando haya al menos un error (aunque tambien se podria deja 
 * en la función que pinta los erroes del back, ahi no se usa, pero tal vez para algo serviria despues).
 */
var errors = false;

/* ------------- validación con AJAX ------------- */
/**
 * Hace una cadena con todos los parametros de la forma, listos para ser enviados.
 */
function setQueryString() {
    queryString = "sdfg=1";
    var frm = document.forms[0];
    var numberElements =  frm.elements.length;
    for (var i = 0; i < numberElements; i++) {
        var objNameValue = "";
        var elemento = frm.elements[i];
        if (elemento.type == "radio") {
            if (elemento.checked) {
                objNameValue += "&" + elemento.name + "=" + encodeURIComponent(elemento.value);
            }
        } else if (elemento.type == "checkbox") {
            if (elemento.checked) {
                objNameValue += "&" + elemento.name + "=" + encodeURIComponent(elemento.value);
            }
        } else if (elemento.type == "textarea") {
            try {
              objNameValue += "&" + elemento.name + "=" + encodeURIComponent(trim(tinyMCE.getContent()));
            } catch (Exception) {
              objNameValue += "&" + elemento.name + "=" + encodeURIComponent(elemento.value);
            }
        } else if (elemento.type == "select-multiple") {
            for (var j = 0; j < elemento.length; j++) {
                if (elemento.options[j].selected) {
                    objNameValue += "&" + elemento.name + "=" + encodeURIComponent(elemento.options[j].value);
                }
            }
        } else {
            objNameValue += "&" + elemento.name + "=" + encodeURIComponent(elemento.value);
        }
        queryString += objNameValue;
    }
}

/**
 * Creamos el control XMLHttpRequest segun el navegador en el que estemos 
 */
function getAJAX() {
    try{
        xmlhttp= new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try{
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
            xmlhttp=false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
        xmlhttp=new XMLHttpRequest();
    }
    return xmlhttp;
} 

/**
 * Se encarga de llamar la pagina de validacion, el do.
 * where    página donde se valida la forma, generalmente sera un do...
 */
function ajaxIt(where) {
    setQueryString(); 
    /* Creamos el control XMLHttpRequest segun el navegador en el que estemos */
    request = getAJAX();

    /* Almacenamos en el control la función que se invocará cuando la petición cambie de estado	*/
    request.onreadystatechange = handleResponse;

    request.open("POST", where, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    request.send(queryString);
}

/**
 * Llega a esta función despues de llamar asincronamente la página definida
 * en la función ajaxIt() y si:
 * Tiene errores (regresa XML y entra al try) manda a la función handleXML, o si
 * NO tiene errores (NO regresa XML y entra al catch) manda a la función notHandleXML.
 */
function handleResponse() {
    /* Comprobamos si la peticion se ha completado (estado 4) */
    if (request.readyState == 4) {
        /* Comprobamos si la respuesta ha sido correcta (resultado HTTP 200) */
        if (request.status == 200) {
            try {
                var xmlObject = request.responseXML;
                /* obtiene el item root del XML */
                var root = xmlObject.getElementsByTagName("errors")[0];

                /**
                 * Se manda llamar esta función si regresa un XML.
                 *
                 * root     item root del XML.
                 */
                handleTry(root);
            } catch (Exception) {
                /**
                 * Si ya no hay errores manda una exception (pq ya no encontró elementos en el XML)
                 * Se manda llamar esta función si NO regresa un XML.
                 *
                 * request     valor der request que se obtiene de llamar asincronamente la
                 *             la página definida en la función ajaxIt() [getAJAX()].
                 */
                handleCatch(request);
            }
        } else {
            alert(request.responseText);
        }
    }
}

/**
 * Cambia el estilo de un TD a 'error' si el TD maneja dos tipos de errores no funciona y se tendrá 
 * que hacer sin llamar esta función.
 * root     elemento raiz del XML
 * tagName  elemento de error a buscar en el XML
 * idTD     id del TD cuyo estilo cambiara en caso de ser error
 */
function setErrorOnTDFromXML(root, tagName, idTD) {
    var someError = root.getElementsByTagName(tagName)[0];
    var lbl = document.getElementById(idTD);
    if (someError != null) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}

/**
 * Muestra un TD siempre y cuando exista el error en el XML.
 * root     elemento raiz del XML
 * tagName  elemento de error a buscar en el XML
 * idTD     id del TD cuyo estilo cambiara en caso de ser error
 */
function setShowOnTDFromXML(root, tagName, idTD) {
    var someError = root.getElementsByTagName(tagName)[0];
    var lbl = document.getElementById(idTD);
    if (someError != null) {
        showElement(idTD, true);
    } else {
        showElement(idTD, false);
    }
}

/**
 *  verifica si en el XML existe el error
 *  root     elemento raiz del XML
 *  tagName  elemento de error a buscar en el XML
 */
function existError(root, tagName){
    var someError = root.getElementsByTagName(tagName)[0];
    if (someError != null) {
        return true;
    } else {
        return false;
    }
}

/**
 *  limpia los mensajes de error
 *  idTDs arreglo de los identificadores de tags de los errores
 */
function limpiarMensajes(idTDs){
	//var idTDs = ["idTRNotMatch","idTRExisteFacebook","idTRError"];
	for(i=0; i<idTDs.length; i++){
		showElement(idTDs[i], false);
	}
}

/* ------------- validación con AJAX ------------- */

/* ------------- basicamente validación de archivos ------------- */
function setError(idTD, hasError) {
    var lbl = document.getElementById(idTD);
    if (hasError) {
        lbl.className = lbl.className.indexOf(" error") == -1 ? lbl.className + " error" : lbl.className;
    } else {
        lbl.className = lbl.className.replace(" error", "");
    }
}

function redirect(where) {
    document.location.href = where;
}
/* ------------- basicamente validación de archivos ------------- */

function showElement(idElement, show) {
    var navegador = navigator.appName;
    var lbl = document.getElementById(idElement);
    if (show) {
        if (navegador == "Microsoft Internet Explorer") {
            lbl.style.display = 'block';
        } else {
            lbl.style.display = 'block';
        }
    } else {
        lbl.style.display = 'none';
    }
}

function changeElement(idElementOld, idElementNew) {
    showElement(idElementOld, false);
    showElement(idElementNew, true);
}

function replaceElement(idElementOld, idElementNew) {
    var lblOld = document.getElementById(idElementOld);
    var lblNew = document.getElementById(idElementNew);
    lblOld.innerHTML = lblNew.innerHTML;
}

/* ------------- Sólo validación en front (como para formmail) ------------- */

/**
 * Javascript increiblemente no posee una función trim (una función que quite 
 * los espacios en blanco al principio y final de la cadena). Con expresiones 
 * regulares podemos facilmente realizarla.
 */
function trim(cadena) {
   cadena = cadena.replace(/^\s+/, '').replace(/\s+$/, '');
   return(cadena);
}

/**
 * Valida que la cadena enviada no este vacia o llena de espacios en blanco.
 */
function validateTextValue(textValue, idTD) {
    var lbl = document.getElementById(idTD);
    if (trim(textValue) == "") {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}

/**
 * Valida que un campo tipo TEXT no este vacio o lleno de espacios en blanco.
 */
function validateText(text, idTD) {
    validateTextValue(text.value, idTD);
}

/**
 * Valida que un campo tipo SELECT no tenga seleccionada la opcion seleccione,
 * siempre y cuando tenga en su attribute value el valor de '0' (cero).
 */
function validateSelect(select, idTD) {
    var lbl = document.getElementById(idTD);
    if (select.value == "0") {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
   } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}


/**
 * Valida que un campo tipo RADIO haya sido seleccionado.
 */
function validateRadio(radios, idTD){
    //alert("radios " + radios + " idTd " + idTD);
    var isValido = false;
    var lbl = document.getElementById(idTD);
    for (i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            isValido = true;
        }
    }
    if (!isValido) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}

/**
 * Valida que un campo tipo TEXT solo tenga numeros y no este vacio per medio de 
 * una expresion regular.
 */
function validateNumber(text, idTD) {
    var regExp = /^(?:\+|-)?\d+$/;
    var lbl = document.getElementById(idTD);
    if (!regExp.test(text.value)) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}


/**
 * Valida que un campo tipo TEXT solo tenga numeros con punto y no este vacio por medio de
 * una expresion regular.
 *
 *  ^\d+ como en el ejemplo anterior indica que se debe revisar desde el comienzo del valor y que deberá encontrar sólo dígitos numéricos, y uno o más.
 *  \.? indica que se puede encontrar un punto decimal (para paises con como, reemplazarlo), y el signo ? indica que puede faltar, lo cual hace que los valores enteros también sean válidos.
 *  \d*$ finalmente, indicamos que después del punto decimal se pueden encontar cero o más dígitos numéricos hasta el final del valor.
 *
 */
function validateNumberDecimalPositive(text, idTD) {
    var regExp = /^\d+\.?\d*$/;
    var lbl = document.getElementById(idTD);
    if (!regExp.test(text.value) || text.value == 0) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}

/**
 * Valida que un campo tipo TEXT tenga un correo electronico valido y no este vacio,
 * mediante una expresion regular.
 *
 * text     campo a validat
 * idTD     campo a cambiar el estilo en caso de que haya error
 */
function validateEmailTD(text, idTD) {
    var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var lbl = document.getElementById(idTD);
    if (!regExp.test(text.value)) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
    }
}

/**
 * Valida que un campo tipo TEXT tenga un correo electronico valido y no este vacio, 
 * mediante una expresion regular.
 *
 * text     campo a validat
 * idTD     campo a cambiar el estilo en caso de que haya error
 * idError  elemento a mostrar en caso de que haya error
 */
function validateEmail(text, idTD, idError) {
    var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var lbl = document.getElementById(idTD);
    if (!regExp.test(text.value)) {
        lbl.className = lbl.className.indexOf("_error") == -1 ? lbl.className + "_error" : lbl.className;
        showElement(idError, true);
        errors = true;
    } else {
        lbl.className = lbl.className.replace("_error", "");
        showElement(idError, false);
    }
}

/* ------------- Sólo validación en front (como para formmail) ------------- */
/* este script es para no dejar meter letras sino solo numeos */
var nav4 = window.Event ? true : false;
function acceptNum(evt) {
    // NOTE: Enter = 13, '0' = 48, '9' = 57
    var key = (document.all) ? evt.keyCode : evt.which;
    //var key = evt.keyCode;
    return (key <= 13 || (key >= 48 && key <= 57));
}

/* funcion que no deja meter letras sino solo mumeros decimales */
function acceptDec(evt){
    // NOTE: '0' = 48, '9' = 57 , '.'=46
    var key = (document.all) ? evt.keyCode : evt.which;
    //var key = evt.keyCode;
    return (key == 46 || (key >= 48 && key <= 57) || key <=13);
}

/* este script es para no dejar meter solo horas */
function acceptHora(evt, id) {
    // NOTE: Enter = 13, '0' = 48, '9' = 57, ':' = 85
    var key = (document.all) ? evt.keyCode : evt.which;
    //var key = evt.keyCode;
    var value = document.getElementById(id).value;
    //alert("indexOf: " + value.indexOf(':', 0));
    //alert("indexOf: " + value);
    if (key == 58 && value.indexOf(':', 0) > -1) {
        key = 100;
    }
    return (key <= 13 || (key >= 48 && key <= 58));
}
 
function limitTextArea(txtArea, cantidad) {
    if (txtArea.value.length > cantidad) {
        txtArea.value = txtArea.value.substring(0, cantidad);
    }
}

function getXMLValue(nodo) {
    var valor="";
    try {
        valor = nodo.firstChild.data;
    }catch(exception) {}
    return valor;
}

function goSubmit(e,botton) {
    var keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    else return true;

    if (keycode == 13) {
        document.getElementById(botton).onclick();
        return false;
    } else {
        return true;
    }
}
/**********************************************Valaidacion de formaMail con imagenes********************************************************/
/**
 * Valida que un campo tipo TEXT tenga un correo electronico valido y no este vacio,
 * mediante una expresion regular.
 *
 * text     campo a validat
 * idTD     campo a cambiar el estilo en caso de que haya error
 */
function validateEmailImg(text, idIMG) {
    var regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var img = document.getElementById(idIMG);
    if (!regExp.test(text.value)) {
        img.src = img.src.indexOf("error_") == -1 ? getStringAfterOf(img.src, "/") +"/error_" + getStringBeforeOf(img.src, "/") : img.src;
        errors = true;
    } else {
        img.src = img.src.replace("error_", "");
    }
}


/**
 * Valida que la cadena enviadano este vacia o llena de espacios en blanco.
 */
function validateTextValueImg(textValue, idIMG) {
    var img = document.getElementById(idIMG);
    if (trim(textValue) == "") {
        img.src = img.src.indexOf("error_") == -1 ? getStringAfterOf(img.src, "/") +"/error_" + getStringBeforeOf(img.src, "/") : img.src;
        errors = true;
    } else {        
        img.src = img.src.replace("error_", "");
    }
}

/**
 * Valida que un campo tipo TEXT no este vacio o lleno de espacios en blanco.
 */
function validateTextImg(text, idIMG) {
    validateTextValueImg(text.value, idIMG);
}

function getStringAfterOf(srcImg, caracter){
    var onTa = srcImg.lastIndexOf(caracter);
          return srcImg.substring(0,onTa);
}

function getStringBeforeOf(srcImg, caracter){
    var onTa = srcImg.lastIndexOf(caracter);
          return srcImg.substring(onTa+1, srcImg.length);
}


/**
 * Valida que un campo tipo SELECT no tenga seleccionada la opcion seleccione,
 * siempre y cuando tenga en su attribute value el valor de '0' (cero).
 */
function validateSelectImg(select, idIMG) {
    var img = document.getElementById(idIMG);
    if (select.value == "0") {
        img.src = img.src.indexOf("error_") == -1 ? getStringAfterOf(img.src, "/") +"/error_" + getStringBeforeOf(img.src, "/") : img.src;
        errors = true;
   } else {
        img.src = img.src.replace("error_", "");
    }
}

/**
 * Cambia la imagen 'error' .
 * root     elemento raiz del XML
 * tagName  elemento de error a buscar en el XML
 * idIMG    id del TD cuyo estilo cambiara en caso de ser error
 */
function setErrorImageOnTDFromXML(root, tagName, idIMG) {
    var someError = root.getElementsByTagName(tagName)[0];
    var img = document.getElementById(idIMG);
    if (someError != null) {
        img.src = img.src.indexOf("error_") == -1 ? getStringAfterOf(img.src, "/") +"/error_" + getStringBeforeOf(img.src, "/") : img.src;
        errors = true;
   } else {
        img.src = img.src.replace("error_", "");
    }
}

/**
 * Cambia la imagen 'error' .
 * idTD  id de la imagen en la cual se pintara el error
 * hasError    error que regresa el XML
 */

function setErrorImage(idTD, hasError) {
    var img = document.getElementById(idTD);
    if (hasError) {
        img.src = img.src.indexOf("error_") == -1 ? getStringAfterOf(img.src, "/" ) + "/error_"  + getStringBeforeOf(img.src, "/") : img.src;
    } else {
        img.src = img.src.replace("error_", "");
    }
}

/**
 * Muestra la imagen  de Error .
 * root     elemento raiz del XML
 * tagName  elemento de error a buscar en el XML
 * idDIV    elemento div donde se muestra la imagen
 * idIMG    elemento de la imagen a mostrar
 * idIMG    id del TD cuyo estilo cambiara en caso de ser error
 */
function showErrorImage(root, tagName, idDIV, idIMG){    
    var someError = root.getElementsByTagName(tagName)[0];
    var div = document.getElementById(idDIV);
    var img = document.getElementById(idIMG);
    if (someError != null) {        
        div.innerHTML = "<img src=" + img.src + ">";
        errors = true;
   } 
}



function setErrorStripesElement(idTD, hasError) {    
    if (hasError) {
        $('#'+idTD).addClass('error');
    } else {
        $('#'+idTD).removeClass('error');
    }
}

function showErrorStripesElement(idTD, msgError) {
    jsFormNTR.addError(idTD,msgError);
}

function borraJsGrowl(){
    $('.jsg_close').click();
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