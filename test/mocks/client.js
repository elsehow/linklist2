const EventEmitter = require('events').EventEmitter

const mockClient = new EventEmitter()

mockClient.store = {
  db:   new EventEmitter(),
  sync: new EventEmitter(),
}

// { total_rows: 0, offset: 0, rows: [] }

const mockAllMsgs =  {
  "total_rows": 2,
  "offset": 0,
  "rows": [
    {
      "id": "858cf07f-660b-4a69-9878-713b2bc04d6a",
      "key": "858cf07f-660b-4a69-9878-713b2bc04d6a",
      "value": {
        "rev": "1-b99bd717eb8e4fa685b9ea0210a570cb"
      },
      "doc": {
        "pseudo": "ffff",
        "timestamp": 1503792916,
        "message": "sup",
        "_id": "858cf07f-660b-4a69-9878-713b2bc04d6a",
        "_rev": "1-b99bd717eb8e4fa685b9ea0210a570cb"
      }
    },
    {
      "id": "e086b6a8-b4d9-4669-f09e-fcb65e5d39b4",
      "key": "e086b6a8-b4d9-4669-f09e-fcb65e5d39b4",
      "value": {
        "rev": "1-1cc2fbb2e9c543d0bd8f871acbdf73d3"
      },
      "doc": {
        "pseudo": "ffff",
        "timestamp": 1503792918,
        "message": "hey",
        "_id": "e086b6a8-b4d9-4669-f09e-fcb65e5d39b4",
        "_rev": "1-1cc2fbb2e9c543d0bd8f871acbdf73d3"
      }
    }
  ]
}

const mockChange =  {
  "ok": true,
  "start_time": "2017-08-27T00:17:36.665Z",
  "docs_read": 2,
  "docs_written": 2,
  "doc_write_failures": 0,
  "errors": [],
  "last_seq": 2,
  "docs": [
    {
      "pseudo": "ffff",
      "timestamp": 1503793059,
      "message": "what it is",
      "_id": "a504259e-ecfc-483d-fb23-44c71125ded2",
      "_rev": "1-155f315264194403ab360a46ddeb54d7"
    },
    {
      "pseudo": "ffff",
      "timestamp": 1503793056,
      "message": "hey",
      "_id": "72c5e803-f509-4f39-9b01-dc47cac650d5",
      "_rev": "1-6603e1a0b3474943a8f70e6397824f64"
    }
  ]
}

mockClient.store.fetchAllMessages = function () {
  mockClient.store.sync.emit('all-messages', mockAllMsgs)
}

mockClient.join = function () {}

mockClient.mockChange = mockChange

module.exports = mockClient