$(function(){
var ADDRESS_MAPPING = [
	'13th Street Residence New York, NY 10011',
	'Arnhold Hall New York, NY 10011',
	'Fanton Hall New York, NY 10011',
	'164 5th Ave New York, NY 10010',
	'Johnson Hall New York, NY 10011',
	'16 E 16th St New York, NY 10003',
	'65 5th Ave New York, NY 10003',
	'853 Broadway #605 New York, NY 10003',
	'101 E 16th St New York, NY 10003',
	'201 Park Ave S New York, NY 10003',
	'135 E 12th St New York, NY 10003'
];
var _mapRatio;/* width / height */
var _innerX = -1;
var _innerY = -1;
var _isDrag = false;
function init(){
	//_mapRatio = $('#mw-map').width() / $('#mw-map').height();
	//$(window).resize(resize);
	$('#mw-map').mousedown(onMapMouseDown);
	$('body').mousemove(onBodyMouseMove);
	$('body').mouseup(onMapMouseUp);
	$('body').mouseleave(onMapMouseUp);
	//
	// resize();
	// loadYelp('food', ADDRESS_MAPPING[0], onYelpLoaded);
}

function loadYelp(term, location, callback){
	$.ajax({
	  url: 'http://us.ibio8.com/yelp/interface/gateway.php',
	  dataType: "jsonp",
      data: {
      	term : term,
      	location : location
      },
	  success: callback
	});
}

function onYelpLoaded(response){
	var compiled = _.template($('#template-yelp').html());
	var review = '', userAvatar = '';
	if(response.reviews && response.reviews[0]){
	 	review = response.reviews[0].excerpt;
	 	userAvatar = response.reviews[0].user.image_url;
	}
	// console.log(response);
	response.review = review;
	response.userAvatar = userAvatar;
	$('#mw-panel').css('display', 'block');
	$('#mw-panel article').empty();
	$('#mw-panel article').append(compiled(response));
}

function onMapMouseDown(e){
	var target = $(e.target).prop('class') || '';
	// $('#mw-map').css('left', '20px');
	var parentOffset = $('#mw-map').offset(); 
   //or $(this).offset(); if you really just want the current element's offset
  _innerX = e.pageX - parentOffset.left;
	_innerY = e.pageY - parentOffset.top;
	$('#mw-map').css('pointer-events', 'none');
	//defined by the class name
	target = target.split('btn') || [];
	if(parseInt(target[1]) >= 0){
		loadYelp('food', ADDRESS_MAPPING[parseInt(target[1])], onYelpLoaded);
	//hide
	}else{
		$('#mw-panel').css('display', 'none');
	}
}

function onBodyMouseMove(e){
	// console.log(e.pageX, e.pageY);
	if(_innerX > -1 && _innerY > -1){
		$('#mw-map').css({left:e.pageX - _innerX, top:e.pageY - _innerY});
	}
}

function onMapMouseUp(){
	_innerX = -1;
	_innerY = -1;
	$('#mw-map').css('pointer-events', 'auto');
}

init();
});