const EventEmitter = require('events').EventEmitter
const mockClient = new EventEmitter()

mockClient.store = {
  db:   new EventEmitter(),
  sync: new EventEmitter(),
}

mockClient.store.db.allDocs = function () {
  const mockDbResp = {
    "total_rows": 4,
    "offset": 0,
    "rows": [
      {
        "id": "005dcc35-c4be-4ab5-ddea-44f4e81b7ead",
        "key": "005dcc35-c4be-4ab5-ddea-44f4e81b7ead",
        "value": {
          "rev": "1-e8fa734d332d4e1d9886784ca8208f1c"
        }
      },
      {
        "id": "5d4138cb-e01f-4a26-9d5a-ac1a88e1f374",
        "key": "5d4138cb-e01f-4a26-9d5a-ac1a88e1f374",
        "value": {
          "rev": "1-c83ab16d48b64fa8b66dc742fff4254f"
        }
      },
      {
        "id": "669f99dd-2649-4f48-f7f2-f3588485fcff",
        "key": "669f99dd-2649-4f48-f7f2-f3588485fcff",
        "value": {
          "rev": "1-44a87165f0344136ace817cf628ff6fa"
        }
      },
      {
        "id": "acc33bee-7d77-4a12-d78f-5aa4fbe1418e",
        "key": "acc33bee-7d77-4a12-d78f-5aa4fbe1418e",
        "value": {
          "rev": "1-61d0409be6bf4b48bb37d1b0326f8a79"
        }
      }
    ]
  }

  return new Promise((resolve, reject) => {
    resolve(mockDbResp)
  })

}

module.exports = mockClient
