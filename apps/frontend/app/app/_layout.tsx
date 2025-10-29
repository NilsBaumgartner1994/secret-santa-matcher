// Polyfill for environments where `setImmediate` is not available (e.g. web)
import 'setimmediate';
import React, {useEffect} from 'react';
import {Slot, usePathname} from 'expo-router';
import {RootSiblingParent} from 'react-native-root-siblings';
import {
	Poppins_100Thin,
	Poppins_100Thin_Italic,
	Poppins_200ExtraLight,
	Poppins_200ExtraLight_Italic,
	Poppins_300Light,
	Poppins_300Light_Italic,
	Poppins_400Regular,
	Poppins_400Regular_Italic,
	Poppins_500Medium,
	Poppins_500Medium_Italic,
	Poppins_600SemiBold,
	Poppins_600SemiBold_Italic,
	Poppins_700Bold,
	Poppins_700Bold_Italic,
	Poppins_800ExtraBold,
	Poppins_800ExtraBold_Italic,
	Poppins_900Black,
	Poppins_900Black_Italic,
	useFonts
} from '@expo-google-fonts/poppins';
import {Image, KeyboardAvoidingView, Platform, View} from 'react-native';
import {ThemeProvider} from '@/context/ThemeContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {configureStore, persistor} from '@/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@/hooks/useTheme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GluestackUIProvider} from '@gluestack-ui/themed';
import {config} from '@gluestack-ui/config';
import ExpoUpdateLoader from '@/components/ExpoUpdateLoader/ExpoUpdateLoader';
import ExpoUpdateChecker from '@/components/ExpoUpdateChecker/ExpoUpdateChecker';

export default function Layout() {
	const { theme } = useTheme();
	const pathname = usePathname();
	const [fontsLoaded] = useFonts({
		Poppins_100Thin,
		Poppins_100Thin_Italic,
		Poppins_200ExtraLight,
		Poppins_200ExtraLight_Italic,
		Poppins_300Light,
		Poppins_300Light_Italic,
		Poppins_400Regular,
		Poppins_400Regular_Italic,
		Poppins_500Medium,
		Poppins_500Medium_Italic,
		Poppins_600SemiBold,
		Poppins_600SemiBold_Italic,
		Poppins_700Bold,
		Poppins_700Bold_Italic,
		Poppins_800ExtraBold,
		Poppins_800ExtraBold_Italic,
		Poppins_900Black,
		Poppins_900Black_Italic,
	});

	if (!fontsLoaded) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#ffffff',
				}}
			>
				<Image source={require('@/assets/images/company.png')} style={{ width: 250, height: 250 }} resizeMode="contain" />
			</View>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ExpoUpdateLoader>
				<Provider store={configureStore}>
					<GluestackUIProvider config={config}>
						<PersistGate loading={null} persistor={persistor}>
							<RootSiblingParent>
								<ThemeProvider>
									<ExpoUpdateChecker>
										<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: theme.screen.iconBg }}>
											<SafeAreaView style={{ flex: 1, backgroundColor: theme.screen.iconBg }} edges={pathname?.includes('image-full-screen') ? ['bottom'] : ['top', 'bottom']}>
												<Slot />
											</SafeAreaView>
										</KeyboardAvoidingView>
									</ExpoUpdateChecker>
								</ThemeProvider>
							</RootSiblingParent>
						</PersistGate>
					</GluestackUIProvider>
				</Provider>
			</ExpoUpdateLoader>
		</GestureHandlerRootView>
	);
}
