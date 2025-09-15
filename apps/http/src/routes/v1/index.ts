import { Hono } from "hono"
import userRouter from "./user"
import adminRouter from "./admin"
import spaceRouter from "./space"

const router = new Hono()

router.get('/', (c) => c.text("You reached the route"))

router.post('/signup', async(c) => {
    // const { username, password, type } = await c.req.json()

    return c.json({message: "Signup Successful!"})
})

router.post('/signin', async(c) => {
    // const { username, password } = await c.req.json()

    return c.json({token: "RandomShitToken"})
})

router.get('/elements', async(c) => {
    
})

router.get('/avatars', async(c) => {

})

router.route('/user', userRouter)
router.route('/admin', adminRouter)
router.route('/space', spaceRouter)

export default router