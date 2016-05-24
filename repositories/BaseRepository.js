import Q from 'q'

export default class BaseRepository
{
  constructor(Entity)
  {
      this.entity = Entity
  }

  create()
  {
    return new this.entity
  }

  all(query)
  {
    var fields = query.fields || ''

    return this.entity.find({})
                      .then(resources => {
                        return resources.map(resource => {

                          var result = {}

                          if(fields)
                          {
                            fields.split(',').forEach(field => {
                              if(resource[field])
                              {
                                result[field] = resource[field]
                              }
                            })

                            return result
                          }
                          else
                          {
                              return resource
                          }
                        })
                      })
  }

  page(params , query)
  {
    var page = params.page || 1
    var limit = parseInt(query.limit || 5)
    var skip = (page - 1) * limit
    var fields = query.fields || ''

    return this.entity
               .count({})
               .then(total => {
                 if(total < skip)
                 {
                   return Q.reject('Not found')
                 }
                 var details = {
                   total : total
                 }
                 if(page -1 > 0)
                 {
                   details.prev = parseInt(page) -1
                 }
                 if( (page)*limit < total)
                 {
                   details.next = parseInt(page) + 1
                 }
                 return details
               })
               .then(details => this.entity
                                  .find({} , {} , {limit:limit, skip:skip})
                                  .then(resources => {
                                    return resources.map(resource => {

                                      var result = {}

                                      if(fields)
                                      {
                                        fields.split(',').forEach(field => {
                                          if(resource[field])
                                          {
                                            result[field] = resource[field]
                                          }
                                        })

                                        return result
                                      }
                                      else
                                      {
                                          return resource
                                      }
                                    })
                                  })
                                  .then(resources => Q.resolve({
                                      response : resources ,
                                      details : details
                                  }))
               )
  }

  findById(id , query)
  {
    var query = query  || {}
    var fields = query.fields || ''

    return this.entity.findById(id)
                      .then(resource => {

                          var entity = {}

                          if(fields)
                          {
                            fields.split(',').forEach(field => {
                              if(resource[field])
                              {
                                entity[field] = resource[field]
                              }
                            })
                          }
                          else
                          {
                            entity = resource
                          }

                          return {
                            resource : resource,
                            entity : entity
                          }
                      })
                      .then(response => {
                        return {
                          response : response.entity,
                          details : {
                            members : response.resource._id
                          }
                        }
                      })
  }

}
