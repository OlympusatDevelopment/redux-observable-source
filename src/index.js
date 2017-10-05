import { createSourceMiddleware } from './middleware';
import SourceReducer from  './reducer';
const pjson = require('../package.json');

console.log(`redux-observable-source | version ${pjson.version}`);

export default {
  SourceReducer,
  createSourceMiddleware 
}