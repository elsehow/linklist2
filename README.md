# linklist2

see [TODOS.org](TODOS.org)

## developing

clone this repository, then

    npm install

to start a couch/pouch server, easiest thing is

    cd .pouchcrap
    pouchdb-server --port 5984


you'll need to run this server to run the tests
to run the tests,

    npm run watch

now you can edit js files in src/ and test/ - tests will automatically re-run

## deploying

1. configure [couchdb with an admin account](http://docs.couchdb.org/en/1.6.1/intro/security.html#authentication), or use pouchdb-server.
2. in couch or pouch db's e.g. `localhost:5984/_utils/_config` http interface, set `bind_address` to `0.0.0.0` and press the green checkmark.

## license

BSD
