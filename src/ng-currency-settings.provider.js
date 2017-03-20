export default class ngCurrencySettings {
    constructor() {
      this._defaults = {
        fraction: 2,
        hardCap: false,
        min: undefined,
        max: undefined,
        currencySymbol: undefined
      };
    }

    /**
     * The default property values for 'ng-currency'
     */
    get defaults() {
      return this._defaults;
    }

    set defaults(defaults) {
      this._defaults = defaults;
    }

    $get() {
      const provider = this;
      return {
        /**
         * The default property values for 'ng-currency'
         */
        get defaults() {
          return provider.defaults;
        }
      };
    }
}
