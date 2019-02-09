# ng-currency

[![NPM Version](https://img.shields.io/npm/v/ng-currency.svg?style=flat)](https://npmjs.org/package/ng-currency) 
[![NPM Downloads](https://img.shields.io/npm/dm/ng-currency.svg?style=flat)](https://npmjs.org/package/ng-currency)
[![Travis](https://img.shields.io/travis/com/salte-io/ng-currency/master.svg?style=flat)](https://travis-ci.com/salte-io/ng-currency)
[![Coveralls](https://img.shields.io/coveralls/salte-io/ng-currency/master.svg)](https://coveralls.io/github/salte-io/ng-currency?branch=master)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/salte-io/ng-currency.svg)](https://greenkeeper.io)

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

[See it in action!](https://jsbin.com/pajuhaf/edit?html,output)

## Quick start

+ Include the required libraries:

```html
<script src="https://code.angularjs.org/1.3.4/angular.js"></script>
<script src="https://rawgit.com/salte-io/ng-currency/master/dist/ng-currency.js"></script>
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
