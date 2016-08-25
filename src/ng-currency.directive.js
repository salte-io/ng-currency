/* @ngInject */
export default function ngCurrency($filter, $locale) {
  return {
    require: 'ngModel',
    link: (scope, element, attrs, controller) => {
      let hardCap, min, max, currencySymbol, ngRequired;
      let active = true;
      let fraction = 2;

      attrs.$observe('ngCurrency', (value) => {
        active = (value !== 'false');
        if (active) {
          reformat();
        } else {
          controller.$viewValue = controller.$$rawModelValue;
          controller.$render();
        }
      });
      attrs.$observe('hardCap', (value) => {
        hardCap = (value === 'true');
        revalidate();
      });
      attrs.$observe('min', (value) => {
        min = value ? Number(value) : undefined;
        revalidate();
      });
      attrs.$observe('max', (value) => {
        max = value ? Number(value) : undefined;
        revalidate();
      });
      attrs.$observe('currencySymbol', (value) => {
        currencySymbol = value;
        reformat();
      });
      attrs.$observe('ngRequired', (value) => {
        ngRequired = value;
        revalidate();
      });
      attrs.$observe('fraction', (value) => {
        fraction = value || 2;
        reformat();
        revalidate();
      });

      controller.$parsers.push((value) => {
        if (active && [undefined, null, ''].indexOf(value) === -1) {
          value = clearValue(value);
          value = keepInRange(Number(value));
          return value;
        }
        return value;
      });

      controller.$formatters.push((value) => {
        if (active && [undefined, null, ''].indexOf(value) === -1) {
          return $filter('currency')(value, getCurrencySymbol(), fraction);
        }
        return value;
      });

      controller.$validators.min = (value) => {
        if (!ngRequired && ([undefined, null, ''].indexOf(value) !== -1 || isNaN(value))) {
          return true;
        }
        return !active ||
          [undefined, null].indexOf(min) !== -1 || isNaN(min) ||
          value >= min;
      };

      controller.$validators.max = (value) => {
        if (!ngRequired && ([undefined, null, ''].indexOf(value) !== -1 || isNaN(value))) {
          return true;
        }
        return !active ||
          [undefined, null].indexOf(max) !== -1 || isNaN(max) ||
          value <= max;
      };

      controller.$validators.fraction = (value) => {
        return !active || !value || !isNaN(value);
      };

      function reformat() {
        if (active) {
          let value;
          if (controller.$options && controller.$options.updateOn === 'blur') {
            value = controller.$viewValue;
            for (let i = controller.$parsers.length - 1; i >= 0; i--) {
              value = controller.$parsers[i](value);
            }
          } else {
            value = controller.$$rawModelValue;
          }
          for (let i = controller.$formatters.length - 1; i >= 0; i--) {
            value = controller.$formatters[i](value);
          }
          controller.$viewValue = value;
          controller.$render();
        }
      }

      function revalidate() {
        controller.$validate();
        if (active) {
          const value = keepInRange(controller.$$rawModelValue);
          if (value !== controller.$$rawModelValue) {
            controller.$setViewValue(value.toFixed(fraction));
            controller.$commitViewValue();
            reformat();
          }
        }
      }

      function keepInRange(value) {
        if (hardCap) {
          if (max !== undefined && value > max) {
            value = max;
          } else if (min !== undefined && value < min) {
            value = min;
          }
        }
        return value;
      }

      scope.$on('currencyRedraw', () => {
        revalidate();
        reformat();
      });

      element.bind('focus', () => {
        if (active) {
          const groupRegex = new RegExp(`\\${$locale.NUMBER_FORMATS.GROUP_SEP}`, 'g');
          const value = [undefined, null, ''].indexOf(controller.$$rawModelValue) === -1 ? $filter('number')(controller.$$rawModelValue, fraction).replace(groupRegex, '') : controller.$$rawModelValue;
          if (controller.$viewValue !== value) {
            controller.$viewValue = value;
            controller.$render();
            element.triggerHandler('focus');
          }
        }
      });

      element.bind('blur', reformat);

      // TODO: Rewrite this parsing logic to more readable.

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
        return currencySymbol === undefined ? $locale.NUMBER_FORMATS.CURRENCY_SYM : currencySymbol;
      }
    }
  };
}
