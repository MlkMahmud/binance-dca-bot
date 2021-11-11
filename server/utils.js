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

export function validateTimezone(tz, helper) {
  const timezone = moment.tz.zone(tz);
  if (!timezone) {
    return helper.message(`Timezone ${tz} is invalid`);
  }
  return timezone.name;
}
