const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = {
  resolver: {
    blacklistRE: exclusionList([/node_modules\/.cache\/.*/]),
  },
  watchFolders: ['./'],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
