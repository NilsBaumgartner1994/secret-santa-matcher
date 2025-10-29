import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {Dimensions, SafeAreaView, ScrollView} from 'react-native';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {isWeb} from '@/constants/Constants';
import {useSelector} from 'react-redux';
import {TranslationKeys} from '@/locales/keys';
import useSetPageTitle from '@/hooks/useSetPageTitle';
import {RootState} from '@/redux/reducer';

export default function FoodDetailsScreen() {
	useSetPageTitle(TranslationKeys.food_details);

	const { id, foodId } = useLocalSearchParams();


	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
	const { theme } = useTheme();const { primaryColor, language: languageCode, appSettings, serverInfo, selectedTheme: mode } = useSelector((state: RootState) => state.settings);
	const foods_area_color = appSettings?.foods_area_color ? appSettings?.foods_area_color : primaryColor;

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(Dimensions.get('window').width);
		};

		const subscription = Dimensions.addEventListener('change', handleResize);

		return () => subscription?.remove();
	}, []);

	const themeStyles = {
		backgroundColor: foods_area_color,
		borderColor: foods_area_color,
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: theme.screen.background,
			}}
		>
			<ScrollView
				style={{
					backgroundColor: theme.screen.background,
					padding: isWeb ? 20 : 10,
				}}
				contentContainerStyle={{
					...styles.contentContainer,
					width: '100%',
					backgroundColor: theme.screen.background,
				}}
			>
			</ScrollView>
		</SafeAreaView>
	);
}
