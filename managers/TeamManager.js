import Base from 'managers/BaseManager'
import Validator from 'validators/TeamValidator'

class TeamManager extends Base
{
    constructor(Validator)
    {
        super(Validator)
    }
}

export default new TeamManager(Validator)
