import 'ng-select-all-on-focus';
import { expect } from 'chai';
import angular from 'angular';

import ngCurrency from '../../src/ng-currency.module.js';
import centsToDollars from './directives/cents-to-dollars.module.js';
import defaults from './templates/defaults.html';
import variables from './templates/variables.html';
import centsToDollarsTemplate from './templates/cents-to-dollars.html';
import selectAllOnFocus from './templates/select-all-on-focus.html';

describe('ngCurrency directive tests', () => {
  let element, controller, scope;

  beforeEach(angular.mock.module('rb.select-all-on-focus'));
  beforeEach(angular.mock.inject.strictDi(true));
  beforeEach(angular.mock.module(ngCurrency, centsToDollars));

  // Functionality that is always on (excluding active)
  describe('Core Functionality', () => {
    beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
      scope = $rootScope.$new();
      sinon.spy(scope, '$on');
      scope.value = 0;
      scope.$digest();
      element = $compile(defaults)(scope);
      element = element.find('input');
      controller = element.controller('ngModel');
      $timeout.flush();
    }));

    it('should be able to parse values with thousand separators', () => {
      element.val('$123,123.45');
      element.triggerHandler('change');
      expect(scope.value).to.equal(123123.45);
    });

    it('should be able to parse negatives', () => {
      element.val('-1.11');
      element.triggerHandler('change');
      expect(scope.value).to.equal(-1.11);
    });

    it('should be able to parse values with spaces', () => {
      element.val('$ -1.11');
      element.triggerHandler('change');
      expect(scope.value).to.equal(-1.11);
    });

    it('should be able to parse empty values', () => {
      element.val('');
      element.triggerHandler('change');
      expect(scope.value).to.equal('');
      expect(element.val()).to.equal('');
      element.triggerHandler('focus');
      expect(element.val()).to.equal('');
    });

    it('should be able to parse and reformat a value', () => {
      element.val('123123.45');
      element.triggerHandler('change');
      element.triggerHandler('focus');
      expect(element.val()).to.equal('123123.45');
      element.triggerHandler('blur');
      expect(element.val()).to.equal('$123,123.45');
      expect(scope.value).to.equal(123123.45);
    });

    it('should be able to parse and reformat a value, change the value and format again', () => {
      scope.value = 0;
      element.val('$123.45');
      element.triggerHandler('change');
      element.triggerHandler('focus');
      expect(element.val()).to.equal('123.45');
      element.val('456.78');
      element.triggerHandler('change');
      element.triggerHandler('blur');
      expect(element.val()).to.equal('$456.78');
      expect(scope.value).to.equal(456.78);
    });

    it('should not be able to parse characters', () => {
      scope.value = 'a';
      scope.$digest();
      expect(element.val()).to.equal('');
    });

    describe('Fast Digitation', () => {
      it('should parse "-" to 0', () => {
        element.val('-');
        element.triggerHandler('change');
        expect(scope.value).to.equal(0);
      });

      it('should parse "- " to 0', () => {
        element.val('- ');
        element.triggerHandler('change');
        expect(scope.value).to.equal(0);
      });
    });

    describe('Fast Fraction', () => {
      it('should parse ".5" to 0.5', () => {
        element.val('.5');
        element.triggerHandler('change');
        element.triggerHandler('blur');
        expect(scope.value).to.equal(0.5);
        expect(element.val()).to.equal('$0.50');
      });

      it('should parse "-.5" to -$0.50', () => {
        element.val('-.5');
        element.triggerHandler('change');
        element.triggerHandler('blur');
        expect(scope.value).to.equal(-0.5);
        expect(element.val()).to.equal('-$0.50');
      });
    });

    describe('Custom Locale Options', () => {
      let $locale;
      beforeEach(angular.mock.inject((_$locale_) => {
        $locale = _$locale_;
      }));

      it('should parse "($0.50)" to ($0.50)', () => {
        const currencyPatterns = $locale.NUMBER_FORMATS.PATTERNS[1];
        currencyPatterns.negPre = '(\u00a4';
        currencyPatterns.negSuf = ')';
        element.val('($0.50)');
        element.triggerHandler('change');
        element.triggerHandler('blur');
        expect(scope.value).to.equal(-0.5);
        expect(element.val()).to.equal('($0.50)');
      });

      describe('Decimal: "," : Group: "."', () => {
        beforeEach(() => {
          $locale.NUMBER_FORMATS.DECIMAL_SEP = ',';
          $locale.NUMBER_FORMATS.GROUP_SEP = '.';
        });

        it('should support usage with the decimal separator', () => {
          element.val('$1.000,50');
          element.triggerHandler('change');
          element.triggerHandler('blur');
          expect(scope.value).to.equal(1000.5);
          expect(element.val()).to.equal('$1.000,50');
          element.triggerHandler('focus');
          expect(scope.value).to.equal(1000.5);
          expect(element.val()).to.equal('1000,50');
        });

        it('should support usage without the decimal separator', () => {
          element.val('$100.000');
          element.triggerHandler('change');
          element.triggerHandler('blur');
          expect(scope.value).to.equal(100000);
          expect(element.val()).to.equal('$100.000,00');
          element.triggerHandler('focus');
          expect(scope.value).to.equal(100000);
          expect(element.val()).to.equal('100000,00');
        });
      });
    });

    describe('Support other Directives', () => {
      describe('Modifying ngModel Value', () => {
        beforeEach(angular.mock.inject(($compile) => {
          element = $compile(centsToDollarsTemplate)(scope);
          scope.value = 100;
          scope.$digest();
        }));

        it('should support multiple directives', () => {
          expect(element.val()).to.equal('$1.00');
        });

        it('should update the model correctly', () => {
          element.val('$123.45');
          element.triggerHandler('change');
          element.triggerHandler('blur');
          expect(scope.value).to.equal(12345);
          expect(element.val()).to.equal('$123.45');
        });

        it('should update view value on focus correctly', () => {
          expect(element.val()).to.equal('$1.00');
          element.triggerHandler('focus');
          expect(element.val()).to.equal('1.00');
        });
      });

      describe('Reading Input Value', () => {
        beforeEach(angular.mock.inject(($compile) => {
          element = $compile(selectAllOnFocus)(scope);
          element[0].setSelectionRange = sinon.spy();
          scope.value = 0;
          scope.$digest();
        }));

        it('should support selecting the real value', () => {
          element.triggerHandler('focus');
          expect(element[0].setSelectionRange.callCount).to.equal(2);
          expect(element[0].setSelectionRange.calledWith(0, 4)).to.be.ok;
        });
      });
    });

    describe('$pristine', () => {
      it('should be pristine when initialized', () => {
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
      });

      it('should stay $pristine if the modelValue has not changed', () => {
        element.triggerHandler('focus');
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
        element.triggerHandler('blur');
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
      });

      it('should stay $pristine if the modelValue is changed', () => {
        scope.value = 10;
        scope.$digest();
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
        element.triggerHandler('focus');
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
        element.triggerHandler('blur');
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
      });

      it('should not stay $pristine if its already $dirty', () => {
        element.val('$10.00');
        element.triggerHandler('change');
        expect(element.hasClass('ng-pristine')).to.not.be.ok;
        expect(scope.form.currency.$pristine).to.not.be.ok;
        expect(scope.form.currency.$dirty).to.be.ok;
        expect(scope.form.$pristine).to.not.be.ok;
        expect(scope.form.$dirty).to.be.ok;
        element.triggerHandler('focus');
        expect(element.hasClass('ng-pristine')).to.not.be.ok;
        expect(scope.form.currency.$pristine).to.not.be.ok;
        expect(scope.form.currency.$dirty).to.be.ok;
        expect(scope.form.$pristine).to.not.be.ok;
        expect(scope.form.$dirty).to.be.ok;
        element.triggerHandler('blur');
        expect(element.hasClass('ng-pristine')).to.not.be.ok;
        expect(scope.form.currency.$pristine).to.not.be.ok;
        expect(scope.form.currency.$dirty).to.be.ok;
        expect(scope.form.$pristine).to.not.be.ok;
        expect(scope.form.$dirty).to.be.ok;
      });
    });

    describe('$broadcast(currencyRedraw)', () => {
      it('should listen for the `currencyRedraw` event', () => {
        sinon.spy(controller, '$validate');

        expect(scope.$on.calledWith('currencyRedraw', sinon.match.func)).to.equal(true);

        scope.$broadcast('currencyRedraw');

        expect(controller.$validate.callCount).to.equal(1);
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
      element = element.find('input');
      $timeout.flush();
    }));

    it('New for version 0.9.1 - Original value $0.00, should set input value to 0.00 on focus, then $0.00 on blur', () => {
      element.triggerHandler('focus');
      expect(element.val()).to.equal('0.00');
      element.triggerHandler('blur');
      expect(element.val()).to.equal('$0.00');
    });

    it('Issue #59 - Parse a string value as a float on focus', () => {
      scope.value = '1.00';
      scope.$digest();
      expect(element.val()).to.equal('$1.00');
      element.triggerHandler('focus');
      expect(element.val()).to.equal('1.00');
    });

    describe('Currency Symbol', () => {
      it('default currency symbol should be the match the locale', () => {
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).to.equal('$123.45');
      });
    });

    describe('Fraction', () => {
      it('should round (down) to two decimal places by default', () => {
        scope.value = 123.451;
        scope.$digest();
        expect(element.val()).to.equal('$123.45');
      });

      it('should round (up) to two decimal places by default', () => {
        scope.value = 123.457;
        scope.$digest();
        expect(element.val()).to.equal('$123.46');
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
      scope.required = true;
      scope.$digest();
      element = $compile(variables)(scope);
      element = element.find('input');
      $timeout.flush();
    }));

    describe('NG Currency', () => {
      it('should support dynamically disabling ngCurrency', () => {
        scope.active = false;
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).to.equal('123.45');
      });

      it('should disable validators when inactive', () => {
        scope.active = false;
        scope.value = 'a';
        scope.$digest();
        expect(element.val()).to.equal('a');
      });

      it('should display the real value when disabled with an invalid value', () => {
        scope.value = 0.01;
        scope.min = 1;
        scope.$digest();
        expect(element.val()).to.equal('$0.01');
        scope.active = false;
        scope.$digest();
        expect(element.val()).to.equal('0.01');
      });
    });

    describe('Currency Symbol', () => {
      it('should support an empty currency symbol', () => {
        scope.currencySymbol = '';
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).to.equal('123.45');
      });

      it('should support custom currency symbols', () => {
        scope.currencySymbol = '¥';
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).to.equal('¥123.45');
      });
    });

    describe('Fraction', () => {
      it('should support a fraction value of zero', () => {
        scope.fraction = 0;
        scope.value = 123.45;
        scope.$digest();
        expect(element.val()).to.equal('$123');
      });

      it('should support a custom fraction value', () => {
        scope.fraction = 5;
        scope.value = 123.45678;
        scope.$digest();
        expect(element.val()).to.equal('$123.45678');
      });
    });

    describe('Model Options', () => {
      let $timeout;
      beforeEach(angular.mock.inject((_$timeout_) => {
        $timeout = _$timeout_;
      }));

      describe('updateOn: blur', () => {
        beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
          scope = $rootScope.$new();
          scope.value = 0;
          scope.active = true;
          scope.currencySymbol = '$';
          scope.required = true;
          scope.modelOptions = {
            updateOn: 'blur'
          };
          scope.$digest();
          element = $compile(variables)(scope);
          element = element.find('input');
          $timeout.flush();
        }));

        it('should remain pristine when updating via the scope value', () => {
          scope.value = 123.45;
          scope.$digest();
          element.triggerHandler('change');
          element.triggerHandler('blur');
          expect(element.hasClass('ng-pristine')).to.be.ok;
          expect(scope.form.currency.$pristine).to.be.ok;
          expect(scope.form.currency.$dirty).to.not.be.ok;
          expect(scope.form.$pristine).to.be.ok;
          expect(scope.form.$dirty).to.not.be.ok;
          expect(element.val()).to.equal('$123.45');
        });

        it('should support updating on blur', () => {
          element.val('$123.45');
          element.triggerHandler('change');
          expect(scope.value).to.equal(0);
          expect(element.val()).to.equal('$123.45');
          element.triggerHandler('blur');
          expect(scope.value).to.equal(123.45);
          expect(element.val()).to.equal('$123.45');
          scope.min = 0.01;
          scope.max = 100;
          scope.$digest();
          expect(scope.value).to.equal(undefined);
          expect(element.val()).to.equal('$123.45');
        });

        it('should support a custom fraction value when updating on blur', () => {
          scope.fraction = 5;
          scope.$digest();
          element.val('$123.45678');
          element.triggerHandler('change');
          expect(scope.value).to.equal(0);
          expect(element.val()).to.equal('$123.45678');
          element.triggerHandler('blur');
          expect(element.val()).to.equal('$123.45678');
        });
      });

      describe('debounce', () => {
        beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
          scope = $rootScope.$new();
          scope.value = 0;
          scope.active = true;
          scope.currencySymbol = '$';
          scope.required = true;
          scope.modelOptions = {
            debounce: 1000
          };
          scope.$digest();
          element = $compile(variables)(scope);
          element = element.find('input');
          $timeout.flush();
        }));

        it('should support updating on debounce', () => {
          element.val('$123.45');
          element.triggerHandler('change');
          expect(scope.value).to.equal(0);
          expect(element.val()).to.equal('$123.45');
          element.triggerHandler('blur');
          expect(scope.value).to.equal(0);
          expect(element.val()).to.equal('$123.45');
          $timeout.flush();
          expect(scope.value).to.equal(123.45);
          expect(element.val()).to.equal('$123.45');
        });
      });
    });

    describe('Max', () => {
      describe('Soft Cap', () => {
        it('should become invalid when the value exceeds the max', () => {
          scope.value = 1999999;
          scope.max = 1000000;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).to.be.ok;
          expect(element.val()).to.equal('$1,999,999.00');
          element.triggerHandler('focus');
          expect(element.val()).to.equal('1999999.00');
          element.triggerHandler('blur');
          expect(element.val()).to.equal('$1,999,999.00');
        });

        it('should become invalid when the max changes', () => {
          scope.value = 1999999;
          scope.max = 2000000;
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).to.be.ok;
          expect(element.val()).to.equal('$1,999,999.00');
          scope.max = 1999998;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).to.be.ok;
          expect(element.val()).to.equal('$1,999,999.00');
        });

        it('should be valid if no max value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).to.be.ok;
          expect(element.val()).to.equal('$1,999,999.00');
        });

        it('should support a max of zero', () => {
          scope.value = 0.01;
          scope.max = 0;
          scope.$digest();
          expect(element.hasClass('ng-invalid-max')).to.be.ok;
          expect(element.val()).to.equal('$0.01');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.max = '3px';
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).to.be.ok;
        });

        it('should support invalid ngModel values', () => {
          scope.required = false;
          scope.value = '';
          scope.max = -0.01;
          scope.$digest();
          expect(element.hasClass('ng-valid-max')).to.be.ok;
          expect(element.val()).to.equal('');
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
          expect(element.val()).to.equal('$1.00');
          expect(scope.value).to.equal(1);
        });

        it('should change the value to max when the max changes', () => {
          scope.max = 2;
          scope.value = 2;
          scope.$digest();
          expect(element.val()).to.equal('$2.00');
          expect(scope.value).to.equal(2);
          scope.max = 1;
          scope.$digest();
          expect(element.val()).to.equal('$1.00');
          expect(scope.value).to.equal(1);
        });

        it('should do nothing if no max value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.val()).to.equal('$1,999,999.00');
        });

        it('should do nothing if no max value is set and no ngModel value is provided', () => {
          scope.value = '';
          scope.$digest();
          expect(element.val()).to.equal('');
        });

        it('should support a max of zero', () => {
          scope.value = 0.01;
          scope.max = 0;
          scope.$digest();
          expect(element.val()).to.equal('$0.00');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.max = '3px';
          scope.$digest();
          expect(element.val()).to.equal('$4.00');
        });
      });
    });

    describe('Min', () => {
      describe('Soft Cap', () => {
        it('should become invalid when the value falls below the min', () => {
          scope.value = 0.01;
          scope.min = 1;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).to.be.ok;
          expect(element.val()).to.equal('$0.01');
          element.triggerHandler('focus');
          expect(element.val()).to.equal('0.01');
          element.triggerHandler('blur');
          expect(element.val()).to.equal('$0.01');
        });

        it('should become invalid when the min changes', () => {
          scope.value = 0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).to.be.ok;
          expect(element.val()).to.equal('$0.01');
          scope.min = 1;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).to.be.ok;
          expect(element.val()).to.equal('$0.01');
        });

        it('should be valid if no min value is set', () => {
          scope.value = 0.01;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).to.be.ok;
          expect(element.val()).to.equal('$0.01');
        });

        it('should do nothing if no min value is set and no ngModel value is provided', () => {
          scope.value = undefined;
          scope.$digest();
          expect(element.val()).to.equal('');
          scope.value = null;
          scope.$digest();
          expect(element.val()).to.equal('');
          scope.value = '';
          scope.$digest();
          expect(element.val()).to.equal('');
        });

        it('should support a min of zero', () => {
          scope.value = -0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.hasClass('ng-invalid-min')).to.be.ok;
          expect(element.val()).to.equal('-$0.01');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.min = '5px';
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).to.be.ok;
        });

        it('should do nothing when no value is provided', () => {
          scope.value = 4;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).to.be.ok;
        });

        it('should support invalid ngModel values', () => {
          scope.required = false;
          scope.value = '';
          scope.min = 0.01;
          scope.$digest();
          expect(element.hasClass('ng-valid-min')).to.be.ok;
          expect(element.val()).to.equal('');
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
          expect(element.val()).to.equal('$1.00');
          expect(scope.value).to.equal(1);
        });

        it('should change the value to min when the min changes', () => {
          scope.min = 0;
          scope.value = 0;
          scope.$digest();
          expect(element.val()).to.equal('$0.00');
          expect(scope.value).to.equal(0);
          scope.min = 1;
          scope.$digest();
          expect(element.val()).to.equal('$1.00');
          expect(scope.value).to.equal(1);
        });

        it('should do nothing if no min value is set', () => {
          scope.value = 1999999;
          scope.$digest();
          expect(element.val()).to.equal('$1,999,999.00');
        });

        it('should support a min of zero', () => {
          scope.value = -0.01;
          scope.min = 0;
          scope.$digest();
          expect(element.val()).to.equal('$0.00');
        });

        it('should do nothing when an invalid value is provided', () => {
          scope.value = 4;
          scope.min = '3px';
          scope.$digest();
          expect(element.val()).to.equal('$4.00');
        });
      });
    });

    describe('Required', () => {
      beforeEach(angular.mock.inject(($rootScope, $compile, $timeout) => {
        scope = $rootScope.$new();
        scope.value = undefined;
        scope.$digest();
        element = $compile(`<input ng-currency min="1" ng-model="value" required>`)(scope);
        $timeout.flush();
      }));

      it('should support the required attribute', () => {
        expect(element.hasClass('ng-invalid')).to.be.ok;
        expect(element.hasClass('ng-invalid-min')).to.be.ok;
      });
    });

    describe('$pristine', () => {
      it('should be pristine when initialized with a custom currencySymbol', () => {
        scope.currencySymbol = '¥';
        scope.$digest();
        expect(element.hasClass('ng-pristine')).to.be.ok;
        expect(scope.form.currency.$pristine).to.be.ok;
        expect(scope.form.currency.$dirty).to.not.be.ok;
        expect(scope.form.$pristine).to.be.ok;
        expect(scope.form.$dirty).to.not.be.ok;
        expect(element.val()).to.equal('¥0.00');
      });
    });
  });
});
