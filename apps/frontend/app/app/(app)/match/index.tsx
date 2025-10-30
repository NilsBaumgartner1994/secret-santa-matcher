import {Dimensions, RefreshControl, SafeAreaView, ScrollView, TouchableOpacity, View, Text} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {DrawerContentComponentProps, DrawerNavigationProp} from '@react-navigation/drawer';
import {isWeb} from '@/constants/Constants';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import {useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {RootDrawerParamList} from './types';
import {useLanguage} from '@/hooks/useLanguage';
import {Tooltip, TooltipContent, TooltipText} from '@gluestack-ui/themed';
import {TranslationKeys} from '@/locales/keys';
import {RootState} from '@/redux/reducer';
import { Buffer } from 'buffer';


const Index: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
        const { theme } = useTheme();
        const { translate } = useLanguage();
        const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
        const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
        const { drawerPosition } = useSelector((state: RootState) => ({ drawerPosition: state.settings.drawerPosition }));
        const [refreshing, setRefreshing] = useState(false);

        const params = useLocalSearchParams<{ name?: string | string[]; presentFor?: string | string[] }>();
        const [recipientName, setRecipientName] = useState<string | null>(null);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
                if (typeof window !== 'undefined') {
                        // @ts-ignore
                        window.Buffer = window.Buffer || Buffer;
                }
                if (typeof global !== 'undefined' && !(global as any).Buffer) {
                        (global as any).Buffer = Buffer;
                }
        }, []);

        useEffect(() => {
                const presentParamRaw = Array.isArray(params.presentFor) ? params.presentFor[0] : params.presentFor;
                if (!presentParamRaw) {
                        setError('Kein Geschenkpartner gefunden.');
                        setRecipientName(null);
                        return;
                }

                try {
                        const decoded = Buffer.from(decodeURIComponent(presentParamRaw as string), 'base64').toString('utf8');
                        const payload = JSON.parse(decoded);
                        if (payload?.recipient) {
                                setRecipientName(payload.recipient);
                                setError(null);
                        } else {
                                setRecipientName(null);
                                setError('Link konnte nicht gelesen werden.');
                        }
                } catch (_e) {
                        setRecipientName(null);
                        setError('Link konnte nicht gelesen werden.');
                }
        }, [params.presentFor]);

        const giverName = useMemo(() => {
                const raw = Array.isArray(params.name) ? params.name[0] : params.name;
                if (!raw) return 'Teilnehmende Person';
                return String(raw);
        }, [params.name]);

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
                                                        paddingHorizontal: isWeb ? (screenWidth < 500 ? 16 : 36) : 16,
                                                        paddingVertical: 32,
                                                }}
                                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                        >
                                                <View style={{ gap: 16 }}>
                                                        <Text style={{ color: theme.screen.text, fontSize: 20, fontWeight: '700' }}>
                                                                Hallo {giverName}!
                                                        </Text>
                                                        {recipientName && (
                                                                <>
                                                                        <Text style={{ color: theme.screen.text, fontSize: 16 }}>
                                                                                Du darfst dieses Jahr {recipientName} beschenken.
                                                                        </Text>
                                                                        <Text style={{ color: theme.screen.text + 'CC', fontSize: 14 }}>
                                                                                Bewahre diesen Link gut auf und verrate ihn niemandem – so bleibt die Überraschung erhalten!
                                                                        </Text>
                                                                </>
                                                        )}
                                                        {!recipientName && error && (
                                                                <Text style={{ color: theme.screen.text, fontSize: 16 }}>
                                                                        {error}
                                                                </Text>
                                                        )}
                                                </View>
                                        </ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
};

export default Index;
