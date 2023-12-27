import { CronJob } from 'cron'

export const keepAlive = () => {
  new CronJob(
    '*/10 * * * *',
    async () => {
      console.log('Reconnected')
    },
    null,
    true,
    'America/Sao_Paulo'
  ).start()
}
