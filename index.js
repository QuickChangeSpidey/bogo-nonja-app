/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

global.setImmediate = global.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
if (typeof global.clearImmediate === 'undefined') {
    global.clearImmediate = (id) => clearTimeout(id);
}
if (typeof global.setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

AppRegistry.registerComponent(appName, () => App);
