const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const defaultLocale = 'en';
const defaultTimezone = 'America/Tijuana';

function formattedDate({
  useUtc = true,
  useLocale = defaultLocale,
  useTimezone = defaultTimezone,
  format = 'YYYY-MM-DDTHH:mm:ss[Z]',
} = {}) {
  let date = dayjs();

  if (useUtc) {
    date = date.utc();
  }

  if (useTimezone) {
    date = date.tz(useTimezone);
  }

  date = date.locale(useLocale);

  return date.format(format);
}

module.exports = { formattedDate };