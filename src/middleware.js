import { UPDATE } from  './constants';
import { _EdsAdapter } from  './Adapter';

/**
 * The Event Creator is the Observable stream, for the sake of our description. This is the Event Manager. The Event consumer is the Store
 * @param {*} subject$ 
 */
export const createEdsMiddleware = adapterMap => {
  const adaptStream = _EdsAdapter(adapterMap);

  return subject$ => store => next => {

    // Subscribe to the observable, then adapt and parse the incoming data
    subject$
      .subscribe(data => {
        store.dispatch({ type: UPDATE, data: adaptStream(data) });
      });

    return action => next(action)
  }
}