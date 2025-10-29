import {Dimensions, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {useNavigation, useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {Tooltip, TooltipContent, TooltipText} from "@gluestack-ui/themed";
import {isWeb} from "@/constants/Constants";
import {TranslationKeys} from "@/locales/keys";
import {useDispatch, useSelector} from "react-redux";
import {useLanguage} from "@/hooks/useLanguage";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import {RootDrawerParamList} from "@/app/(app)/match/types";
import {RootState} from "@/redux/reducer";

const Home = () => {
	const router = useRouter();
	const { theme } = useTheme();
	const { translate } = useLanguage();
	const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
	const { sortBy, language: languageCode, drawerPosition, appSettings, primaryColor, selectedTheme: mode } = useSelector((state: RootState) => state.settings);

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
					>
						<View
							style={{
								...styles.emptyContainer,
								backgroundColor: theme.screen.background,
								justifyContent: 'center',
								alignItems: 'center',
								paddingHorizontal: 24,
							}}
						>
							<Ionicons name={'gift' as any} size={96} color={theme.screen.icon} style={{ marginBottom: 20 }} />
							<Text style={{ color: theme.screen.text, fontSize: 32, fontWeight: '700', marginBottom: 8 }}>{"Wichtel Matcher"}</Text>
							<Text style={{ color: theme.screen.text, fontSize: 16, textAlign: 'center', marginBottom: 24 }}>{"Schnell und anonym zuteilen, wer wen beschenken darf."}</Text>

							<TouchableOpacity
								accessible={true}
								accessibilityLabel="Start Secret Santa setup"
								style={{
									...styles.continueButton,
									backgroundColor: theme.screen.iconBg,
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 20,
									paddingVertical: 12,
									borderRadius: 8,
								}}
								onPress={() => router.push('/setup')}
							>
								<Text style={{ ...styles.continueLabel, color: theme.screen.text, fontSize: 18, fontWeight: '600' }}>Start</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
};

export default Home;