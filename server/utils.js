import moment from 'moment-timezone';

export function cleanUserObject({
  password, slack, telegram, timezone,
}) {
  return {
    password: {
      enabled: password.enabled,
      isSet: password.hash.length > 0,
    },
    slack,
    telegram,
    timezone,
  };
}

export function getTimezone(timezone) {
  return moment.tz.zone(timezone);
}
