const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  autoReload: true,
  extension: '.json',
  staticCatalog: {
    zh: require('./zh.json'),
    en: require('./en.json'),
  },
});

module.exports = i18n;