import {Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {
	AntDesign,
	Entypo,
	EvilIcons,
	Feather,
	FontAwesome,
	FontAwesome5,
	FontAwesome6,
	Foundation,
	Ionicons,
	MaterialCommunityIcons,
	Octicons,
	SimpleLineIcons,
	Zocial
} from '@expo/vector-icons';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {useTheme} from '@/hooks/useTheme';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {useRouter} from 'expo-router';
import {SET_WIKIS} from '@/redux/Types/types';
import {performLogout} from '@/helper/logoutHelper';
import {useLanguage} from '@/hooks/useLanguage';
import * as Linking from 'expo-linking';
import useToast from '@/hooks/useToast';
import {DatabaseTypes} from 'repo-depkit-common';
import {IconProps} from '@expo/vector-icons/build/createIconSet';
import {myContrastColor} from '@/helper/ColorHelper';
import {TranslationKeys} from '@/locales/keys';
import {RootState} from '@/redux/reducer';
import {ServerInfoHelper} from '@/helper/ServerInfoHelper';

export const iconLibraries: Record<string, any> = {
	Ionicons,
	MaterialCommunityIcons,
	FontAwesome5,
	FontAwesome6,
	FontAwesome,
	Octicons,
	AntDesign,
	Feather,
	Entypo,
	EvilIcons,
	Foundation,
	SimpleLineIcons,
	Zocial,
};

interface MenuItemProps {
	label: string;
	iconName: string;
	iconLibName: React.ComponentType<IconProps<any>>;
	activeKey: string;
	route?: string;
	action?: () => void;
	position: number;
}

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation, state }) => {
	const { translate } = useLanguage();
	const toast = useToast();
	const { theme } = useTheme();
	const dispatch = useDispatch();
	const router = useRouter();
	const activeIndex = state.index;

	const { serverInfo, primaryColor: projectColor, language, appSettings, wikis, selectedTheme: mode } = useSelector((state: RootState) => state.settings);

	const balance_area_color = appSettings?.balance_area_color ? appSettings?.balance_area_color : projectColor;
	const course_timetable_area_color = appSettings?.course_timetable_area_color ? appSettings?.course_timetable_area_color : projectColor;
	const campus_area_color = appSettings?.campus_area_color ? appSettings?.campus_area_color : projectColor;
	const foods_area_color = appSettings?.foods_area_color ? appSettings?.foods_area_color : projectColor;
	const housing_area_color = appSettings?.housing_area_color ? appSettings?.housing_area_color : projectColor;
	const news_area_color = appSettings?.news_area_color ? appSettings?.news_area_color : projectColor;

	const getContrastColor = (routeName: string) => {
		let backgroundColor = projectColor;

		switch (routeName) {
			case 'account-balance/index':
				backgroundColor = balance_area_color;
				break;
			case 'course-timetable/index':
				backgroundColor = course_timetable_area_color;
				break;
			case 'campus':
				backgroundColor = campus_area_color;
				break;
			case 'foodoffers':
				backgroundColor = foods_area_color;
				break;
			case 'housing':
				backgroundColor = housing_area_color;
				break;
			case 'news/index':
				backgroundColor = news_area_color;
				break;
			default:
				backgroundColor = projectColor;
		}

		return myContrastColor(backgroundColor, theme, mode === 'dark');
	};

	const isActive = (routeName: string) => {
		const activeRoute = state.routes[activeIndex].name;
		return activeRoute === routeName;
	};

	const getMenuItemStyle = (routeName: string) => {
		let activeBackgroundColor = 'transparent';

		if (isActive(routeName)) {
			switch (routeName) {
				case 'account-balance/index':
					activeBackgroundColor = balance_area_color;
					break;
				case 'course-timetable/index':
					activeBackgroundColor = course_timetable_area_color;
					break;
				case 'campus':
					activeBackgroundColor = campus_area_color;
					break;
				case 'foodoffers':
					activeBackgroundColor = foods_area_color;
					break;
				case 'housing':
					activeBackgroundColor = housing_area_color;
					break;
				case 'news/index':
					activeBackgroundColor = news_area_color;
					break;
				default:
					activeBackgroundColor = projectColor;
					break;
			}
		}

		return {
			...styles.menuItem,
			backgroundColor: activeBackgroundColor,
		};
	};

	const getMenuLabelStyle = (routeName: string) => ({
		...styles.menuLabel,
		color: isActive(routeName) ? getContrastColor(routeName) : theme.inactiveText,
	});

	const handleLogout = async () => {
		await performLogout(dispatch, router);
	};

	const openInBrowser = async (url: string) => {
		try {
			if (Platform.OS === 'web') {
				window.open(url, '_blank');
			} else {
				const supported = await Linking.canOpenURL(url);

				if (supported) {
					await Linking.openURL(url);
				} else {
					toast(`Cannot open URL: ${url}`, 'error');
				}
			}
		} catch (error) {
			console.error('An error occurred:', error);
		}
	};

	const generateMenuItems = (): MenuItemProps[] => {
		let menuItems: MenuItemProps[] = [];

		menuItems.push({
			label: translate(TranslationKeys.home),
			iconName: 'home',
			iconLibName: Ionicons,
			activeKey: 'home',
			route: 'index',
			position: 1,
		});

		// Sort menu items by position (smallest first)
		menuItems.sort((a, b) => a.position - b.position);

		return menuItems;
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.screen.iconBg }}>
			<ScrollView style={{ ...styles.container, backgroundColor: theme.drawerBg }} contentContainerStyle={styles.contentContainer}>
				<View style={styles.content}>
					<TouchableOpacity style={styles.header} onPress={() => navigation.navigate('foodoffers')}>
						<View style={styles.logoContainer}>
							<Image
								source={{

								}}
								style={styles.logo}
							/>
						</View>
						<Text style={{ ...styles.heading, color: theme.drawerHeading }}>{ServerInfoHelper.getServerName(serverInfo)}</Text>
					</TouchableOpacity>
					<View style={styles.menuContainer}>
						{generateMenuItems().map((item, index) => (
							<TouchableOpacity key={index} style={getMenuItemStyle(item.activeKey)} onPress={() => (item.route ? navigation.navigate(item.route) : item.action?.())}>
								<item.iconLibName name={item.iconName} size={24} color={isActive(item.activeKey) ? getContrastColor(item.activeKey) : theme.inactiveIcon} />
								<Text style={getMenuLabelStyle(item.activeKey)}>{item.label}</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default CustomDrawerContent;
