export default class BaseEntity{

    constructor()
    {

    }

    all()
    {
        return [
            {
                id: 1,
                name: 'Iram'
            },
            {
                id: 2,
                name: 'Carlos'
            }
        ]
    }
    save()
    {
        return {}
    }
}