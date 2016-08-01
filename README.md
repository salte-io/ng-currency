# ng-currency
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]

ngCurrency is a directive that enables seamless use of currency inputs.

Main features:

* The model is consistent as it values is a float (even if there are alpha caracters in the middle) or NaN in the empty case.
* Input value is always filtered with locale currency when load and on blur.
* You may write the amount using locale decimal or use dot (.) as default.
* The only required dependency is [angular](https://github.com/angular/angular.js)!
* Min and Max validators like input[number].
* Enable/disable formatter using ng-currency={{var}}
* Optional fraction places value. The default remains 2 decimal places.
* You can redraw all directives broadcasting "currencyRedraw" event.
* Enable/Disable show zeroes using display-zeroes 'true' or 'false'
* Not isolated scope. It plays well with others directives!

## npm

```sh
$ npm install ng-currency
```
Then add a `<script>` to your index.html:
```html
<script src="/node_modules/ng-currency/dist/ng-currency.js"></script>
```
Or `require('ng-currency')` from your code.

## bower

```sh
$ bower install ng-currency
```
Then add a `<script>` to your index.html:
```html
<script src="/bower_components/ng-currency/dist/ng-currency.js"></script>
```

## Example

[See it in action!](http://plnkr.co/edit/4m6Q0GT9qjwGLUoW4cs8?p=preview)

## Quick start

+ Include the required libraries:

```html
<script src="https://code.angularjs.org/1.3.4/angular.js"></script>
<script src="https://rawgit.com/aguirrel/ng-currency/master/dist/ng-currency.js"></script>
```

+ Inject the `ngCurrency` module into your app:

```javascript
angular.module('myApp', ['ng-currency']);
```

+ In your input tag

```html
<input type="text" model="yourModel" ng-currency />
```

## Bindings

### Min/Max
* Default: undefined
* Description: Specifies the range the ngModel value can be within for validation and hard-cap

```html
<input type="text" model="yourModel" ng-currency min="1" max="1337" />
```

+ If you want to be able to dynamically enable/disable validations from a controller you can use the following

```html
<input type="text" model="yourModel" ng-currency min="1" max="1337" ng-required="true" />
```

### Currency Symbol
* Default: Locale Currency Symbol
* Description: Prefixes the formatted currency value with the currency symbol

```html
<input type="text" model="yourModel" ng-currency currency-symbol="¥" />
```

### Active
* Default: true
* Description: Dynamically disable/enable ng-currency

```html
<input type="text" model="yourModel" ng-currency={{isCurrency}} currency-symbol="¥" />
```

### Fraction
* Default: 2
* Description: Determines the number of decimal places

```html
<input type="text" ng-currency min="0" fraction="0" />
```

### Hard Cap
* Default: false
* Description: Forces the ngModel value to stay within the min/max range

```html
<input type="text" ng-currency min="0" hard-cap="true" />
```

## Authors

**Luis Aguirre**

+ http://alaguirre.com
+ http://github.com/aguirrel

## Copyright and license

	The MIT License

	Copyright (c) 2012 - 2016 Luis Aguirre

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

[npm-version-image]: http://img.shields.io/npm/v/ng-currency.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/ng-currency.svg?style=flat
[npm-url]: https://npmjs.org/package/ng-currency

[travis-ci-image]: https://img.shields.io/travis/aguirrel/ng-currency.svg?style=flat
[travis-ci-url]: https://travis-ci.org/aguirrel/ng-currency
