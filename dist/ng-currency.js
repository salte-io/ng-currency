/*
 * ng-currency
 * http://alaguirre.com/

 * Version: 0.9.3 - 2016-02-15
 * License: MIT
 */

/*commonjs support*/
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
      module.exports = 'ng-currency';
}

angular.module('ng-currency', [])
    .directive('ngCurrency', ['$filter', '$locale', function ($filter, $locale) {
        return {
            require: 'ngModel',
            scope: {
                min: '=?min',
                max: '=?max',
                currencySymbol: '@',
                displayZeroes: '=?displayZeroes',
                ngRequired: '=?ngRequired',
                fraction: '=?fraction'
            },
            link: function (scope, element, attrs, ngModel) {

                if (attrs.ngCurrency === 'false') return;

                scope.fraction = (typeof scope.fraction !== 'undefined')?scope.fraction:2;
                scope.displayZeroes = (typeof scope.displayZeroes !== 'undefined')?scope.displayZeroes:true;

                function decimalRex(dChar) {
                    return RegExp("\\d|\\-|\\" + dChar, 'g');
                }

                function clearRex(dChar) {
                    return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0," + scope.fraction + "}", 'g');
                }

                function clearValue(value) {
                    value = String(value);
                    var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                    var cleared = null;

                    if (!scope.displayZeroes && value === '') {
                        return value;
                    }

                    if(value.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) == -1 && 
                       value.indexOf('.') != -1 &&
                       scope.fraction)
                    {
                        dSeparator = '.';
                    }

                    // Replace negative pattern to minus sign (-)
                    var neg_dummy = $filter('currency')("-1", getCurrencySymbol(), scope.fraction);
                    var neg_regexp = RegExp("[0-9."+$locale.NUMBER_FORMATS.DECIMAL_SEP+$locale.NUMBER_FORMATS.GROUP_SEP+"]+");
                    var neg_dummy_txt = neg_dummy.replace(neg_regexp.exec(neg_dummy), "");
                    var value_dummy_txt = value.replace(neg_regexp.exec(value), "");

                    // If is negative
                    if(neg_dummy_txt == value_dummy_txt) {
                        value = '-' + neg_regexp.exec(value);
                    }

                    if(RegExp("^-[\\s]*$", 'g').test(value)) {
                        value = "-0";
                    }

                    if(decimalRex(dSeparator).test(value))
                    {
                        cleared = value.match(decimalRex(dSeparator))
                            .join("").match(clearRex(dSeparator));
                        cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
                    }

                    return cleared;
                }

                function getCurrencySymbol() {
                    if (angular.isDefined(scope.currencySymbol)) {
                        return scope.currencySymbol;
                    } else {
                        return $locale.NUMBER_FORMATS.CURRENCY_SYM;
                    }
                }

                function reformatViewValue(){
                    var formatters = ngModel.$formatters,
                        idx = formatters.length;

                    var viewValue = ngModel.$$rawModelValue;
                    if (!scope.displayZeroes && viewValue.length && parseFloat(viewValue) == 0) { 
                        viewValue = ''; 
                    } else {
                        while (idx--) {
                          viewValue = formatters[idx](viewValue);
                        }
                    }

                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                }

                ngModel.$parsers.push(function (viewValue) {
                    var cVal = clearValue(viewValue);
                    //return parseFloat(cVal);
                    // Check for fast digitation (-. or .)
                    if(cVal == "." || cVal == "-.")
                    {
                        cVal = ".0";
                    }
                    return (!scope.displayZeroes && viewValue === '') ? 0 : parseFloat(cVal);
                });

                element.on("blur", function () {
                    ngModel.$commitViewValue();
                    reformatViewValue();
                });

                ngModel.$formatters.unshift(function (value) {
                    if (!scope.displayZeroes && value.length && parseFloat(value) == 0) { return ''; }
                    return $filter('currency')(value, getCurrencySymbol(), scope.fraction);
                });

                ngModel.$validators.min = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.min  !== 'undefined') {
                        return cVal >= parseFloat(scope.min);
                    }
                    return true;
                };
                
                scope.$watch('min', function (val) {
                    ngModel.$validate();
                });

                ngModel.$validators.max = function(cVal) {
                    if (!scope.ngRequired && isNaN(cVal)) {
                        return true;
                    }
                    if(typeof scope.max  !== 'undefined') {
                        return cVal <= parseFloat(scope.max);
                    }
                    return true;
                };

                scope.$watch('max', function (val) {
                    ngModel.$validate();
                });


                ngModel.$validators.fraction = function(cVal) {
                    if (!!cVal && isNaN(cVal)) {
                        return false;
                    }

                    return true;
                };

                scope.$on('currencyRedraw', function() { 
                    ngModel.$commitViewValue();
                    reformatViewValue(); 
                });

                element.on('focus',function(){
                    var viewValue = ngModel.$$rawModelValue;
                    if(!scope.displayZeroes && !viewValue ){ return viewValue; }
                    if(isNaN(viewValue) || viewValue === '' || viewValue == null)
                    {
                        viewValue = '0.00';
                    }
                    else
                    {
                        viewValue = parseFloat(viewValue).toFixed(scope.fraction);
                    }
                    ngModel.$setViewValue(viewValue);
                    ngModel.$render();
                });
            }
        }
    }]);
