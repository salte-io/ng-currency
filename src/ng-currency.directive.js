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
          controller.$viewValue = controller.$modelValue;
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
        if (active) {
          value = value.trim();
          const neg_dummy = $filter('currency')('-1', currencySymbol === undefined ? $locale.NUMBER_FORMATS.CURRENCY_SYM : currencySymbol, fraction);
          const neg_regexp = RegExp('[0-9.' + $locale.NUMBER_FORMATS.DECIMAL_SEP + $locale.NUMBER_FORMATS.GROUP_SEP + ']+');
          const neg_dummy_txt = neg_dummy.replace(neg_regexp.exec(neg_dummy), '');
          const value_dummy_txt = value.replace(neg_regexp.exec(value), '');

          // If is negative
          if (neg_dummy_txt === value_dummy_txt) {
            value = '-' + neg_regexp.exec(value)[0];
          }
          if (value === '-') {
            value = '0';
          }
          value = value
            .replace($locale.NUMBER_FORMATS.GROUP_SEP, '')
            .replace(currencySymbol === undefined ? $locale.NUMBER_FORMATS.CURRENCY_SYM : currencySymbol, '');
          value = keepInRange(Number(value));
          return value;
        }
        return value;
      });

      controller.$formatters.push((value) => {
        if (active && value !== '') {
          return $filter('currency')(value, currencySymbol === undefined ? $locale.NUMBER_FORMATS.CURRENCY_SYM : currencySymbol, fraction);
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
          let value = controller.$modelValue;
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
          const value = Number(controller.$modelValue).toFixed(fraction);
          if (controller.$viewValue !== value) {
            controller.$viewValue = value;
            controller.$render();
            element.triggerHandler('focus');
          }
        }
      });

      element.bind('blur', reformat);
    }
  };
}
