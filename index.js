import express from 'express'
import routes from 'routes'
import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/api_js')

const app = express()

routes(app)

app.listen(3000 , () => console.log('Servidor iniciado con Express en el puerto 3000') )
