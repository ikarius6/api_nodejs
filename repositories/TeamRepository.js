import Base from 'repositories/BaseRepository'
import Entity from 'entities/TeamEntity'
import Q from 'q'


class TeamRepository extends Base
{
    constructor(Entity)
    {
        super(Entity)
    }
}

export default new TeamRepository(Entity)
