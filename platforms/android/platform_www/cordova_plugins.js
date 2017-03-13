cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-android-permissions.Permissions",
        "file": "plugins/cordova-plugin-android-permissions/www/permissions.js",
        "pluginId": "cordova-plugin-android-permissions",
        "clobbers": [
            "cordova.plugins.permissions"
        ]
    },
    {
        "id": "org.awokenwell.proximity.proximity",
        "file": "plugins/org.awokenwell.proximity/www/proximity.js",
        "pluginId": "org.awokenwell.proximity",
        "clobbers": [
            "navigator.proximity"
        ]
    },
    {
        "id": "cordova-plugin-screen-orientation.screenorientation",
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
        "pluginId": "cordova-plugin-screen-orientation",
        "clobbers": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "id": "cordova-plugin-screen-orientation.screenorientation.android",
        "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.android.js",
        "pluginId": "cordova-plugin-screen-orientation",
        "merges": [
            "cordova.plugins.screenorientation"
        ]
    },
    {
        "id": "com.dooble.audiotoggle.AudioToggle",
        "file": "plugins/com.dooble.audiotoggle/www/audiotoggle.js",
        "pluginId": "com.dooble.audiotoggle",
        "clobbers": [
            "AudioToggle"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-android-permissions": "0.10.0",
    "cordova-plugin-whitelist": "1.3.2",
    "org.awokenwell.proximity": "1.1.0",
    "cordova-plugin-screen-orientation": "1.4.2",
    "com.dooble.audiotoggle": "1.0.0",
    "cordova-plugin-compat": "1.1.0"
};
// BOTTOM OF METADATA
});