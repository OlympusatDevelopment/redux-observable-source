# redux-observable-source
### As an integral piece in an Event-Driven Architecture, redux-observable-source is a Redux Middleware and data flow architecture for passing an Observable stream through an adapter to populate the branches on a state tree with data. How you get data to the observable is up to you, making it highly adaptable to your data sources, ie. websocket or ajax response as providers.

[https://www.npmjs.com/package/redux-observable-source](https://www.npmjs.com/package/redux-observable-source)

See this article on event driven architectures
[https://hackernoon.com/by-2020-50-of-managed-apis-projected-to-be-event-driven-88f7041ea6d8](https://hackernoon.com/by-2020-50-of-managed-apis-projected-to-be-event-driven-88f7041ea6d8)


#### Install
```
npm i -S redux-observable-source
```

#### Example Use
1. Import the SourceReducer and add to your Redux combineReducers object

```
  import { SourceReducer } from 'redux-observable-source';
  
  export default function createReducer(asyncReducers) {
    return combineReducers({
      SourceReducer,
      ...yourOtherReducers
    })
  }
```

2. Import the middleware, create the adapter, compose the middleware by currying in the adapter, and pass it an Observable that can be subscribed to
```
  import { createSourceMiddleware  } from 'redux-observable-source';

  const adapterMap = [
    {
      dataKey: 'data.data.offers',// dot syntax gets parsed to the correct location in the object, for graphql use cases
      branch : 'offers',
      strategy : false // "theirs", "ours", false(replace)
    }
  ];

  const sourceMiddleware = createSourceMiddleware(adapterMap)(someObservable$);
```

3. Add the `sourceMiddleware` middleware to your store configuration wherever and however your project is adding middleware. In the react-boilerplate it is added like this, your implementation may be different:

```
  export default function configureStore(initialState = {}, history) {
    // Create the store with two middlewares
    // 1. sagaMiddleware: Makes redux-sagas work
    // 2. routerMiddleware: Syncs the location/URL path to the state
    const middlewares = [
      sagaMiddleware,
      sourceMiddleware,
      routerMiddleware(history)
    ];

    const enhancers = [
      applyMiddleware(...middlewares),
    ];

    // If Redux DevTools Extension is installed use it, otherwise use Redux compose
    /* eslint-disable no-underscore-dangle */
    const composeEnhancers =
      process.env.NODE_ENV !== 'production' &&
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
    /* eslint-enable */

    const store = createStore(
      createReducer(),
      fromJS(initialState),
      composeEnhancers(...enhancers)
    );

    ...etc
```

### The Adapter
Internally, the middleqware takes an adapter collection in order to decipher how you want your streamed data to be mapped to your state tree branches.

If you look, each object in the adapterMap array has a `dataKey`, `branch`, and `strategy` property.
```
  {
    dataKey: 'data.data.offers',// dot syntax gets parsed to the correct location in the object, for graphql use cases
    branch : 'offers',
    strategy : false // theirs, ours, false(replace)
  }
```
##### dataKey 
A string representation of the object key used to hold the payload, the data you have received. It may be a single value or a dot notation representation.

`data.data.offers` maps to:
```
{
  data: {
    data : {
      offers:[
        {...someSchema}
      ]
    }
  }
}
```

You can also pass a single key name like `offers` that will map to:
```
{
  offers:[
    {...someSchema}
  ]
}
```

##### branch 
Simply the branch in the store/state tree that you want your payload data put in. For instance, given the above `offers` scenario, the payload data, the array portion, `{offers:[{...someSchema}]}` will end up populating the `store.offers` property after running through the middleware. If the branch property doesn't already exist in the store, it will be created.

##### strategy
This is the merge/replace strategy you'd like to use to update the data on the branch if it already has data. You have 3 options:
- 'theirs'
- 'ours'
- false

`theirs` means you prefer to merge objects in preferring the data that already exists, and for array payloads, if `theirs` is the strategy then array payloads will be `pushed` onto the existing array.

`ours` means that for object payloads the object will be merged in by preferring our new data over the existing data. For arrays, our array payload will be `unshifted` into the beginning of the array. 

`false` (or simply leaving out the `strategy` key) means you would like to `replace` the branch's existing data with the new incoming data. This is the most likely scenario.



### Important 
How you populate your Observable is up to you. The middleware only expects there to be an observable we can subscribe to, that has a payload with a deciperable key `{getUserById:{name:'Adam','age:'old''}}`.

**In the test case the application has one main rxjs Subject on the window object in the browser (or global in node).** This lets any part of the application (websockets or ajax call functions) access the Subject. The Subject is "nexted" from the response of the ajax call function and/or also from a websocket callback function. Now any response from any ajax call and any data pushed up the socket by an API can be adapted to map to a branch on the state tree which child components can be selectively "subscribed" to.

See rxjs docs for how to make a subject: [https://github.com/ReactiveX/rxjs](https://github.com/ReactiveX/rxjs)

### The value of this architecture?
By using this architecture we can do away with Thunk or Saga middleware essentially, simplifying our apps. Each component can use a single utility function to make ajax calls, the results of which are directly streamed into the store. The component doesn't have to handle the response to the call then dispatch a change to the store itself; it just has to announce what it needs. This greatly decouples the component and makes it easier to reason about.

By standardizing how the store gets its data, the application is now open to an easier implementation of websocket streamed data or individual requests.


#### Rough sketch of the architecture possible using a single source
![https://github.com/OlympusatDevelopment/redux-observable-source](/architecture.png?raw=true "https://github.com/OlympusatDevelopment/redux-observable-source")

#### Key Data Flow Takeaways:
1. Components only announce they need data
2. Components can not directly dispatch for data. (Eliminates the need for Thunks or Sagas, reducing app complexity)
3. AJAX calls are made via the same fn and the response is fed to the Observable
4. Websocket pushes are fed to the same Observable getting AJAX responses
5. An Event Manager [ The Adapter ] is responsible for mapping data to branches in the State Tree
6. State Tree data is fed to components via branches.