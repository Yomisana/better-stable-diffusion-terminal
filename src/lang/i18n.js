const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'tw'],
  defaultLocale: 'en',
  autoReload: true,
  extension: '.json',
  staticCatalog: {
    tw: require('./tw.json'),
    en: require('./en.json'),
  },
});

module.exports = i18n;