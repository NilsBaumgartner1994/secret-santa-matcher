// This file can not have any imports. See app.config.ts as it will transpile this file to  JavaScript
//import { ServerHelper } from 'repo-depkit-common';

export type CustomerConfig = {
	projectName: string;
	projectSlug: string;
	//easUpdateId: string | null;
	//easProjectId: string | null;
	appScheme: string;
	bundleIdIos: string;
	bundleIdAndroid: string;
	baseUrl: string;
	//server_url: string;
};

// DO NOT CHANGE THE NAME OF THIS FUNCTION: getBuildNumber
// The workflow action check-build-number will use this function to determine the build number
// and will fail if the function is not present or does not return a number.
// The build number is used to determine if a new build is required.
export function getBuildNumber() {
	return 1;
}

export function getMajorVersion() {
	return 0;
}

export function getVersionPatch() {
	return 0;
}

export function getVersionInternalForAppsettingsScreen() {
	return getMajorVersion() + '.' + getBuildNumber() + '.' + getVersionPatch();
}

export function getVersion() {
	return getMajorVersion() + '.' + getBuildNumber() + '.' + 0;
}

export function getIosBuildNumber() {
	return getBuildNumber().toString();
}

export const devConfig: CustomerConfig = {
	projectName: 'Secret Santa Matcher',
	projectSlug: 'secret-santa-matcher',
	appScheme: 'app-secret-santa-matcher',
	bundleIdIos: 'de.baumgartner-software.secret-santa-matcher',
	bundleIdAndroid: 'de.baumgartnersoftware.secret-santa-matcher',
	baseUrl: '/secret-santa-matcher',
	//server_url: ServerHelper.TEST_SERVER_CONFIG.server_url,
};

export function getCustomerConfig(): CustomerConfig {
	return devConfig;
}

export function getFinalConfig(config?: any) {
	const customerConfig: CustomerConfig = getCustomerConfig();
	return {
		expo: {
			name: customerConfig.projectName,
			slug: customerConfig.projectSlug,
			version: getVersion(),
			orientation: 'default',
			icon: './assets/images/icon.png',
			notification: {
				icon: './assets/images/notification-icon.png',
			},
			/**
			updates: {
				enabled: true,
				url: 'https://u.expo.dev/' + customerConfig.easUpdateId,
				fallbackToCacheTimeout: 10 * 1000,
			},
				*/
			scheme: customerConfig.appScheme,
			userInterfaceStyle: 'automatic',
			splash: {
				image: './assets/images/splash.png',
				resizeMode: 'contain',
				backgroundColor: '#ffffff',
			},
			assetBundlePatterns: ['**/*'],
			ios: {
				supportsTablet: true,
				bundleIdentifier: customerConfig.bundleIdIos,
				buildNumber: getIosBuildNumber(),
				infoPlist: {
					NSPhotoLibraryUsageDescription: 'We need access to your photo library to select files',
					NSDocumentDirectoryUsageDescription: 'We need access to your document directory to select files',
				},
				config: {
					usesNonExemptEncryption: false,
				},
				entitlements: {
					'com.apple.developer.applesignin': ['Default'],
				},
				privacyManifests: {
					NSPrivacyCollectedDataTypes: [
						{
							NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePreciseLocation',
							NSPrivacyCollectedDataTypeLinked: false,
							NSPrivacyCollectedDataTypeTracking: false,
							NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeProductPersonalization', 'NSPrivacyCollectedDataTypePurposeAppFunctionality', 'NSPrivacyCollectedDataTypePurposeOther'],
						},
						{
							NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeEmailsOrTextMessages',
							NSPrivacyCollectedDataTypeLinked: true,
							NSPrivacyCollectedDataTypeTracking: false,
							NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeProductPersonalization', 'NSPrivacyCollectedDataTypePurposeAppFunctionality'],
						},
						{
							NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePhotosorVideos',
							NSPrivacyCollectedDataTypeLinked: true,
							NSPrivacyCollectedDataTypeTracking: false,
							NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
						},
						{
							NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeOtherUserContent',
							NSPrivacyCollectedDataTypeLinked: true,
							NSPrivacyCollectedDataTypeTracking: false,
							NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
						},
						{
							NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypeEmailAddress',
							NSPrivacyCollectedDataTypeLinked: true,
							NSPrivacyCollectedDataTypeTracking: false,
							NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
						},
					],
					NSPrivacyAccessedAPITypes: [
						{
							NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
							NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
						},
						{
							NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategorySystemBootTime',
							NSPrivacyAccessedAPITypeReasons: ['8FFB.1'],
						},
						{
							NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryDiskSpace',
							NSPrivacyAccessedAPITypeReasons: ['85F4.1'],
						},
						{
							NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryFileTimestamp',
							NSPrivacyAccessedAPITypeReasons: ['DDA9.1'],
						},
					],
				},
			},
			android: {
				adaptiveIcon: {
					foregroundImage: './assets/images/adaptive-icon.png',
					backgroundColor: '#ffffff',
				},
				package: customerConfig.bundleIdAndroid,
				blockedPermissions: ['android.permission.READ_MEDIA_IMAGES', 'android.permission.READ_MEDIA_VIDEO'],
				versionCode: getBuildNumber(),
			},
			web: {
				bundler: 'metro',
				output: 'static',
				favicon: './assets/images/favicon.png',
			},
			plugins: [
				'expo-router',
				'expo-secure-store',
				'expo-location',
				'expo-notifications',
				['expo-document-picker', { iCloudContainerEnvironment: 'Production' }],
				[
					'expo-splash-screen',
					{
						image: './assets/images/splash-icon.png',
						imageWidth: 200,
						resizeMode: 'contain',
						backgroundColor: '#ffffff',
					},
				],
				[
					'react-native-nfc-manager',
					{
						nfcPermission: 'The app accesses NFC read your Card balance.',
						includeNdefEntitlement: false,
					},
				],
				['expo-updates', { username: 'jack5496' }],
				[
					'expo-image-picker',
					{
						photosPermission: 'This app needs access to your photo library to capture and manage meal photos as part of the core digital meal plan functionality. Photos are essential for documenting meals in our canteen and restaurant management system.',
						cameraPermission: 'This app needs camera access to take photos of meals for the digital meal plan management system. Camera functionality is core to documenting and tracking meals in canteens and restaurants.',
						'//': 'Disables the microphone permission',
						microphonePermission: false,
					},
				],
				[
					'expo-build-properties',
					{
						android: {
							compileSdkVersion: 35,
							targetSdkVersion: 35,
							buildToolsVersion: '35.0.0',
						},
						ios: {
							deploymentTarget: '15.1',
						},
					},
				],
				'expo-localization',
				'expo-asset',
				'expo-font',
			],
			experiments: {
				typedRoutes: true,
				baseUrl: customerConfig.baseUrl,
			},
			extra: {
				router: {
					origin: false,
				},
				/**
				eas: {
					projectId: customerConfig.easProjectId,
				},
					*/
			},
			owner: 'baumgartner-software',
			runtimeVersion: {
				policy: 'appVersion',
			},
		},
	};
}
