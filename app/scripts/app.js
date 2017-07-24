import svg4everybody from 'svg4everybody';
import $ from 'jquery';
import '../vendor/responsiveslides';
import '../vendor/jquery.appear';
import '../vendor/jquery.countTo';
import '../vendor/slick';
import '../vendor/wow';
import {TweenMax} from 'gsap';






$(() => {
	svg4everybody();
	// ------------------------WOW animatation
	const wow = new window.WOW({
		live: true
	});
	wow.init();
	// ------------------------end WOW animation

	// ------------------------Top slider

	function getAnimElms() {
		const $activeSlide =  $('.rslides1_on');
		const $activeSlideTitles = $activeSlide
																.find('.slider__caption-title');
		const title1 = $activeSlideTitles.get(0);
		const title2 = $activeSlideTitles.get(1);
		const subtitle = $activeSlide
											.find('.slider__caption-sub-title')
											.get(0);
		const button = $activeSlide.find('a.button');
		return [title1, title2, subtitle, button]
	}

	function scaleSliderImg() {
		const sliderImg = $('.rslides1_on').find('div').get(0);
		t1.to(sliderImg, 8, {scaleX: 1.03, scaleY: 1.03});
	}

	const $mainSlider = $('.rslides').responsiveSlides({
		auto: true,             // Boolean: Animate automatically, true or false
		speed: 2800,            // Integer: Speed of the transition, in milliseconds
		timeout: 8000,          // Integer: Time between slide transitions, in milliseconds
		pager: true,           // Boolean: Show pager, true or false
		nav: true,             // Boolean: Show navigation, true or false
		random: false,          // Boolean: Randomize the order of the slides, true or false
		pause: false,           // Boolean: Pause on hover, true or false
		pauseControls: true,    // Boolean: Pause when hovering controls, true or false
		prevText: '',   // String: Text for the "previous" button
		nextText: '',       // String: Text for the "next" button
		maxwidth: '',           // Integer: Max-width of the slideshow, in pixels
		navContainer: '',       // Selector: Where controls should be appended to, default is after the 'ul'
		manualControls: '',     // Selector: Declare custom pager navigation
		namespace: 'rslides',   // String: Change the default namespace used
		before() {							
			t1.staggerTo(getAnimElms(), .7, {opacity: 0, y: 150}, .7);
			scaleSliderImg();
		},
		after() {
			t1.staggerFromTo(getAnimElms(), .7, {opacity: 0, y: 150}, {opacity: 1, y: 0}, .7);
			scaleSliderImg()
		}     

	});

	const t1 = TweenMax;
	
	t1.staggerFromTo(getAnimElms(), .7, {opacity: 0, y: 150}, {opacity: 1, y: 0}, .7);
	scaleSliderImg();
		
	$('.rslides1_nav.next').addClass('fa fa-angle-right');
	$('.rslides1_nav.prev').addClass('fa fa-angle-left');


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

	// ----------------------Slider Projects

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

	// --------------------Slider Testimonials
	$('.slider-testimonials').slick({
		arrows: false,
		dots: true,
		autoplay: true,
		autoplaySpeed: 2000
	});
	//	----------------------news-slider

	$('.news-slider').slick({
		slidesToShow: 3,
		slidesToScroll: 1
	});
	// ----------------------end news-slider

	//	----------------------logo-companies-slider

	$('.logo-companies-slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false
	});
	// ----------------------end logo-companies-slider

	// ------------------scroll-top-button
	$(window).on('scroll', () => {
		if ($(window).scrollTop() > 700) {
			$('.scroll-top-button').fadeIn();
		}else {
			$('.scroll-top-button').fadeOut();
		}
	});

	$('.scroll-top-button').on('click', () => {
		$('html, body').animate({scrollTop: 0}, 1500);
		return false;
	});
	// ----------------end scroll-top-button

});
