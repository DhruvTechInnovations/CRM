const { withAndroidManifest, withAppBuildGradle } = require('@expo/config-plugins');

const with16kbManifest = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;

        if (androidManifest.manifest && androidManifest.manifest.application) {
            const app = androidManifest.manifest.application[0];
            // Set android:pageAlignSharedLibs="true" for Android 15+ 16KB support
            // app.$['android:pageAlignSharedLibs'] = 'true';

            // Also ensure extractNativeLibs is true if we want to rely on the package manager to install them aligned,
            // OR false if we want to read from APK aligned. 
            // Android 16KB support guide recommends uncompressed native libs (extractNativeLibs=false usually implies uncompressed in modern AGP, but let's stick to pageAlignSharedLibs which is the key flag).
            // Actually, pageAlignSharedLibs="true" lets the PackageManager know to install them with alignment if extracted, or map them effectively.
        }

        return config;
    });
};

const with16kbBuildGradle = (config) => {
    return withAppBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            // Ensure we are using 16kb alignment for jniLibs if possible or ensuring no compression so they can be mmap'ed aligned.
            // Modern AGP usually handles this with correct flags, but explicit is good.
            // For now, the Manifest flag is the primary requirement for Android 15.
        }
        return config;
    });
}

const with16kbSupport = (config) => {
    return with16kbManifest(config);
};

module.exports = with16kbSupport;
