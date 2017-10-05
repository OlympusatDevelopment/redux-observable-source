import { UPDATE } from  './constants';

export default (state = {}, action) => {
  switch (action.type) {
    case UPDATE:
      const d = action.data;
console.log('redux-observable-source logger' ,action);  
      // DO we need to check if the the item is in the adapter?

      if (state.hasOwnProperty(d.branch)) {
        // mutate the branch data according to specified merge strategy
        if (!d.strategy) {// Replace merge strategy
          state[d.branch] = d.data;
        } else if (d.strategy === 'theirs') {
          state[d.branch] = Array.isArray(state[d.branch]) ?
            state[d.branch].push(d.data) : { ...d.data, ...state[d.branch] };
        } else if (d.strategy === 'ours') {
          state[d.branch] = Array.isArray(state[d.branch]) ?
            state[d.branch].unshift(d.data) : { ...state[d.branch], ...d.data };
        } else {
          state[d.branch] = d.data;// Handle lack of valid strategy as a replace
        }
      } else {
        state[d.branch] = d.data
      }
      return { ...state };
    default:
      return { ...state };
  }
}