### Routes
####GET

|Ressource   | Description  |  on Success | on Failure |
|---|---|---|---|
|/data/cities           | returns all available cities  | json object | statusCode: 404 |
|/data/moods | returns all available moods  | json object | statusCode: 404 | 
|/data/acc           | returns all available accomodations   | json object | statusCode: 404 |

### Dummy json results (Query_names without underscore!!)

#### cities
```
[
    {
        "_id": "551bd8d98fe8ee54fe79fbe0",
        "name": "Konstanz",
        "plz": 78764,
        "type": "city"
    },
    {
        "_id": "551bd8d96ac6271311173b03",
        "name": "Berlin",
        "plz": 13545,
        "type": "city"
    },
    {
        "_id": "551bd8d9c528474af52dbd7e",
        "name": "Hamburg",
        "plz": 24567,
        "type": "city"
    }
]
```

#### accomodations
```
[
    {
        "_id": "1",
        "name": "Couch",
        "query_name": "couch",
        "type": "accommodation"
    },
    {
        "_id": "2",
        "name": "Room",
        "query_name": "room",
        "type": "accommodation"
    },
    {
        "_id": "3",
        "name": "Holiday Flat",
        "query_name": "holidayflat",
        "type": "accommodation"
    }
]
```

#### moods
```
[
    {
        _id: '1',
        title: 'Family Fun',
        icon: '',
        image: '',
        "query_name": "familyfun",
        description: '',
        excludes: [],
        "type": "mood"
    },
    {
        _id: '2',
        title: 'Girls on Tour',
        icon: '',
        image: '',
        "query_name": "grilsontour",
        description: '',
        excludes: ['4', '5'],
        "type": "mood"
    },
    {
        _id: '3',
        title: 'Buddytrip',
        icon: '',
        image: '',
        "query_name": "buddytrip",
        description: '',
        excludes: [],
        "type": "mood"
    },
    {
        _id: '4',
        title: 'Singles unter sich',
        icon: '',
        image: '',
        "query_name": "singlesuntersich",
        description: '',
        excludes: [],
        "type": "mood"
    }
]
```
