import {Hono} from 'hono'

const spaceRouter = new Hono()

spaceRouter.post('', async(c) => {

})

spaceRouter.post('/element', async(c) => {

})

spaceRouter.delete('/element', async(c) => {

})

spaceRouter.get('/all', async(c) => {

})

spaceRouter.get('/:spaceId', async(c) => {

})

spaceRouter.delete('/:spaceId', async(c) => {

})

export default spaceRouter