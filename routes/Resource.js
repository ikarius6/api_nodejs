import BaseController from 'controllers/BaseController'
import bodyParser from 'body-parser'
import express_reverse from 'express-reverse'

var urlencodedParser = bodyParser.urlencoded({ extended: false })

class Resource
{
    create(router , controller)
    {
        if(controller instanceof BaseController === true)
        {
            //express_reverse(router);

            router.get('df','/', (req , res) => controller.index(req , res) )
            router.get('/page/:page', (req , res) => controller.page(req , res) )
            router.post('/', urlencodedParser , (req , res) => controller.store(req , res) )
            router.get('/:id', (req , res) => controller.show(req , res) )
            router.put('/:id', urlencodedParser , (req , res) => controller.update(req , res) )
            router.delete('/:id', (req , res) => controller.delete(req , res) )
        }
        else
        {
            throw Error(`${controller.constructor.name} must be extend of BaseController`)
        }

        return router
    }
}

export default new Resource()
