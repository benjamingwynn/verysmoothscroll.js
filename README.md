# verysmoothscroll.js

A plug and play smooth scroll script. Automatically scrolls to anchor links like these:

`<a href="#somewhere_on_the_page">Somewhere</a>`

verysmoothscroll.js works without any dependancies, however, it uses ES6 along with modern Javascript and CSS properties to manipulate the page.

# Compatiblity

* Chrome 51+
* Firefox 50+

*BUT* you can use Babel to transpile the current ES6 code into ES5/older code. You will also need a polyfill for `<NodeList>.forEach`, which is used and is only included in some browsers right now (Ch 51+, FF 50+). [Mozilla have created a polyfill here](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill). If targeting [<IE9](http://caniuse.com/#feat=addeventlistener), you may also need a polyfill for `document.addEventListener` along with some other features.

Using the polyfills and transpiling to ES5, the script should work on any browser with [CSS transitions](http://caniuse.com/#feat=css-transitions) and [CSS 2D transformation properties](http://caniuse.com/#feat=transforms2d).

A download to a transpiled ES5 version with a `<NodeList>.forEach` polyfill will be provided in the future.

# Controlling speed and animation curve

verysmoothscroll.js uses CSS transitions to animate the page, simply modify the body selector in your CSS to adjust both duration:

```
body {
	transition-duration: 0.5s;
}
```

Or timing function: 

```
body { 
	transition-timing-function: cubic-bezier(0.34, 0.33, 0.14, 1.79);
}
```
