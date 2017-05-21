# Mongo URI Total Translator
(aka MUTT)

Are you sick of translating between the Mongo URIs your applications use and the actual commands you need to send to the `mongo` command line tool?

Me too! This is a little utility that does the translation for you.

[![Supported by Thinkmill](https://thinkmill.github.io/badge/heart.svg)](http://thinkmill.com.au/?utm_source=github&utm_medium=badge&utm_campaign=mongo-uri-total-translator)

*Made by [Kevin Brown](https://twitter.com/kevinbrowntech), supported by [Thinkmill](http://thinkmill.com.au/). Thank you for making this project possible!*

## Installation

```
yarn global add mongo-uri-total-translator
```
or
```
npm install -g mongo-uri-total-translator
```

Once you've got it installed, you can do this:

```
$ mutt "mongodb://admin:password@test-live-shard-00-00-pvesn.mongodb.net:27017,test-live-shard-00-01-pvesn.mongodb.net:27017,test-live-shard-00-02-pvesn.mongodb.net:27017/database?ssl=true&replicaSet=Test-Live-shard-0&authSource=admin"
```

Which results in:
```
Running command:
mongo "mongodb://test-live-shard-00-00-pvesn.mongodb.net:27017,test-live-shard-00-01-pvesn.mongodb.net:27017,test-live-shard-00-02-pvesn.mongodb.net:27017/database?replicaSet=Test-Live-shard-0" --authenticationDatabase "admin" --ssl --username "admin" --password "password"

MongoDB shell version v3.4.1
connecting to: mongodb://test-live-shard-00-00-pvesn.mongodb.net:27017,test-live-shard-00-01-pvesn.mongodb.net:27017,test-live-shard-00-02-pvesn.mongodb.net:27017/database?replicaSet=Test-Live-shard-0
...etc...
```

Also, you can pass additional arguments, which will just get quoted and sent straight through to `mongo`:

```
$ mutt "mongodb://test" --eval "printjson(db.getCollectionNames())"

Running command:
mongo "mongodb://test:27017/test" "--eval" "printjson(db.getCollectionNames())"

MongoDB shell version v3.4.1
connecting to: mongodb://test:27017/test

...etc...
```

## Why do I need this?

I find it really odd that the `mongo` command line tool can't take a connection URI in the same format that the drivers do. Let's say I want to test a connection from a server, and I have the URI from a configuration file / environment variables / wherever. I have a few options:

1. Play around with my app, trying to see what's going on.
2. Build a little program that uses the same mongo URI to try to connect and play with that.
3. Mentally translate between the URI options and the command line options and construct a `mongo` command to replicate the problem.

I find the last option to be the best in general, except Mongo seems to intentionally make it difficult to translate between these worlds with odd differences like `authSource` vs `--authenticationDatabase` etc.

After I had spent quite a bit of time debugging my own mental translation process between these two worlds, I realised others would be suffering from the same problem and that we should just automate this process.

## What's on your roadmap?

This tool should be able to parse *any* valid mongo URI and create a corresponding `mongo` command, passing in any relevant options that it can glean from the URI.

It's in a very early state at the moment, and serves my own needs, but I want it to be more useful for everyone's needs. If you find something that should work that doesn't, please [create an issue](https://github.com/blargity/mongo-uri-total-translator/issues/new) or a PR so we can fix it!

## It's not working on my URI!

Please [create an issue](https://github.com/blargity/mongo-uri-total-translator/issues/new) or a PR so we can fix it!

## License

Licensed under the MIT License, Copyright © 2017 Kevin Brown.

See [LICENSE](./LICENSE) for more information.
