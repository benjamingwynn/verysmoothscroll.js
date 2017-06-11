# verysmoothscroll.js

A plug and play smooth scroll script. Automatically scrolls to anchor links like these:

`<a href="#somewhere_on_the_page">Somewhere</a>`

verysmoothscroll.js works without any dependancies, however, it uses ES6 along with modern Javascript and CSS properties to manipulate the page.

# Compatiblity

The source is designed for the following browser:

* Chrome 51+
* Firefox 50+

*BUT* a transpiled version of the code, with a `<NodeList>.forEach` polyfill is provided.

Using the polyfills and transpiling to ES5, the script should work on any browser with [CSS transitions](http://caniuse.com/#feat=css-transitions) and [CSS 2D transformation properties](http://caniuse.com/#feat=transforms2d), including:

* IE10+
* Edge 12+
* Firefox 16+
* Chrome 36+
* Safari 9+
* Opera 23+
* iOS Safari 9.2+

Use ./verysmoothscroll.legacy.js or ./verysmoothscroll.legacy.min.js

Compatibility can be taken even futher with vendor prefixes, such as `-webkit-transition` and `-webkit-translate`, if required. But, if you need to support browsers older than the ones above, this may not be the script for you.

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
