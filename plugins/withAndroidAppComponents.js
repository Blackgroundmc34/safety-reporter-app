const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidAppComponents(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Add the 'tools' namespace to the <manifest> tag
    androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    // Find the <application> tag and add the 'tools:replace' attribute
    const application = androidManifest.manifest.application[0];
    application.$['tools:replace'] = 'android:appComponentFactory';

    return config;
  });
};