import { createEdsMiddleware } from './middleware';
import EdsReducer from  './reducer';
const pjson = require('../package.json');

console.log(`redux-observable-source | version ${pjson.version}`);

export default {
  EdsReducer,
  createEdsMiddleware
}