import ngCurrency from '../../src/ng-currency.module.js';
import defaults from './templates/defaults.html';

describe('ngCurrencySettings tests', () => {
  it('fraction should be applied', () => {
    const { element, scope } = initWithConfigAndCompile({ defaultFraction: 1 });

    scope.value = 123.451;
    scope.$digest();
    expect(element.val()).toEqual('$123.5');
  });

  it('currencySymbol should be applied', () => {
    const { element, scope } = initWithConfigAndCompile({ defaultCurrencySymbol: 'CHF' });

    scope.value = 123;
    scope.$digest();
    expect(element.val()).toEqual('CHF123.00');
  });

  it('min should be applied', () => {
    const { element, scope } = initWithConfigAndCompile({ defaultMin: 1 });

    scope.value = 0.01;
    scope.$digest();
    expect(element.hasClass('ng-invalid-min')).toBeTruthy();
    expect(element.val()).toEqual('$0.01');
    element.triggerHandler('focus');
    expect(element.val()).toEqual('0.01');
    element.triggerHandler('blur');
    expect(element.val()).toEqual('$0.01');
  });

  it('max should be applied', () => {
    const { element, scope } = initWithConfigAndCompile({ defaultMax: 1 });

    scope.value = 2;
    scope.$digest();
    expect(element.hasClass('ng-invalid-max')).toBeTruthy();
    expect(element.val()).toEqual('$2.00');
    element.triggerHandler('focus');
    expect(element.val()).toEqual('2');
    element.triggerHandler('blur');
    expect(element.val()).toEqual('$2.00');
  });
});

function initWithConfigAndCompile(config) {
  let element, scope;

  angular.mock.module(ngCurrency, { ngCurrencySettings: config});

  angular.mock.inject(($rootScope, $compile, $timeout) => {
    scope = $rootScope.$new();
    scope.value = 0;
    scope.$digest();
    element = $compile(defaults)(scope);
    element = element.find('input');
    $timeout.flush();
  });

  return { element, scope };
}
