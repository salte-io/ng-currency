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

## Versions

* 0.9.x vs 0.8.x

When you focus on input with ng-currency directive, model value will be displayed instead of currency formatted text (I.E: instead of 1,40 € will be 1.4 on focus)  .  So it's easier to use only numeric pad.

* 0.7.x vs 0.8.x

If you use angular 1.2.x please, use 0.7.x version (v0.7.0 branch). If you use angular 1.3.x or above just use 0.8.x version instead (master branch).

## Bower

You may install it via bower using

`bower install ng-currency`

or npm using

`npm install ng-currency`

## Example

You may see it in action and play a lot using [plunker](http://plnkr.co/edit/u9mJqDH8UpwxDnOv8gZL?p=preview).

<iframe width="100%" src="http://embed.plnkr.co/u9mJqDH8UpwxDnOv8gZL/preview" frameborder="0" allowfullscreen></iframe>

## Quick start

+ Include the required libraries:

>
``` html
<script src="https://code.angularjs.org/1.3.4/angular.js"></script>
<script src="https://rawgit.com/aguirrel/ng-currency/master/src/ng-currency.js"></script>
```

+ Inject the `ngCurrency` module into your app:

>
``` JavaScript
angular.module('myApp', ['ng-currency']);
```

+ In your input tag

>
``` html
<input type="text" model="yourModel" ng-currency />
```

+ It is also possible to add 'min' and 'max' validations

>
``` html
<input type="text" model="yourModel" ng-currency min="1" max="1337" />
```

+ If you want to be able to dynamically enable/disable validations from a controller you can use the following

>
``` html
<input type="text" model="yourModel" ng-currency min="1" max="1337" ng-required="true" />
```

+ It already shows the default currency symbol, but you can define a currency symbol, so that it will use this instead.

>
``` html
<input type="text" model="yourModel" ng-currency currency-symbol="¥" />
```

+ Disable currency in field

>
``` html
<input type="text" model="yourModel" ng-currency={{isCurrency}} currency-symbol="¥" />
```

+ Optional fraction value to take advantage of the currency filter's third param. The default remains 2 decimal places.

>
``` html
  <input type="text" ng-currency min="0" fraction="0">
```



## Contributing

Please submit all pull requests the against master branch. If your unit test contains JavaScript patches or features, you should include relevant unit tests. Thanks!



## Authors

**Luis Aguirre**

+ http://alaguirre.com
+ http://github.com/aguirrel

## Copyright and license

	The MIT License

	Copyright (c) 2012 - 2014 Olivier Louvignes

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
