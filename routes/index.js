//import teams from 'routes/teams'
import express_reverse from 'express-reverse'
import bodyParser from 'body-parser'
import TeamController from 'controllers/TeamController'

var urlencodedParser = bodyParser.urlencoded({ extended: false })

export default function(app){

    express_reverse(app);

    app.get('teams.index' , '/teams', (req , res) => TeamController.index(req , res) )
    app.get('teams.page' , '/teams/page/:page', (req , res) => TeamController.page(req , res) )
    app.post('teams.store' , '/teams', urlencodedParser , (req , res) => TeamController.store(req , res) )
    app.get('teams.show' , '/teams/:id', (req , res) => TeamController.show(req , res) )
    app.put('teams.update' , '/teams/:id', urlencodedParser , (req , res) => TeamController.update(req , res) )
    app.delete('teams.delete' , '/teams/:id', (req , res) => TeamController.delete(req , res) )

    app.get('teams.show.members' , '/teams/:id/members', (req , res) => TeamController.show(req , res) )

    //app.use('/teams', teams)

}
