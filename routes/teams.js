import express from 'express'
import controller from 'controllers/TeamController'
import resource from 'routes/Resource'

var router = express.Router()

router = resource.create(router , controller)

export default router;
