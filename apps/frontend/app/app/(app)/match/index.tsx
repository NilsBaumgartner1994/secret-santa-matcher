import {Dimensions, Platform, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {DrawerContentComponentProps, DrawerNavigationProp} from '@react-navigation/drawer';
import {isWeb} from '@/constants/Constants';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useDispatch, useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {RootDrawerParamList} from './types';
import {useLanguage} from '@/hooks/useLanguage';
import {Tooltip, TooltipContent, TooltipText} from '@gluestack-ui/themed';
import * as Notifications from 'expo-notifications';
import {TranslationKeys} from '@/locales/keys';
import {RootState} from '@/redux/reducer';


const Index: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
	const dispatch = useDispatch();
	const { theme } = useTheme();
	const { translate } = useLanguage();
	const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
	const { sortBy, language: languageCode, drawerPosition, appSettings, primaryColor, selectedTheme: mode } = useSelector((state: RootState) => state.settings);
	const [refreshing, setRefreshing] = useState(false);

	const { id, foodId } = useLocalSearchParams();

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(Dimensions.get('window').width);
		};

		const subscription = Dimensions.addEventListener('change', handleResize);

		return () => subscription?.remove();
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setRefreshing(false);
	}, []);

	return (
		<>
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.screen.iconBg }}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							...styles.header,
							backgroundColor: theme.header.background,
							paddingHorizontal: 10,
						}}
					>
						<View
							style={[
								styles.row,
								{
									flexDirection: drawerPosition === 'right' ? 'row-reverse' : 'row',
								},
							]}
						>
							<View
								style={[
									styles.col1,
									{
										flexDirection: drawerPosition === 'right' ? 'row-reverse' : 'row',
									},
								]}
							>
								{/* Menu */}
								<Tooltip
									placement="top"
									trigger={triggerProps => (
										<TouchableOpacity
											{...triggerProps}
											onPress={() => drawerNavigation.toggleDrawer()}
											style={{
												padding: isWeb ? (screenWidth < 500 ? 5 : 10) : 5,
											}}
										>
											<Ionicons name="menu" size={24} color={theme.header.text} />
										</TouchableOpacity>
									)}
								>
									<TooltipContent bg={theme.tooltip.background} py="$1" px="$2">
										<TooltipText fontSize="$sm" color={theme.tooltip.text}>
											{`${translate(TranslationKeys.open_drawer)}`}
										</TooltipText>
									</TooltipContent>
								</Tooltip>


								{/* Canteen Heading */}
								<View>
									<Text style={{ ...styles.heading, color: theme.header.text }}>{'Dein Match'}</Text>
								</View>

							</View>
							<View
								style={{
									...styles.col2,
									gap: isWeb ? (screenWidth < 500 ? 6 : 10) : 5,
									flexDirection: drawerPosition === 'right' ? 'row-reverse' : 'row',
								}}
							>
							</View>
						</View>
					</View>
					<ScrollView
						style={{
							...styles.container,
							backgroundColor: theme.screen.background,
						}}
						contentContainerStyle={{
							...styles.contentContainer,
							paddingHorizontal: isWeb ? (screenWidth < 500 ? 5 : 20) : 5,
						}}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					>

					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
};

export default Index;
