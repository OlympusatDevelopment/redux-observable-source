# rxsource

#### Vuex Plugin for providing a reactive X single data source to the state tree via branch mappings.

The power of this library is that you can tie an Observer to your ajax responses or a socket connection, then do a little mapping, and push into your application state from a single source. 

Components in the app can just "announce" what data they need and they don't have to manage dispatching to the store, it will be done for them. Similarly, a socket based api can push to a socket on the client that is updating that same Observable Subject. 

When a change comes in at any time, the Rxsource library that was passed the Observable will update the state tree and propagate changes down to any child component listening for updates. Ez-peezy reactive updates from a single, simple to reason about, source!

## Usage
Install the project into your vue project

`npm i -S rxsource`

Import it into your main store file

`import { Rxsource, rxsourceModule } from 'rxsource'`

Add the mutation, actions, and plugin to your Vuex store
```
  const testMap = [
    {
      branch: 'hello',
      key: 'helloWorld',
      updateByMerging: false // defaults to replace.
    }
  ]

  const debug = process.env.NODE_ENV !== 'production'

  const store = new Vuex.Store({
    actions: {...actions, ...rxsourceModule.actions},
    mutations: {...rxsourceModule.mutations},
    plugins: [
      Rxsource(somethingObservable$, testMap)
    ],
    getters,
    modules: {
      hello,
      world
    },
    strict: debug
  })
```

# Observable argument
`Rxsource([Observable], [Mapper])`

You'll see you need to pass the Rxsource plugin an Observable and a map.

The Observable should expose a .subscribe method that gets updated via a "next" callback as the first callback. Rxsource relies on this standard observable structure. Behind the scenes we just subscribe to the observable then route the incoming data to a particular branch of your store based on the map you provide. 

This structure works very well with GraphQL responses that return the key used by the API schema.

# Mapper argument
`Rxsource([Observable], [Mapper])`

The mapper is a collection specifying the mapping and the merge strategy to be used internally.

It's up to you to make sure you have your data behind a key that you can map. GraphQl does this for you, but for other apis you may have to add that key yourself when you get a response.

```
  const testMap = [
    {
      branch: 'hello',
      key: 'helloWorld',
      updateByMerging: false // defaults to replace.
    }
  ]
```

`branch` specifies what branch on your vuex state tree you want to apply the data to.
`key` is the key to look for on the incoming data. FOr instance, given the incoming data has a structure of 
```
  {"getUserById":{id:1234,name:"Eli"}}
```
and the mapper has a configuration of
```
  const testMap = [
    {
      branch: 'user',
      key: 'getUserById'
    }
  ]
```
then the user branch of the state tree will be updated with the data contained in getUserById.

`updateByMerging` sets the merge strategy. If set to false or if it's not present then the default merge strategy is to replace the data in that particular branch of he state tree with the incoming data. If set to tru, then the incoming data will be merged (if it's an object), or it will be concatenated (if it's an array).


