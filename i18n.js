const { I18n } = require('i18n');

const i18n = new I18n({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  autoReload: true,
  extension: '.json',
  staticCatalog: {
    zh: require('./lang/zh.json'),
    en: require('./lang/en.json'),
  },
});

module.exports = i18n;