import Q from 'q'
import camelize from 'camelize'
import merge from 'merge'

export default class BaseController
{
    constructor(Repository , Manager)
    {
        this.repository = Repository
        this.manager = Manager
        this.headers = {
          total : 'X-Total-Count',
          prev : 'Link',
          next : 'Link',
          location : 'Location'
        }
    }

    index(req , res)
    {

        return this.repository
                  .all(req.query || {})
                  .then(resources => this._success(req, res , { response: resources } , 200))
                  .catch(err => res.send(500).json(this._generateErrors(err)))

    }

    page(req , res)
    {
        return this.repository
                  .page(req.params || {} , req.query || {})
                  .then(response => this._success(req, res , response , 200))
                  .catch(err => res.sendStatus(500).json(this._generateErrors(err)))

    }

    store(req , res)
    {
        if(!req.body) res.status(400).json({ error : 'Missing data'})
        let data = req.body

        let resource = this.repository.create()
        this.manager.setEntity(resource)

        return this.manager
                  .save(data)
                  .then(response => this._success(req, res , response , 201 , true))
                  .catch(err => res.status(400).json(this._generateErrors(err)))
    }

    show(req , res)
    {
        let id = req.params.id || false
        if(!id) res.status(400).json({ error : 'Missing parameter: id'})

        return this.repository
                 .findById(id, req.query)
                 .then(response => this._success(req, res , response , 200 , true))
                 .catch(err => res.status(404).json({ error : 'Entity not found'}))

    }

    update(req , res)
    {

        let id = req.params.id || false
        if(!id) res.status(400).json({ error : 'Missing parameter: id'})

        if(!req.body) res.status(400).json({ error : 'Missing data'})
        let data = req.body

        return this.repository
                  .findById(id)
                  .then(resource => {
                    this.manager.setEntity(resource.response)
                    return this.manager
                             .update(data)
                             .then(response => this._success(req, res , response , 200 , true))
                             .catch(err => res.status(400).json(this._generateErrors(err)))
                  })
                  .catch(err => res.status(404).json({ error : 'Entity not found'}))

    }

    delete(req , res)
    {

        let id = req.params.id || false
        if(!id) res.status(400).json({ error : 'Missing parameter: id'})

        return this.repository
                  .findById(id)
                  .then(resource => {
                    this.manager.setEntity(resource.response)
                    return this.manager
                            .delete()
                            .then(resource => res.sendStatus(204))
                            .catch(err => res.status(400).json(this._generateErrors(err)))
                  })
                  .catch(err => res.status(404).json({ error : 'Entity not found'}))

    }

    _generateErrors(err)
    {
      if(typeof err == 'string')
      {
        return { error : err}
      }
      return { errors : err}
    }

    _success(req, res, response , status , single)
    {
      var detailsResponse = {}
      var details = response.details || {}
      var envelope = req.query.envelope || false
      var single = single || false

      Object.keys(details).forEach( detail => {

        let method = '_'+camelize(`get_${detail}_detail`)
        let value = (typeof this[method] == 'function') ?  this[method](req , details[detail] , envelope) :  details[detail]

        if(!envelope)
        {
          if(this.headers[detail])
          {
            let h = this.headers[detail]

            if(!detailsResponse[h])
            {
              detailsResponse[h] = '';
            }
            else {
              detailsResponse[h] += ', '
            }
            detailsResponse[h] += value
          }
        }
        else
        {
          detailsResponse[detail] = value
        }

      })
      if(envelope)
      {
        if(typeof response.response.toJSON == 'function')
        {
          response.response = response.response.toJSON()
        }

        var resource = response.response

        resource.links = detailsResponse

        if(!single)
        {
          resource = { data : response.response , links : detailsResponse }
        }

        return res.status(status).json(resource)
      }
      else
      {
        return res.set(detailsResponse).status(status).send(response.response)
      }
    }

    _getPrevDetail(req , prev , envelope)
    {
      let host = req.protocol + '://' +req.get('host')
      let url = host + req.app.locals.url(`${this.alias}.page` , {page : prev})

      if(!envelope)
      {
        url = `<${url}>; rel="prev"`
      }
      return url
    }

    _getNextDetail(req, next , envelope)
    {
      let host = req.protocol + '://' +req.get('host')
      let url = host + req.app.locals.url(`${this.alias}.page` , {page : next})

      if(!envelope)
      {
        url = `<${url}>; rel="next"`
      }
      return url
    }

    _getLocationDetail(req, id , envelope)
    {
      let host = req.protocol + '://' +req.get('host')
      let url = host + req.app.locals.url(`${this.alias}.show` , {id : id})
      return url
    }
}
