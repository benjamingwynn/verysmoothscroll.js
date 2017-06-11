(function initVerySmoothScroll () {
	function calculateScrollTime () {
		const cssScrollSpeed = getComputedStyle(document.body).transitionDuration
			, noCssWarn = `verysmoothscroll.js performance:

You don't have transition-duration set on the body element in your CSS.
I'm going to declare this automaically, but to save performance or to modify the timing, add the following to your CSS:

body {
	transition-duration: 0.3s;
}`
		
		if (cssScrollSpeed === "0s") {
			console.warn(noCssWarn)
			document.body.style.transitionDuration = "0.3s"
			return 300
		} else {
			return parseFloat(cssScrollSpeed, 10) * 1000
		}
	}

	const $$a = document.querySelectorAll("a")
		, SCROLL_TIME = calculateScrollTime()
		, targets = {}
		, $body = document.body
		, SCROLL_STOP_ALLOWED = window.SCROLL_STOP_ALLOWED !== undefined ? window.SCROLL_STOP_ALLOWED : true

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

	let pageIsScrolling, timeout

	if (!SCROLL_STOP_ALLOWED) {
		console.log("Scrolling stopping disabled")
	}

	function forEach$a (callback) {
		// for each anchor element
		$$a.forEach(($a) => {
			// if this links to #something
			if ($a.href === `${location.origin}${location.pathname}${$a.hash}`) {
				callback($a)
			}
		})
	}

	function buildTargetCache () {
		forEach$a(($a) => {
			const targetId = $a.hash
				, $target = document.querySelector(targetId)

			if ($target) {
				targets[targetId] = $target.offsetTop
			} else {
				console.warn(`Hey! You have an anchor link pointing to ${targetId}, but I don't think it exists on the page.`)
			}
		})
	}
	
	// build the cache of all the targets
	buildTargetCache()

	function scrollTo (target) {
		const targetY = targets[target]
		pageIsScrolling = true

		// animate the scrolling of the page
		$body.style.transitionProperty = "transform"
		window.requestAnimationFrame(() => {
			$body.style.transform = `translateY(-${targetY - window.pageYOffset}px)`
		})

		// after a certain amount of time, actually move the page
		timeout = setTimeout(() => {
			location.hash = target
			finishScroll(targetY)
		}, SCROLL_TIME)
	}

	function finishScroll (targetY) {
		const yPos = targetY ? targetY : -document.body.getBoundingClientRect().top
		pageIsScrolling = false

		console.log(yPos)

		$body.style.transform = ""
		$body.style.transitionProperty = "none"
		window.scrollTo(window.pageXOffset, yPos)

		if (timeout) {
			window.clearTimeout(timeout)
		}
	}

	forEach$a(($a) => {
		// when a valid anchor link is clicked
		$a.addEventListener("click", (event) => {
			const $a = event.target

			if (event.which === 1 && !event.metaKey && !event.shiftKey && !event.ctrlKey) {
				scrollTo($a.hash)

				// supress the event
				event.preventDefault()
			}
		})
	})

	/* scroll inturrupts - stops scrolls */

	if (SCROLL_STOP_ALLOWED) {
		function inturrupt (event) {
			if (pageIsScrolling) {
				finishScroll()
				event.preventDefault()
			}
		}
		
		document.addEventListener("touchstart",	inturrupt)
		document.addEventListener("wheel", inturrupt)

		document.addEventListener("keydown", (event) => {
			const key = event.key || event.code

			if (
				key === "PageDown" ||
				key === "PageUp" ||
				key === "ArrowUp" ||
				key === "ArrowDown" ||
				key === "End" ||
				key === "Home"
			) {
				inturrupt(event)
			}
		})
	}
}())
