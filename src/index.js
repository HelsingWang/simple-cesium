import '/css/main.css';
import {ScMap} from './core/ScMap';

// Just for test
new ScMap();

export var VERSION = '1.0';
console.log('SimpleCesium V' + VERSION);

export {ScMap, ScMap as ScViewer} from './core/ScMap';