import { Router } from 'express'
import userRoutes from './routes/user/routes'
import expenseRoutes from './routes/expense/routes'
import refreshTokenRoutes from './routes/refresh-token/routes'

const routes = Router()

routes.use('/user', userRoutes)
routes.use('/expense', expenseRoutes)
routes.use('', refreshTokenRoutes)

export default routes
