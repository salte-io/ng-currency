import ngCurrency from '../../src/ng-currency.module.js';

describe('provider(ngCurrencySettings)', () => {
  let ngCurrencySettingsProvider, ngCurrencySettings;

  beforeEach(angular.mock.module(ngCurrency, (_ngCurrencySettingsProvider_) => {
    ngCurrencySettingsProvider = _ngCurrencySettingsProvider_;
  }));
  beforeEach(angular.mock.inject.strictDi(true));
  beforeEach(angular.mock.inject((_ngCurrencySettings_) => {
    ngCurrencySettings = _ngCurrencySettings_;
  }));

  describe('function(constructor)', () => {
    it('should set default values', () => {
      expect(ngCurrencySettingsProvider.defaults).toEqual({
        fraction: 2,
        hardCap: false,
        min: undefined,
        max: undefined,
        currencySymbol: undefined
      });
    });
  });

  describe('property(defaults)', () => {
    it('should be able to override the default values', () => {
      expect(ngCurrencySettingsProvider.defaults).toEqual({
        fraction: 2,
        hardCap: false,
        min: undefined,
        max: undefined,
        currencySymbol: undefined
      });

      ngCurrencySettingsProvider.defaults = true;

      expect(ngCurrencySettingsProvider.defaults).toEqual(true);
    });

    it('should be able to override specific values', () => {
      expect(ngCurrencySettingsProvider.defaults.hardCap).toEqual(false);

      ngCurrencySettingsProvider.defaults.hardCap = true;

      expect(ngCurrencySettingsProvider.defaults.hardCap).toEqual(true);
    });
  });

  describe('service(ngCurrencySettings)', () => {
    describe('getter(defaults)', () => {
      it('should reflect the default values', () => {
        expect(ngCurrencySettings.defaults).toEqual({
          fraction: 2,
          hardCap: false,
          min: undefined,
          max: undefined,
          currencySymbol: undefined
        });
      });

      it('should reflect changes to the provider', () => {
        expect(ngCurrencySettings.defaults.hardCap).toEqual(false);

        ngCurrencySettingsProvider.defaults.hardCap = true;

        expect(ngCurrencySettings.defaults.hardCap).toEqual(true);
      });
    });
  });
});
