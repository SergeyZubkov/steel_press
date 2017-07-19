import svg4everybody from 'svg4everybody';
import $ from 'jquery';
import '../vendor/responsiveslides';
import '../vendor/jquery.appear';
import '../vendor/jquery.countTo';
import '../vendor/slick';



$(() => {
	svg4everybody();

	// ------------------------Top slider

	$('.rslides').responsiveSlides({
		auto: true,             // Boolean: Animate automatically, true or false
		speed: 2000,            // Integer: Speed of the transition, in milliseconds
		timeout: 6000,          // Integer: Time between slide transitions, in milliseconds
		pager: true,           // Boolean: Show pager, true or false
		nav: false,             // Boolean: Show navigation, true or false
		random: false,          // Boolean: Randomize the order of the slides, true or false
		pause: false,           // Boolean: Pause on hover, true or false
		pauseControls: true,    // Boolean: Pause when hovering controls, true or false
		prevText: 'Previous',   // String: Text for the "previous" button
		nextText: 'Next',       // String: Text for the "next" button
		maxwidth: '',           // Integer: Max-width of the slideshow, in pixels
		navContainer: '',       // Selector: Where controls should be appended to, default is after the 'ul'
		manualControls: '',     // Selector: Declare custom pager navigation
		namespace: 'rslides',   // String: Change the default namespace used
		before() {},   // Function: Before callback
		after() {}     // Function: After callback
	});

	// -----------------------Toggle menu
	$('.nav-toggle').on('click', function () {
		$(this).toggleClass('nav-toggle_on');

		if (!$('.nav').hasClass('nav_open')) {
			$('.nav').slideDown();
			$('.nav').toggleClass('nav_open');
		}
		else {
			$('.nav').slideUp();
			$('.nav').toggleClass('nav_open');
		}
		$(window).resize(function () {
			if (window.matchMedia('(min-width: 767px )').matches) {
				$('.nav').css('display', '');
			}
		});
	});

	// -------------------------CountTo
	const $counterListItem = $('.counter-list__item');
	const $body = $('body');

	$counterListItem.appear();
	
	$body.on('appear', () => {

		$counterListItem
			.countTo({
				refreshInterval: 5,
				onComplete: () => {
					$body.off('appear');
				}
			});

	});

	//	----------------------Slider Projects

	$('.slider-projects').slick({
		arrows: true,
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1
	});

	$('.menu-filter-projects__item').on('click', function () {
		$('.slider-projects').slick('slickUnfilter');

		const $this = $(this);
		const category = $this.attr('data-filter-by').toLowerCase();

		$('.menu-filter-projects__item')
			.removeClass('menu-filter-projects__item_active');

		$this.addClass('menu-filter-projects__item_active');
		if (category === 'all') {
			return;
		}

		const filterBy = `[data-category="${category}"]`;

		$('.slider-projects').slick('slickFilter', filterBy);
	});

	//	--------------------Slider Testimonials
	$('.slider-testimonials').slick({
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 2000
	});
});

