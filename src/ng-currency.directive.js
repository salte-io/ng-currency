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
      let initialized, hardCap, min, max, currencySymbol, ngRequired;
      let active = true;
      let fraction = 2;

      attrs.$observe('ngCurrency', (value) => {
        active = (value !== 'false');
        refresh();
      });
      attrs.$observe('hardCap', (value) => {
        hardCap = (value === 'true');
        refresh();
      });
      attrs.$observe('min', (value) => {
        min = value ? Number(value) : undefined;
        refresh();
      });
      attrs.$observe('max', (value) => {
        max = value ? Number(value) : undefined;
        refresh();
      });
      attrs.$observe('currencySymbol', (value) => {
        currencySymbol = value;
        refresh();
      });
      attrs.$observe('ngRequired', (value) => {
        ngRequired = value;
        refresh();
      });
      attrs.$observe('fraction', (value) => {
        fraction = value || 2;
        refresh();
      });

      $timeout(() => {
        initialized = true;
        refresh();
      });

      function refresh() {
        if (initialized) {
          ngModel.$validate();
          scope.$emit('currencyRedraw');
        }
      }

      function decimalRex(dChar) {
        return RegExp('\\d|\\-|\\' + dChar, 'g');
      }

      function clearRex(dChar) {
        return RegExp('\\-{0,1}((\\' + dChar + ')|([0-9]{1,}\\' + dChar + '?))&?[0-9]{0,' + fraction + '}', 'g');
      }

      function clearValue(value) {
        value = String(value);
        let dSeparator = $locale.NUMBER_FORMATS.DECIMAL_SEP;
        let cleared = null;

        if (value.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) === -1 &&
          value.indexOf('.') !== -1 &&
          fraction > 0) {
          dSeparator = '.';
        }

        // Replace negative pattern to minus sign (-)
        const neg_dummy = $filter('currency')('-1', getCurrencySymbol(), fraction);
        const neg_regexp = RegExp('[0-9.' + $locale.NUMBER_FORMATS.DECIMAL_SEP + $locale.NUMBER_FORMATS.GROUP_SEP + ']+');
        const neg_dummy_txt = neg_dummy.replace(neg_regexp.exec(neg_dummy), '');
        const value_dummy_txt = value.replace(neg_regexp.exec(value), '');

        // If is negative
        if (neg_dummy_txt === value_dummy_txt) {
          value = '-' + neg_regexp.exec(value);
        }

        if (RegExp('^-[\\s]*$', 'g').test(value)) {
          value = '-0';
        }

        if (decimalRex(dSeparator).test(value)) {
          cleared = value.match(decimalRex(dSeparator))
            .join('').match(clearRex(dSeparator));
          cleared = cleared ? cleared[0].replace(dSeparator, '.') : null;
        }

        return cleared;
      }

      function getCurrencySymbol() {
        if (currencySymbol !== undefined) {
          return currencySymbol;
        }
        return $locale.NUMBER_FORMATS.CURRENCY_SYM;
      }

      function executeFormatters() {
        let viewValue = ngModel.$$rawModelValue;
        for (let i = ngModel.$formatters.length - 1; i >= 0; i--) {
          viewValue = ngModel.$formatters[i](viewValue);
        }
        ngModel.$setViewValue(viewValue);
        ngModel.$render();
      }

      function keepInRange(value) {
        if (active && hardCap && [undefined, null, ''].indexOf(value) === -1) {
          if (max !== undefined && value > max) {
            return max;
          } else if (min !== undefined && value < min) {
            return min;
          }
        }
        return value;
      }

      ngModel.$parsers.push((viewValue) => {
        if (active && [undefined, null, ''].indexOf(viewValue) === -1) {
          let value = clearValue(viewValue);
          // Check for fast digitation (-. or .)
          if (value === '.' || value === '-.') {
            value = '.0';
          }
          return Number(value);
        }
        return viewValue;
      });

      ngModel.$parsers.push(keepInRange);
      ngModel.$formatters.push((value) => {
        if (active && [undefined, null, ''].indexOf(value) === -1) {
          return $filter('currency')(value, getCurrencySymbol(), fraction);
        }
        return value;
      });

      ngModel.$validators.min = (value) => {
        if (!ngRequired && ([undefined, null, ''].indexOf(value) !== -1 || isNaN(value))) {
          return true;
        }
        return !active ||
          [undefined, null].indexOf(min) !== -1 || isNaN(min) ||
          value >= min;
      };

      ngModel.$validators.max = (value) => {
        if (!ngRequired && ([undefined, null, ''].indexOf(value) !== -1 || isNaN(value))) {
          return true;
        }
        return !active ||
          [undefined, null].indexOf(max) !== -1 || isNaN(max) ||
          value <= max;
      };

      ngModel.$validators.fraction = (value) => {
        return !active || !value || !isNaN(value);
      };

      scope.$on('currencyRedraw', () => {
        if (initialized) {
          ngModel.$commitViewValue();
          const value = keepInRange(ngModel.$$rawModelValue);
          if (value !== ngModel.$$rawModelValue) {
            ngModel.$setViewValue(value);
            ngModel.$commitViewValue();
          }
          executeFormatters();
        }
      });

      element.on('focus', () => {
        let viewValue = ngModel.$$rawModelValue;

        if (isNaN(viewValue) || viewValue === '' || viewValue === null) {
          viewValue = '';
        } else {
          viewValue = Number(viewValue).toFixed(fraction);
        }
        if (ngModel.$viewValue !== viewValue) {
          ngModel.$setViewValue(viewValue);
          ngModel.$render();
          element.triggerHandler('focus');
        }
      });

      element.on('blur', () => {
        ngModel.$commitViewValue();
        executeFormatters();
      });
    }
  };
}
