import { parseExpression } from 'cron-parser';
import cronstrue from 'cronstrue';
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

// Joi validation functions

export function validateTimezone(tz, helper) {
  const timezone = moment.tz.zone(tz);
  if (!timezone) {
    return helper.message(`Timezone ${tz} is invalid`);
  }
  return timezone.name;
}

export function validateCronSyntax(schedule, helper) {
  try {
    parseExpression(schedule);
    cronstrue.toString(schedule);
    return schedule;
  } catch {
    return helper.message(`Cron syntax ${schedule} is invalid`);
  }
}

export function formatDateString(date, options = {}) {
  return date.toLocaleString('en-US', {
    day: '2-digit',
    hour: '2-digit',
    year: 'numeric',
    month: 'short',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'long',
    ...options,
  });
}
