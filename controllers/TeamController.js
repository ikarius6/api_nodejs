import Q from 'q'
import BaseController from 'controllers/BaseController'
import Repository from 'repositories/TeamRepository'
import Manager from 'managers/TeamManager'

class TeamController extends BaseController
{
    constructor(Repository , Manager)
    {
        super(Repository , Manager)

        this.alias = 'teams'

        Object.assign(this.headers , {members : 'Link'})
    }

    _getMembersDetail(req, id , envelope)
    {
      let host = req.protocol + '://' +req.get('host')
      let url = host + req.app.locals.url(`${this.alias}.show.members` , {id : id})

      if(!envelope)
      {
        url = `<${url}>; rel="members"`
      }
      return url
    }

}

export default new TeamController(Repository , Manager)
