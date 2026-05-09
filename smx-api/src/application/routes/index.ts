import { Router } from 'express'
import { userRouter } from './user.routes'
import { authRouter } from './auth.routes'
import { chatRouter } from './chat.routes'
import { threadRouter } from './thread.routes'
import { dataRouter } from './data.routes'
import { subscriberRouter } from './subscriber.routes'
import { searchKeysRouter } from './search-keys.routes'

export const router = Router()
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/chat', chatRouter)
router.use('/threads', threadRouter)
router.use('/data', dataRouter)
router.use('/subscribe', subscriberRouter)
router.use('/search-keys', searchKeysRouter)
