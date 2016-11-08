export default function ngCurrencySettings() {
  this.config = {
    defaultFraction: 2,
    defaultHardCap: false,
    defaultMin: undefined,
    defaultMax: undefined,
    defaultCurrencySymbol: undefined
  };

  this.setDefaultCurrencySymbol = defaultCurrencySymbol => {
    this.config.defaultCurrencySymbol = defaultCurrencySymbol;
  };

  this.setDefaultFraction = defaultFraction => {
    this.config.defaultFraction = defaultFraction;
  };

  this.setDefaultHardCap = defaultHardCap => {
    this.config.defaultHardCap = defaultHardCap;
  };

  this.setDefaultMin = defaultMin => {
    this.config.defaultMin = defaultMin;
  };

  this.setDefaultMax = defaultMax => {
    this.config.defaultMax = defaultMax;
  };

  this.$get = () => this.config;
}
