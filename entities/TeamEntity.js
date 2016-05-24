import mongoose from 'mongoose'
import loadClass from 'mongoose-class-wrapper';
import validate from 'mongoose-validator'
import uniqueValidator from 'mongoose-unique-validator'

var TeamSchema = new mongoose.Schema({
    name : {
        type: String ,
        required : true,
        unique: true,
        validate : [
            validate({
                validator: 'isLength',
                arguments: [3, 50],
                message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
            })
        ]
    }
},
{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
})

class TeamEntity {

  getFillable()
  {
    return ['name']
  }

}

TeamSchema.virtual('members')
          .get( () => [])

TeamSchema.plugin(uniqueValidator)
TeamSchema.plugin(loadClass, TeamEntity);

export default mongoose.model('Team', TeamSchema)
