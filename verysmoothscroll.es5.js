"use strict";

(function initVerySmoothScroll() {
	function calculateScrollTime() {
		var cssScrollSpeed = getComputedStyle(document.body).transitionDuration,
		    noCssWarn = "verysmoothscroll.js performance:\n\nYou don't have transition-duration set on the body element in your CSS.\nI'm going to declare this automaically, but to save performance or to modify the timing, add the following to your CSS:\n\nbody {\n\ttransition-duration: 0.3s;\n}";

		if (cssScrollSpeed === "0s") {
			console.warn(noCssWarn);
			document.body.style.transitionDuration = "0.3s";
			return 300;
		} else {
			return parseFloat(cssScrollSpeed, 10) * 1000;
		}
	}

	var $$a = document.querySelectorAll("a"),
	    SCROLL_TIME = calculateScrollTime(),
	    targets = {},
	    $body = document.body,
	    SCROLL_STOP_ALLOWED = window.SCROLL_STOP_ALLOWED !== undefined ? window.SCROLL_STOP_ALLOWED : true;

	/*
 	SCROLL_STOP_ALLOWED
 		Stop automatic smooth scrolling by scrolling naturally as the user, either with mouse wheel, keyboard, or touch.
 		Requires non-passive event listeners, see:
 	* https://www.chromestatus.com/features/5093566007214080
 	* https://stackoverflow.com/questions/37721782/what-are-passive-event-listeners
 	* https://developers.google.com/web/updates/2016/06/passive-event-listeners
 		You can disable this by doing:
 	window.SCROLL_STOP_ALLOWED = false
 	*/

	var pageIsScrolling = void 0,
	    timeout = void 0;

	if (!SCROLL_STOP_ALLOWED) {
		console.info("Scrolling stopping disabled");
	}

	function forEach$a(callback) {
		// for each anchor element
		$$a.forEach(function ($a) {
			// if this links to #something
			if ($a.href === "" + location.origin + location.pathname + $a.hash) {
				callback($a);
			}
		});
	}

	function buildTargetCache() {
		forEach$a(function ($a) {
			var targetId = $a.hash,
			    $target = document.querySelector(targetId);

			if ($target) {
				targets[targetId] = $target.offsetTop;
			} else {
				console.warn("Hey! You have an anchor link pointing to " + targetId + ", but I don't think it exists on the page.");
			}
		});
	}

	// build the cache of all the targets
	buildTargetCache();

	function scrollTo(target) {
		var targetY = targets[target];
		pageIsScrolling = true;

		// animate the scrolling of the page
		$body.style.transitionProperty = "transform";
		window.requestAnimationFrame(function () {
			$body.style.transform = "translateY(" + (window.pageYOffset - targetY) + "px)";
		}

		// after a certain amount of time, actually move the page
		);timeout = setTimeout(function () {
			location.hash = target;
			finishScroll(targetY);
		}, SCROLL_TIME);
	}

	function finishScroll(targetY) {
		var yPos = targetY ? targetY : -document.body.getBoundingClientRect().top;
		pageIsScrolling = false;

		$body.style.transform = "";
		$body.style.transitionProperty = "none";
		window.scrollTo(window.pageXOffset, yPos);

		if (timeout) {
			window.clearTimeout(timeout);
		}
	}

	forEach$a(function ($a) {
		// when a valid anchor link is clicked
		$a.addEventListener("click", function (event) {
			var $a = event.target;

			if (event.which === 1 && !event.metaKey && !event.shiftKey && !event.ctrlKey) {
				scrollTo($a.hash

				// supress the event
				);event.preventDefault();
			}
		});
	}

	/* scroll inturrupts - stops scrolls */

	);if (SCROLL_STOP_ALLOWED) {
		var inturrupt = function inturrupt(event) {
			if (pageIsScrolling) {
				finishScroll();
				event.preventDefault();
			}
		};

		document.addEventListener("touchstart", inturrupt);
		document.addEventListener("wheel", inturrupt);

		document.addEventListener("keydown", function (event) {
			var key = event.key || event.code;

			if (key === "PageDown" || key === "PageUp" || key === "ArrowUp" || key === "ArrowDown" || key === "End" || key === "Home") {
				inturrupt(event);
			}
		});
	}
})();
