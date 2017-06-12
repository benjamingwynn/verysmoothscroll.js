/* eslint-env es6, browser */

(function initVerySmoothScroll () {
	"use strict"

	function getSelectorOfNode ($node) {
		const id = $node.id
			, classSel = `.${$node.classList.value.split(" ").join(".")}`

		if (id) {
			return id
		}

		if (classSel !== ".") {
			return classSel
		}

		return null
	}

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
		}

		return parseFloat(cssScrollSpeed, 10) * 1000
	}

	const $$a = document.querySelectorAll("a")
		, SCROLL_TIME = calculateScrollTime()
		, targets = {}
		, $body = document.body
		, $$fixedNodes = []
		, SCROLL_PAGE_HAS_FIXED_NODES = true
		, SCROLL_STOP_ALLOWED = typeof window.SCROLL_STOP_ALLOWED === "undefined" ? true : window.SCROLL_STOP_ALLOWED

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
		console.info("Scrolling stopping disabled")
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

	function getAllNodes () {
		return document.querySelectorAll("body *:not(script):not(style):not(link)")
	}

	function findFixedNodes () {
		const $$nodes = getAllNodes()
			, nodeIDsWithNoTransitions = []
			, tDur = window.getComputedStyle(document.body).transitionDuration

		$$nodes.forEach(($node) => {
			const styles = window.getComputedStyle($node)
				, position = styles.position

			if (position === "fixed") {
				if (styles.transitionDuration !== tDur) {
					const sel = getSelectorOfNode($node)

					$node.style.transitionDuration = tDur

					if (sel) {
						nodeIDsWithNoTransitions.push(sel)
					} else {
						console.warn("verysmoothscroll performance:\n\nPlease assign elements with a fixed position a unique ID or class.")
					}
				}

				$$fixedNodes.push($node)
			}
		})

		if (nodeIDsWithNoTransitions.length) {
			console.warn(`verysmoothscroll.js performance:

I found ${nodeIDsWithNoTransitions.length} floating elements, which I will need to transform during smooth scrolling.
These elements however, don't have a transition-duration set which was equal to the bodies transition duration.
To fix this and improve performance, add the following to your CSS:

${nodeIDsWithNoTransitions.join(",")} {
	transition-duration: "${tDur}";
}
`)
		}
	}

	if (SCROLL_PAGE_HAS_FIXED_NODES) {
		findFixedNodes()
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

	function finishScroll (targetY) {
		const yPos = targetY ? targetY : -document.body.getBoundingClientRect().top

		pageIsScrolling = false

		// page
		$body.style.transform = ""
		$body.style.transitionProperty = "none"

		// and fixed elements...
		if (SCROLL_PAGE_HAS_FIXED_NODES) {
			$$fixedNodes.forEach(($fixedNode) => {
				$fixedNode.style.transform = ""
				$fixedNode.style.transitionProperty = "none"
			})
		}

		window.scrollTo(window.pageXOffset, yPos)

		if (timeout) {
			window.clearTimeout(timeout)
		}
	}

	function scrollTo (target) {
		const targetY = targets[target]

		pageIsScrolling = true

		// animate the scrolling of the page
		$body.style.transitionProperty = "transform"
		window.requestAnimationFrame(() => {
			$body.style.transform = `translateY(${window.pageYOffset - targetY}px)`

			// animate the fixed elements
			if (SCROLL_PAGE_HAS_FIXED_NODES) {
				$$fixedNodes.forEach(($fixedNode) => {
					// start at its current fixed position, which is the page y scoll
					$fixedNode.style.transform = `translateY(${window.pageYOffset}px)`
					window.requestAnimationFrame(() => {
						$fixedNode.style.transitionProperty = "transform"
						window.requestAnimationFrame(() => {
							// go to where it will eventually be
							$fixedNode.style.transform = `translateY(${targetY}px)`
						})
					})
				})
			}
		})

		// after a certain amount of time, actually move the page
		timeout = setTimeout(() => {
			location.hash = target
			finishScroll(targetY)
		}, SCROLL_TIME)
	}

	forEach$a(($a) => {
		// when a valid anchor link is clicked
		$a.addEventListener("click", (event) => {
			if (event.which === 1 && !event.metaKey && !event.shiftKey && !event.ctrlKey) {
				if (pageIsScrolling) {
					console.log("page is scrolling, ignoring you.")
					event.preventDefault()

					return
				}

				scrollTo($a.hash)

				// supress the event
				event.preventDefault()
			}
		})
	})

	/* scroll inturrupts - stops scrolls */
	function inturrupt (event) {
		if (pageIsScrolling) {
			finishScroll()
			event.preventDefault()
		}
	}

	if (SCROLL_STOP_ALLOWED) {
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
