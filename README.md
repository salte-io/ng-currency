# ng-currency

[![NPM Version](https://img.shields.io/npm/v/ng-currency.svg?style=flat)](https://npmjs.org/package/ng-currency) 
[![NPM Downloads](https://img.shields.io/npm/dm/ng-currency.svg?style=flat)](https://npmjs.org/package/ng-currency)
[![Travis](https://img.shields.io/travis/com/salte-io/ng-currency/master.svg?style=flat)](https://travis-ci.com/salte-io/ng-currency)
[![Coveralls](https://img.shields.io/coveralls/salte-io/ng-currency/master.svg)](https://coveralls.io/github/salte-io/ng-currency?branch=master)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/salte-io/ng-currency.svg)](https://greenkeeper.io)

> `ng-currency` has officially entered [maintenance mode](https://github.com/salte-io/ng-currency/issues/205).

## Install

You can install this package either with `npm` or with `bower`.

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
$ bower install salte-io/ng-currency
```

Then add a `<script>` to your index.html:

```html
<script src="/bower_components/ng-currency/dist/ng-currency.js"></script>
```

## Example

[See it in action!](https://jsbin.com/pajuhaf/edit?html,output)

## ES6 Usage

**app.module.js**

```js
import angular from 'angular';
import ngCurrency from 'ng-currency';

angular.module('my-app', [
  ngCurrency // 'ng-currency'
]);
```

**inside your angular app**

```html
<input type="text" model="yourModel" ng-currency />
```

## ES5 Usage

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/node_modules/angular/dist/angular.min.js"></script>
    <script src="/node_modules/ng-currency/dist/ng-currency.min.js"></script>
    <script>
      var app = angular.module('my-app', [
        'ng-currency'
      ]);

      app.controller('MainCtrl', function($scope) {
        $scope.value = 123456.78;
      });
    </script>
  </head>
  <body ng-app="my-app" ng-controller="MainCtrl">
    <input type="text" ng-model="value" ng-currency>
  </body>
</html>
```

## Bindings

### `min` / `max`

**Default:** `undefined`

**Description:** Specifies the range the `ng-model` value can be within for validation and `hard-cap`

```html
<input type="text" model="yourModel" ng-currency min="1" max="1337" />
```

* If you want to be able to dynamically enable/disable validations from a controller you can use the following

```html
<input type="text" model="yourModel" ng-currency min="1" max="1337" ng-required="true" />
```

### `currency-symbol`

**Default:** Locale Currency Symbol

**Description:** Prefixes the formatted currency value with the currency symbol.

```html
<input type="text" model="yourModel" ng-currency currency-symbol="¥" />
```

### Active (`ng-currency`)

**Default:** `true`

**Description:** Dynamically disable / enable `ng-currency`.

```html
<input type="text" model="yourModel" ng-currency={{isCurrency}} currency-symbol="¥" />
```

### `fraction`

**Default:** `2`

**Description:** Determines the number of decimal places.

```html
<input type="text" ng-currency min="0" fraction="0" />
```

### `hard-cap`

**Default:** `false`

**Description:** Forces the `ng-model` value to stay within the `min` / `max` range.

```html
<input type="text" ng-currency min="0" hard-cap="true" />
```
