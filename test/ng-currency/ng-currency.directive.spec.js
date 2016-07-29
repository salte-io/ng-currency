import ngCurrency from '../../src/ng-currency.module.js';

describe('ngCurrency directive tests', function() {
  let elem, elemdefault, scope, elemmo, elemfpos, elemfpos5, elemcurrdisabled, elemnreq, elemfastfraction, elemminmaxvar;

  beforeEach(angular.mock.module(ngCurrency));

  beforeEach(angular.mock.module(ngCurrency, function($compileProvider) {
    $compileProvider.directive('centsToDollars', function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {},
        link: function(scope, elem, attrs, ngModel) {
          ngModel.$parsers.push(function(viewValue) {
            return Math.round(parseFloat(viewValue || 0) * 100);
          });

          ngModel.$formatters.push(function(modelValue) {
            return (parseFloat(modelValue || 0) / 100).toFixed(2);
          });
        }
      };
    });
  }));

  beforeEach(angular.mock.inject(function($rootScope, $compile) {
    scope = $rootScope.$new();
    elemdefault = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency>");
    elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-currency>");
    elemmo = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-model-options=\"{ updateOn:'blur' }\"  ng-currency>");
    elemfpos = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-required='true' ng-currency fraction='0'>");
    elemfpos5 = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-currency fraction='5'>");
    elemcurrdisabled = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-currency='{{isCurrency}}'>");
    elemnreq = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='0.02' max='999999' ng-currency fraction='2'>");
    elemfastfraction = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency>");
    elemminmaxvar = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='{{mini}}' max='{{maxi}}' ng-required='true' ng-currency>");
  }));

  it('should format Model float 123.45 to "$123.45" view as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.45;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.45");
    })
  );

  it('should format Model "123.451" to "$123.45" view as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.451;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.45");
    })
  );

  it('should format Model "123.457" to "$123.46" (round) view as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.457;
      elem = $compile(elem)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.46");
    })
  );

  describe("when currency-symbol is declared", function() {
    beforeEach(angular.mock.inject(function($rootScope) {
      scope = $rootScope.$new();
      elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency currency-symbol='¥'>");
    }));

    it('should format with declared symbol',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 123.45;
        elem = $compile(elem)(scope);
        scope.$digest();
        expect(elem.val()).toEqual("¥123.45");
      })
    );

    describe("when currency-symbol declared is empty", function() {
      beforeEach(angular.mock.inject(function($rootScope) {
        scope = $rootScope.$new();
        elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' ng-currency currency-symbol=''>");
      }));

      it('should format without symbol',
        angular.mock.inject(function($rootScope, $compile) {
          scope.testModel = 123.45;
          elem = $compile(elem)(scope);
          scope.$digest();
          expect(elem.val()).toEqual("123.45");
        })
      );
    });
  });

  it('should set ngModel to 123.45 from string $123.45 as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.45");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(123.45);
    })
  );

  it('should set ngModel to 123123.45 from string $123,123.45 as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123,123.45");
      elem.triggerHandler('input');
      expect(scope.testModel).toEqual(123123.45);
    })
  );

  it('should set input value to $123,123.45 and Model to float 123123.45 from string 123123.45 as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("123123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(elem.val()).toEqual("$123,123.45");
      expect(scope.testModel).toEqual(123123.45);
    })
  );

  it('should trigger max error for 1999999 from string $1999999.0 as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$1999999.0");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      elem.hasClass('ng-invalid-max');
      expect(elem.val()).toEqual("$1,999,999.00");
    })
  );

  it('should trigger min error for 0.01 from string $0.01 as locale currency',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$0.01");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      elem.hasClass('ng-invalid-min');
      expect(elem.val()).toEqual("$0.01");
    })
  );

  it('should tigger invalid max after change maxi variable',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      scope.mini = 1;
      scope.maxi = 10;
      elem = $compile(elemminmaxvar)(scope);
      elem.val("$4");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(elem.hasClass('ng-valid-max')).toEqual(true);
      scope.maxi = 3;
      scope.$digest();
      expect(elem.hasClass('ng-invalid-max')).toEqual(true);
    })
  );

  it('should do nothing when max value is not a valid number',
    angular.mock.inject(function($rootScope, $compile) {
      elem = $compile(elemminmaxvar)(scope);
      scope.testModel = 4;
      scope.maxi = '3px';
      scope.$digest();
      expect(elem.hasClass('ng-valid-max')).toEqual(true);
    })
  );

  it('should do nothing when min value is not a valid number',
    angular.mock.inject(function($rootScope, $compile) {
      elem = $compile(elemminmaxvar)(scope);
      scope.testModel = 4;
      scope.mini = '5px';
      scope.$digest();
      expect(elem.hasClass('ng-valid-min')).toEqual(true);
    })
  );

  it('should tigger invalid min after change mini variable',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      scope.mini = 1;
      scope.maxi = 10;
      elem = $compile(elemminmaxvar)(scope);
      elem.val("$4");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(elem.hasClass('ng-valid-min')).toEqual(true);
      scope.mini = 5;
      scope.$digest();
      expect(elem.hasClass('ng-invalid-min')).toEqual(true);
    })
  );

  it('should trigger ng-required error',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("");
      elem.triggerHandler('input');
      elem.hasClass('ng-invalid-required');
    })
  );

  describe('model value should be undefined when view value does not pass validation', function() {
    it('should not set 0 value from string 0 when required min is not met',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("0");
        elem.triggerHandler('input');
        elem.triggerHandler('blur');
        expect(scope.testModel).toBeUndefined();
        expect(elem.val()).toEqual("$0.00");
      })
    );

    it('should not set 9999991 value from string 9999991 when required max is not met',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("9999991");
        elem.triggerHandler('input');
        elem.triggerHandler('blur');
        expect(scope.testModel).toBeUndefined();
        expect(elem.val()).toEqual("$9,999,991.00");
      })
    );
  });

  describe('when the min is set to zero or lower', function() {
    beforeEach(function() {
      elem = angular.element("<input ng-model='testModel' name='ngtest' type='text' min='-2' max='999999' ng-required='true' ng-currency>");
    });

    it('should set -0 value from string - ',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("-");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0);
      })
    );
    it('should set -0 value from string \'- \' ',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("- ");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-0);
      })
    );
    it('should set -1.11 value from string -1.11',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("-1.11");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-1.11);
      })
    );
    it('should set -1.11 value from string $ -1.11',
      angular.mock.inject(function($rootScope, $compile) {
        scope.testModel = 0;
        elem = $compile(elem)(scope);
        elem.val("$ -1.11");
        elem.triggerHandler('input');
        expect(scope.testModel).toBe(-1.11);
      })
    );
  });

  it('issue #14 - should set input value to $123.45 from string 123.45 as locale currency with ng-model-options="{ updateOn:\'blur\' }"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elemmo = $compile(elemmo)(scope);
      elemmo.val("$123.45");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(123.45);
      expect(elemmo.val()).toEqual('$123.45');
    })
  );

  it('issue #28 - Fast fraction - Input should not filter fast fraction notation ej: .5"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elemmo = $compile(elemfastfraction)(scope);
      elemmo.val(".5");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(0.5);
      expect(elemmo.val()).toEqual('$0.50');
    })
  );

  it('issue #28 - Fast fraction - Input should not filter fast fraction notation ej: -.5"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elemmo = $compile(elemfastfraction)(scope);
      elemmo.val("-.5");
      elemmo.triggerHandler('input');
      elemmo.triggerHandler('blur');
      expect(scope.testModel).toEqual(-0.5);
      expect(elemmo.val()).toEqual('($0.50)');
    })
  );

  it('Adding an optional fraction value to take advantage of the currency filter\'s third param fraction="0"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.45;
      elem = $compile(elemfpos)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123");
    })
  );

  it('Adding an optional fraction value to take advantage of the currency filter\'s third param fraction="5"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.45678;
      elem = $compile(elemfpos5)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$123.45678");
    })
  );

  it('Adding an optional fraction value to take advantage of the currency filter\'s third param fraction="0" model="a"',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 'a';
      elem = $compile(elemfpos)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("");
    })
  );

  it('Disable ng-currency format',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 123.45;
      scope.isCurrency = false;
      elem = $compile(elemcurrdisabled)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("123.45");
    })
  );

  it('Not required and not a number with max and min',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 'a';
      scope.isCurrency = false;
      elem = $compile(elemnreq)(scope);
      elem.triggerHandler('input');
      scope.$digest();
      expect(elem.val()).toEqual("");
    })
  );

  describe("issue #18 - ng-currency doesn't play well with other directives when loosing focus", function() {
    var el;

    beforeEach(angular.mock.inject(function($compile) {
      var template = "<input ng-model='modelInCents' cents-to-dollars ng-currency>";
      el = $compile(template)(scope);
      scope.modelInCents = 100;
      scope.$digest();
    }));

    it("should load the model correctly",
      angular.mock.inject(function($compile) {
        expect(el.val()).toEqual('$1.00');
      }));

    it("should update the model correctly",
      angular.mock.inject(function($compile) {
        el.val("$123.45");
        el.triggerHandler('input');
        el.triggerHandler('blur');

        expect(scope.modelInCents).toEqual(12345);
        expect(el.val()).toEqual('$123.45');
      }));
  });

  it('New for version 0.9.1 - Original value $123.45, should set input value to 123.45 on focus, then $123.45 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('123.45');
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(123.45);
      expect(elem.val()).toEqual('$123.45');
    })
  );

  it('New for version 0.9.1 - Original value $123.45, should set input value to 123.45 on focus, change to 456.78, then $456.76 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('123.45');
      elem.val("456.78");
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(123.45);
      expect(elem.val()).toEqual('$123.45');
    })
  );

  it('New for version 0.9.1 - Original value $123.45, should set input value to 123.45 on focus, change to $456.78, then $456.76 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.45");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('123.45');
      elem.val("$456.78");
      elem.triggerHandler('input');
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(456.78);
      expect(elem.val()).toEqual('$456.78');
    })
  );

  it('New for version 0.9.1 - Original value $123.00, should set input value to 123.00 on focus, then $123.00 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elem)(scope);
      elem.val("$123.00");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('123.00');
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(123.00);
      expect(elem.val()).toEqual('$123.00');
    })
  );

  it('New for version 0.9.1 - Original value $0.00, should set input value to 0.00 on focus, then $0.00 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elemdefault)(scope);
      elem.val("$0.00");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('0.00');
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(0);
      expect(elem.val()).toEqual('$0.00');
    })
  );

  it('New for version 0.9.2 - Original value $123,456, should set input value to 123456 on focus, then $123456 on blur',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = 0;
      elem = $compile(elemfpos)(scope);
      elem.val("$123,456");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual('123456');
      elem.triggerHandler('blur');
      expect(scope.testModel).toEqual(123456);
      expect(elem.val()).toEqual('$123,456');
    })
  );

  it('Issue #59 - Parse a string value as a float on focus',
    angular.mock.inject(function($rootScope, $compile) {
      scope.testModel = '1.00';
      elem = $compile(elemdefault)(scope);
      scope.$digest();
      expect(elem.val()).toEqual("$1.00");
      elem.triggerHandler('input');
      elem.triggerHandler('focus');
      expect(elem.val()).toEqual("1.00");
    })
  );
});
