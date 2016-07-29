/*
 * ng-currency
 * http://alaguirre.com/

 * Version: 0.10.1 - 2016-06-05
 * License: MIT
 */

/* @ngInject */
export default function ngCurrency($filter, $locale, $timeout) {
  return {
    require: 'ngModel',
    link: (scope, element, attrs, ngModel) => {
      if (attrs.ngCurrency === 'false') return;
      let initialized, min, max, currencySymbol, ngRequired, fraction;

      attrs.$observe('min', (value) => {
        min = Number(value);
        ngModel.$validate();
        reloadThis();
      });
      attrs.$observe('max', (value) => {
        max = Number(value);
        ngModel.$validate();
        reloadThis();
      });
      attrs.$observe('currencySymbol', (value) => {
        currencySymbol = value;
        reloadThis();
      });
      attrs.$observe('ngRequired', (value) => {
        ngRequired = value;
        reloadThis();
      });
      attrs.$observe('fraction', (value) => {
        fraction = value;
        reloadThis();
      });

      fraction = fraction || 2;

      $timeout(() => {
        initialized = true;
        reloadThis();
      });

      function reloadThis() {
        if (initialized) {
          scope.$emit('currencyRedraw');
        }
      }

      function decimalRex(dChar) {
        return RegExp("\\d|\\-|\\" + dChar, 'g');
      }

      function clearRex(dChar) {
        return RegExp("\\-{0,1}((\\" + dChar + ")|([0-9]{1,}\\" + dChar + "?))&?[0-9]{0," + fraction + "}", 'g');
      }

      function clearValue(value) {
        value = String(value);
        var dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        var cleared = null;

        if (value.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) === -1 &&
          value.indexOf('.') !== -1 &&
          fraction > 0) {
          dSeparator = '.';
        }

        // Replace negative pattern to minus sign (-)
        var neg_dummy = $filter('currency')("-1", getCurrencySymbol(), fraction);
        var neg_regexp = RegExp("[0-9." + $locale.NUMBER_FORMATS.DECIMAL_SEP + $locale.NUMBER_FORMATS.GROUP_SEP + "]+");
        var neg_dummy_txt = neg_dummy.replace(neg_regexp.exec(neg_dummy), "");
        var value_dummy_txt = value.replace(neg_regexp.exec(value), "");

        // If is negative
        if (neg_dummy_txt === value_dummy_txt) {
          value = '-' + neg_regexp.exec(value);
        }

        if (RegExp("^-[\\s]*$", 'g').test(value)) {
          value = "-0";
        }

        if (decimalRex(dSeparator).test(value)) {
          cleared = value.match(decimalRex(dSeparator))
            .join("").match(clearRex(dSeparator));
          cleared = cleared ? cleared[0].replace(dSeparator, ".") : null;
        }

        return cleared;
      }

      function getCurrencySymbol() {
        if (currencySymbol !== undefined) {
          return currencySymbol;
        }
        return $locale.NUMBER_FORMATS.CURRENCY_SYM;
      }

      function reformatViewValue() {
        var formatters = ngModel.$formatters;
        var idx = formatters.length;

        var viewValue = ngModel.$$rawModelValue;
        while (idx--) {
          viewValue = formatters[idx](viewValue);
        }

        ngModel.$setViewValue(viewValue);
        ngModel.$render();
      }

      ngModel.$parsers.push(function(viewValue) {
        var cVal = clearValue(viewValue);
        // Check for fast digitation (-. or .)
        if (cVal === "." || cVal === "-.") {
          cVal = ".0";
        }
        return Number(cVal);
      });

      element.on("blur", function() {
        ngModel.$commitViewValue();
        reformatViewValue();
      });

      ngModel.$formatters.unshift(function(value) {
        return $filter('currency')(value, getCurrencySymbol(), fraction);
      });

      ngModel.$validators.min = function(value) {
        if (!ngRequired && isNaN(value)) {
          return true;
        }
        return !min || value >= min;
      };

      ngModel.$validators.max = function(value) {
        if (!ngRequired && isNaN(value)) {
          return true;
        }
        return !max || value <= max;
      };

      ngModel.$validators.fraction = function(value) {
        return !value || !isNaN(value);
      };

      scope.$on('currencyRedraw', function() {
        ngModel.$commitViewValue();
        reformatViewValue();
      });

      element.on('focus', function() {
        var viewValue = ngModel.$$rawModelValue;

        if (isNaN(viewValue) || viewValue === '' || viewValue === null) {
          viewValue = '';
        } else {
          viewValue = Number(viewValue).toFixed(fraction);
        }
        ngModel.$setViewValue(viewValue);
        ngModel.$render();
      });
    }
  };
}
