$(window).load(function () {
    $.magnificPopup.open({
        items: {
            src: '#auth'
        },
        fixedContentPos: true,
        fixedBgPos: false,
        closeOnBgClick: false,
        showCloseBtn: false,
        closeBtnInside: false,
        preloader: false,
        enableEscapeKey: false,
        type: 'inline',
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    }, 0);
});

$(document).ready(function(){

	$('#check_yes').click(function(e){
		$(this).css('background-image','url(./images/check-selected.png)');
		$(this).css('background-size','cover');
		$(this).css('background-position','center center');
		e.preventDefault();
		$('#check_no').css('background-image','none');
	});

	$('#check_no').click(function(evento) {
		$('#check_yes').css('background-image','none');
		console.log("mensaje");
		$('#adult-validate').css({"display": "block"});
		$(this).css('background-image','url(./images/check-selected.png)');
		$(this).css('background-size','cover');
		$(this).css('background-position','center center');
		e.preventDefault();
	});

});
