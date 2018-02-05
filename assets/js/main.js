/*
	Strata by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var localTelephoneNumber = 0.03;
	var tollFreeTelephoneNumber = 0.06;
	var serviceUsage = 0.018;
	var inboundDidMinutes = 0.003;
  var outboundMinutes = 0.0065;
	var inboundTollFreeMinutes = 0.012;

	var settings = {

		// Parallax background effect?
			parallax: true,

		// Parallax factor (lower = more intense, higher = less intense).
			parallaxFactor: 20

	};

	skel.breakpoints({
		xlarge: '(max-width: 1800px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function() {

		var $window = $(window),
			$body = $('body'),
			$header = $('#header');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// Touch?
			if (skel.vars.mobile) {

				// Turn on touch mode.
					$body.addClass('is-touch');

				// Height fix (mostly for iOS).
					window.setTimeout(function() {
						$window.scrollTop($window.scrollTop() + 1);
					}, 0);

			}

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Header.

			// Parallax background.

				// Disable parallax on IE (smooth scrolling is jerky), and on mobile platforms (= better performance).
					if (skel.vars.browser == 'ie'
					||	skel.vars.mobile)
						settings.parallax = false;

				if (settings.parallax) {

					skel.on('change', function() {

						if (skel.breakpoint('medium').active) {

							$window.off('scroll.strata_parallax');
							$header.css('background-position', 'top left, center center');

						}
						else {

							$header.css('background-position', 'left 0px');

							$window.on('scroll.strata_parallax', function() {
								$header.css('background-position', 'left ' + (-1 * (parseInt($window.scrollTop()) / settings.parallaxFactor)) + 'px');
							});

						}

					});

				}

		// Main Sections: Two.

			// Lightbox gallery.
				$window.on('load', function() {

					$('#two').poptrox({
						caption: function($a) { return $a.next('h3').text(); },
						overlayColor: '#2c2c2c',
						overlayOpacity: 0.85,
						popupCloserText: '',
						popupLoaderText: '',
						selector: '.work-item a.image',
						usePopupCaption: true,
						usePopupDefaultStyling: false,
						usePopupEasyClose: false,
						usePopupNav: true,
						windowMargin: (skel.breakpoint('small').active ? 0 : 50)
					});

				});

				function calculateCost(localTelephoneNumber, tollFreeTelephoneNumber, serviceUsage, inboundDidMinutes, inboundTollFreeMinutes, outboundMinutes) {
					var result = {};

					var numberOfAgents = $('#number-agents').val();
					var webLocalTelephoneNumber = $('#local-number').val();
					var webTollFreeTelephoneNumber = $('#toll-free-number').val();
					var agentWorkHours = $('#agent-work-hours').val();
					var agentUtilization = $('#agent-utilization').val();
					var includeBreaks = $('input[type=radio][name=breaks]:checked').val();
					var inboundTollFreeMinutes = 0.012;

					//need to calculate minutes from ((numberOfAgents + agentHoursToMinutes + includeBreaks) * agentUtilization)
					if (parseInt(numberOfAgents) && parseInt(agentWorkHours) && parseInt(agentUtilization)) {
						//calculate minutes factoring in agent utilization and breaks
						var agentHoursToMinutes = agentWorkHours * 60;
						var totalWorkMinutes = ((numberOfAgents * agentHoursToMinutes) * (agentUtilization / 100));

						if (JSON.parse(includeBreaks) === true) {
							totalWorkMinutes = Math.max((totalWorkMinutes) - (numberOfAgents * 90));
						}

						//estimate minutes charge
						var totalMinutes = (totalWorkMinutes * inboundTollFreeMinutes);
						//estimate service charge
						var totalServiceCharge = serviceUsage * totalWorkMinutes;

						//estimate telephone number cost
						var totalTelephoneNumberCost = ((webLocalTelephoneNumber * localTelephoneNumber) + (webTollFreeTelephoneNumber * tollFreeTelephoneNumber));

						//workout minute costs
						var billableMinutes = totalMinutes;
						result.minuteCost = parseFloat(billableMinutes).toFixed(2);
						console.log(result.minuteCost)

						//workout monthly telephone number costs
						var billableNumbers = totalTelephoneNumberCost;
						result.numberCost = parseFloat(billableNumbers).toFixed(2);

						//workout service charge
						var billableServiceUsage = totalServiceCharge;
						result.billableServiceUsage = parseFloat(billableServiceUsage).toFixed(2);

						//workout total cost
						result.totalCost = parseFloat(billableMinutes + billableNumbers + billableServiceUsage).toFixed(2);
						result.thirtyTotalCost = parseFloat((billableMinutes * 30) + (billableNumbers * 30) + (billableServiceUsage * 30)).toFixed(2);
						result.yearlyTotalCost = parseFloat((billableMinutes * 365) + (billableNumbers * 365) + (billableServiceUsage * 365)).toFixed(2);
					}

					return result;
				}

			function Update() {
				var result = calculateCost (localTelephoneNumber, tollFreeTelephoneNumber, serviceUsage);

				if (result.minuteCost && result.numberCost && result.billableServiceUsage && result.totalCost) {
					$('#daily-minute-usage').text(parseFloat(result.minuteCost).toFixed(2));
					$('#daily-telephone-number-cost').text(parseFloat(result.numberCost).toFixed(2));
					$('#daily-service-usage').text(parseFloat(result.billableServiceUsage).toFixed(2));
					$('#daily-connect-total-cost').text(parseFloat(result.totalCost).toFixed(2));
				}

				result = calculateCost(localTelephoneNumber, tollFreeTelephoneNumber, serviceUsage);

				if (result.minuteCost && result.numberCost && result.billableServiceUsage && result.totalCost) {
					$('#monthly-minute-usage').text(parseFloat(result.minuteCost * 30).toFixed(2));
					$('#monthly-telephone-number-cost').text(parseFloat(result.numberCost * 30).toFixed(2));
					$('#monthly-service-usage').text(parseFloat(result.billableServiceUsage * 30).toFixed(2));
					$('#monthly-connect-total-cost').text(parseFloat(result.thirtyTotalCost).toFixed(2));
				}

				result = calculateCost(localTelephoneNumber, tollFreeTelephoneNumber, serviceUsage);

				if (result.minuteCost && result.numberCost && result.billableServiceUsage && result.totalCost) {
					$('#yearly-minute-usage').text(parseFloat(result.minuteCost * 365).toFixed(2));
					$('#yearly-telephone-number-cost').text(parseFloat(result.numberCost * 365).toFixed(2));
					$('#yearly-service-usage').text(parseFloat(result.billableServiceUsage * 365).toFixed(2));
					$('#yearly-connect-total-cost').text(parseFloat(result.yearlyTotalCost).toFixed(2));
				}

			}

			$('#number-agents').on('input propertychange paste', function(result, value) {
				Update();
			});

			$('#local-number').on('input propertychange paste', function(result, value) {
				Update();
			});

			$('#toll-free-number').on('input propertychange paste', function(result, value) {
				Update();
			});

			$('#agent-work-hours').on('input propertychange paste', function(result, value) {
				Update();
			});

			$('#agent-utilization').on('change', function(result, value) {
				Update();
			});

			$('input[type=radio][name=breaks]').on('change', function(result, value) {
				Update();
			});
	});

})(jQuery);
