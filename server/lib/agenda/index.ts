import { readdirSync } from 'fs';
import { resolve } from 'path';
import Agenda from 'agenda';

const agenda = new Agenda();
const jobs = readdirSync(resolve(__dirname, 'jobs'));

jobs.forEach((job) => {
  if (!job.endsWith('.map')) {
    require(`./jobs/${job}`)(agenda);
  }
});

export default agenda;
