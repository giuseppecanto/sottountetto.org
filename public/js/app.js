


 /*=========================*/
     /*====main navigation hover dropdown====*/
     /*==========================*/
    $(document).ready(function () {
	
	$('.js-activated').dropdownHover({
		instantlyCloseOthers: false,
		delay: 0
	}).dropdown();
	
});

 /*=========================*/
     /*====flex main slider====*/
     /*==========================*/
    $('.slider-main,.testimonials').flexslider({
      slideshowSpeed: 5000,
      directionNav: false,
      animation: "fade"
    });
    
     /*=========================*/
     /*========portfolio mix====*/
     /*==========================*/
    $('#grid').mixitup();
    
       /*=========================*/
     /*========tooltip and popovers====*/
     /*==========================*/
    $("[data-toggle=popover]").popover();
    
    $("[data-toggle=tooltip]").tooltip();

   /*=========================*/
     /*========flex-gallery slide====*/
     /*==========================*/
 $(window).load(function() {
$('.flexslider').flexslider({
    directionNav: false,
    slideshowSpeed: 5000,
    animation: "fade"
});
});

/* ==============================================
WOW plugin triggers animation.css on scroll
=============================================== */

var wow = new WOW(
  {
    boxClass:     'wow',      // animated element css class (default is wow)
    animateClass: 'animated', // animation css class (default is animated)
    offset:       150,          // distance to the element when triggering the animation (default is 0)
    mobile:       false        // trigger animations on mobile devices (true is default)
  }
);
wow.init();



