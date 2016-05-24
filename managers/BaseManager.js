import Q from 'q'

export default class BaseManager
{
    constructor(Validator){
      this.validator = Validator
    }

    save(data)
    {
        var fillable = this.entity.getFillable()
        fillable.forEach(field => {
          if(data.hasOwnProperty(field))
          {
            this.entity[field] = data[field]
          }
        })

        this.validator.setEntity(this.entity)

        return this.validator
            .isValid()
            .then(valid => this.entity
                               .save()
                               .then(resource => {
                                 return {
                                   response : resource,
                                   details : {
                                     location : resource._id
                                   }
                                 }
                               })

            )
            .catch(err => Q.reject(this.validator.errors))
    }

    update(data)
    {
        var fillable = this.entity.getFillable()

        fillable.forEach(field => {
          if(data.hasOwnProperty(field))
          {
            this.entity[field] = data[field]
          }
        })

        this.validator.setEntity(this.entity)

        return this.validator
            .isValid()
            .then(valid => this.entity.save()
                                      .then(resource => {
                                        return {
                                          response : resource,
                                          details : {
                                            location : resource._id
                                          }
                                        }
                                      })
            )
            .catch(err => Q.reject(this.validator.errors))
    }

    delete()
    {
      return this.entity.remove()
    }

    setEntity(Entity)
    {
        this.entity = Entity
    }
}
