import ngCurrency from '../../src/ng-currency.module.js';
import defaults from './templates/defaults.html';
import variables from './templates/variables.html';
import centsToDollars from './templates/cents-to-dollars.html';

describe('ngCurrency directive tests', () => {
  let element, scope;

  beforeEach(angular.mock.module(ngCurrency));
  beforeEach(angular.mock.module(ngCurrency, ($compileProvider) => {
    $compileProvider.directive('centsToDollars', () => {
      return {
        require: 'ngModel',
        scope: {},
        link: (scope, elem, attrs, ngModel) => {
          ngModel.$parsers.push((viewValue) => {
            return Math.round(parseFloat(viewValue || 0) * 100);
          });

          ngModel.$formatters.push((modelValue) => {
            return (parseFloat(modelValue || 0) / 100).toFixed(2);
          });
        }
      };
    });
  }));

  // Functionality that is always on (excluding active)
  describe('Core Functionality', () => {
    beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
      scope = $rootScope.$new();
      scope.value = 0;
      scope.$digest();
      element = $compile(defaults)(scope);
      $timeout.flush();
    }));

    it('should be able to parse values with thousand separators', () => {
      element.val('$123,123.45');
      element.triggerHandler('input');
      expect(scope.value).toEqual(123123.45);
    });

    it('should be able to parse negatives', () => {
      element.val('-1.11');
      element.triggerHandler('input');
      expect(scope.value).toEqual(-1.11);
    });

    it('should be able to parse values with spaces', () => {
      element.val('$ -1.11');
      element.triggerHandler('input');
      expect(scope.value).toEqual(-1.11);
    });

    it('should be able to parse and reformat a value', () => {
      element.val('123123.45');
      element.triggerHandler('input');
      element.triggerHandler('focus');
      expect(element.val()).toEqual('123123.45');
      element.triggerHandler('blur');
      expect(element.val()).toEqual('$123,123.45');
      expect(scope.value).toEqual(123123.45);
    });

    it('should be able to parse and reformat a value, change the value and format again', () => {
      scope.value = 0;
      element.val('$123.45');
      element.triggerHandler('input');
      element.triggerHandler('focus');
      expect(element.val()).toEqual('123.45');
      element.val('456.78');
      element.triggerHandler('input');
      element.triggerHandler('blur');
      expect(element.val()).toEqual('$456.78');
      expect(scope.value).toEqual(456.78);
    });

    it('should not be able to parse characters', () => {
      scope.value = 'a';
      scope.$digest();
      expect(element.val()).toEqual('');
    });

    describe('Fast Digitation', () => {
      it('should parse "-" to 0', () => {
        element.val('-');
        element.triggerHandler('input');
        expect(scope.value).toEqual(0);
      });

      it('should parse "- " to 0', () => {
        element.val('- ');
        element.triggerHandler('input');
        expect(scope.value).toEqual(0);
      });
    });

    describe('Fast Fraction', () => {
      it('should parse ".5" to 0.5', () => {
        element.val('.5');
        element.triggerHandler('input');
        element.triggerHandler('blur');
        expect(scope.value).toEqual(0.5);
        expect(element.val()).toEqual('$0.50');
      });

      it('should parse "-.5" to ($0.50)', () => {
        element.val('-.5');
        element.triggerHandler('input');
        element.triggerHandler('blur');
        expect(scope.value).toEqual(-0.5);
        expect(element.val()).toEqual('($0.50)');
      });
    });

    describe('Support other Directives', () => {
      beforeEach(angular.mock.inject(($compile) => {
        element = $compile(centsToDollars)(scope);
        scope.value = 100;
        scope.$digest();
      }));

      it('should support multiple directives', () => {
        expect(element.val()).toEqual('$1.00');
      });

      it('should update the model correctly', () => {
        element.val('$123.45');
        element.triggerHandler('input');
        element.triggerHandler('blur');
        expect(scope.value).toEqual(12345);
        expect(element.val()).toEqual('$123.45');
      });
    });
  });

  // Functionality that is specific to the default values
  describe('Defaults', () => {
    beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
      scope = $rootScope.$new();
      scope.value = 0;
      scope.$digest();
      element = $compile(defaults)(scope);
      $timeout.flush();
    }));

    it('New for version 0.9.1 - Original value $0.00, should set input value to 0.00 on focus, then $0.00 on blur', () => {
      element.triggerHandler('focus');
      expect(element.val()).toEqual('0.00');
      element.triggerHandler('blur');
      expect(element.val()).toEqual('$0.00');
    });

    it('Issue #59 - Parse a string value as a float on focus', () => {
      scope.value = '1.00';
      scope.$digest();
      expect(element.val()).toEqual('$1.00');
      element.triggerHandler('focus');
      expect(element.val()).toEqual('1.00');
    });

    describe('Currency Symbol', () => {
      it('default currency symbol should be the match the locale', () => {
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).toEqual('$123.45');
      });
    });

    describe('Fraction', () => {
      it('should round (down) to two decimal places by default', () => {
        scope.value = 123.451;
        scope.$digest();
        expect(element.val()).toEqual('$123.45');
      });

      it('should round (up) to two decimal places by default', () => {
        scope.value = 123.457;
        scope.$digest();
        expect(element.val()).toEqual('$123.46');
      });
    });
  });

  // Functionality that is specific to the default values being overridden
  describe('Variables', () => {
    beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
      scope = $rootScope.$new();
      scope.value = 0;
      scope.active = true;
      scope.modelOptions = {};
      scope.currencySymbol = '$';
      scope.$digest();
      element = $compile(variables)(scope);
      $timeout.flush();
    }));

    describe('NG Currency', () => {
      it('should support dynamically disabling ngCurrency', () => {
        scope.active = false;
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).toEqual('123.45');
      });

      it('should disable validators when inactive', () => {
        scope.active = false;
        scope.value = 'a';
        scope.$digest();
        expect(element.val()).toEqual('a');
      });
    });

    describe('Currency Symbol', () => {
      it('should support an empty currency symbol', () => {
        scope.currencySymbol = '';
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).toEqual('123.45');
      });

      it('should support custom currency symbols', () => {
        scope.currencySymbol = '¥';
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).toEqual('¥123.45');
      });
    });

    describe('Fraction', () => {
      it('should support a fraction value of zero', () => {
        scope.fraction = 0;
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).toEqual('$123');
      });

      it('should support a custom fraction value', () => {
        scope.fraction = 5;
        scope.value = 123.45678;
        scope.$digest();
        expect(element.val()).toEqual('$123.45678');
      });
    });

    describe('Model Options', () => {
      it('should support updating on blur', () => {
        scope.modelOptions = { updateOn: 'blur' };
        scope.$digest();
        element.val('$123.45');
        element.triggerHandler('input');
        element.triggerHandler('blur');
        expect(scope.value).toEqual(123.45);
        expect(element.val()).toEqual('$123.45');
      });
    });

    describe('Max', () => {
      describe('Soft Cap', () => {
        it('should become invalid when the value exceeds the max', () => {
          scope.value = 1999999;
          scope.max = 1000000;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).toBeTruthy();
          expect(element.val()).toEqual('$1,999,999.00');
        });

        it('should become invalid when the max changes', () => {
          scope.value = 1999999;
          scope.max = 2000000;
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).toBeTruthy();
          expect(element.val()).toEqual('$1,999,999.00');
          scope.max = 1999998;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).toBeTruthy();
          expect(element.val()).toEqual('$1,999,999.00');
        });

        it('should be valid if no max value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).toBeTruthy();
          expect(element.val()).toEqual('$1,999,999.00');
        });

        it('should support a max of zero', () => {
          scope.value = 0.01;
          scope.max = 0;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).toBeTruthy();
          expect(element.val()).toEqual('$0.01');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.max = '3px';
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).toBeTruthy();
        });
      });

      describe('Hard Cap', () => {
        beforeEach(() => {
          scope.hardCap = true;
          scope.$digest();
        });

        it('should change the value to the max if it exceeds the max', () => {
          scope.max = 1;
          scope.value = 2;
          scope.$digest();
          expect(element.val()).toEqual('$1.00');
          expect(scope.value).toEqual(1);
        });

        it('should change the value to max when the max changes', () => {
          scope.max = 2;
          scope.value = 2;
          scope.$digest();
          expect(element.val()).toEqual('$2.00');
          expect(scope.value).toEqual(2);
          scope.max = 1;
          scope.$digest();
          expect(element.val()).toEqual('$1.00');
          expect(scope.value).toEqual(1);
        });

        it('should do nothing if no max value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.val()).toEqual('$1,999,999.00');
        });

        it('should do nothing if no max value is set and no ngModel value is provided', () => {
          scope.value = '';
          scope.$digest();
          expect(element.val()).toEqual('');
        });

        it('should support a max of zero', () => {
          scope.value = 0.01;
          scope.max = 0;
          scope.$digest();
          expect(element.val()).toEqual('$0.00');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.max = '3px';
          scope.$digest();
          expect(element.val()).toEqual('$4.00');
        });
      });
    });

    describe('Min', () => {
      describe('Soft Cap', () => {
        it('should become invalid when the value falls below the min', () => {
          scope.value = 0.01;
          scope.min = 1;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).toBeTruthy();
          expect(element.val()).toEqual('$0.01');
        });

        it('should become invalid when the min changes', () => {
          scope.value = 0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).toBeTruthy();
          expect(element.val()).toEqual('$0.01');
          scope.min = 1;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).toBeTruthy();
          expect(element.val()).toEqual('$0.01');
        });

        it('should be valid if no min value is set', () => {
          scope.value = 0.01;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).toBeTruthy();
          expect(element.val()).toEqual('$0.01');
        });

        it('should do nothing if no min value is set and no ngModel value is provided', () => {
          scope.value = undefined;
          scope.$digest();
          expect(element.val()).toEqual('');
          scope.value = null;
          scope.$digest();
          expect(element.val()).toEqual('');
          scope.value = '';
          scope.$digest();
          expect(element.val()).toEqual('');
        });

        it('should support a min of zero', () => {
          scope.value = -0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).toBeTruthy();
          expect(element.val()).toEqual('($0.01)');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.min = '5px';
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).toBeTruthy();
        });

        it('should do nothing when no value is provided', () => {
          scope.value = 4;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).toBeTruthy();
        });
      });

      describe('Hard Cap', () => {
        beforeEach(() => {
          scope.hardCap = true;
          scope.$digest();
        });

        it('should change the value to the min if it falls below the min', () => {
          scope.min = 1;
          scope.value = 0;
          scope.$digest();
          expect(element.val()).toEqual('$1.00');
          expect(scope.value).toEqual(1);
        });

        it('should change the value to min when the min changes', () => {
          scope.min = 0;
          scope.value = 0;
          scope.$digest();
          expect(element.val()).toEqual('$0.00');
          expect(scope.value).toEqual(0);
          scope.min = 1;
          scope.$digest();
          expect(element.val()).toEqual('$1.00');
          expect(scope.value).toEqual(1);
        });

        it('should do nothing if no min value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.val()).toEqual('$1,999,999.00');
        });

        it('should support a min of zero', () => {
          scope.value = -0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.val()).toEqual('$0.00');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.min = '3px';
          scope.$digest();
          expect(element.val()).toEqual('$4.00');
        });
      });
    });
  });
});
