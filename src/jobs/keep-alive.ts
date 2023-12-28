import { CronJob } from 'cron'

export const keepAlive = () => {
  new CronJob(
    '*/10 * * * *',
    async () => {
      await fetch('https://financy-backend.onrender.com/')
    },
    null,
    true,
    'America/Sao_Paulo'
  ).start()
}
