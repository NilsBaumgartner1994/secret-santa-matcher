import {
        Dimensions,
        Platform,
        RefreshControl,
        SafeAreaView,
        ScrollView,
        Text,
        TouchableOpacity,
        View,
        TextInput,
        Alert,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {DrawerContentComponentProps, DrawerNavigationProp} from '@react-navigation/drawer';
import {isWeb} from '@/constants/Constants';
import {useNavigation} from 'expo-router';
import {useSelector} from 'react-redux';
import {Ionicons} from '@expo/vector-icons';
import {useLanguage} from '@/hooks/useLanguage';
import {Tooltip, TooltipContent, TooltipText} from '@gluestack-ui/themed';
import * as Notifications from 'expo-notifications';
import {TranslationKeys} from '@/locales/keys';
import {RootState} from '@/redux/reducer';
import {RootDrawerParamList} from "@/app/(app)/match/types";
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { myContrastColor } from '@/helper/ColorHelper';
import { Buffer } from 'buffer';
import { EnvHelper } from '@/constants/EnvHelper';


const Index: React.FC<DrawerContentComponentProps> = (_props) => {
        const { theme } = useTheme();
        const { translate } = useLanguage();
        const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
        const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
        const { drawerPosition, primaryColor, selectedTheme: mode } = useSelector((state: RootState) => ({
                drawerPosition: state.settings.drawerPosition,
                primaryColor: state.settings.primaryColor,
                selectedTheme: state.settings.selectedTheme,
        }));
        const foods_area_color = primaryColor;
        const [refreshing, setRefreshing] = useState(false);

        if (typeof window !== 'undefined') {
                // ensure Buffer polyfill for web builds
                // @ts-ignore
                window.Buffer = window.Buffer || Buffer;
        }
        if (typeof global !== 'undefined' && !(global as any).Buffer) {
                (global as any).Buffer = Buffer;
        }

        type Person = { id: string; name: string };
        type PairRow = { a: Person | null; b: Person | null };
        type PresentShare = {
                person: Person;
                recipientName: string;
                link: string;
                code: string;
        };

        const idCounter = useRef(1);
        const makePerson = (name = ''): Person => ({ id: `${Date.now()}-${idCounter.current++}`, name });

        const [setupState, setSetupState] = useState<{ pairs: PairRow[] }>(() => ({
                pairs: [ { a: makePerson(''), b: makePerson('') } ],
        }));
        const [resultState, setResultState] = useState<{
                assignments: Record<string, string>;
                persons: Person[];
                pairsSnapshot: PairRow[];
                shareLinks: PresentShare[];
        } | null>(null);

	const requestPermissions = async () => {
		const { status } = await Notifications.getPermissionsAsync();
		if (status !== 'granted') {
			await Notifications.requestPermissionsAsync();
		}
	};

	useEffect(() => {
		if (Platform.OS !== 'web') {
			requestPermissions();
		}
	}, []);

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

        // Helper: update a name in pairs
        const updateName = (rowIndex: number, side: 'a' | 'b', newName: string) => {
                setSetupState(prev => {
                        const nextPairs = prev.pairs.map(r => ({ ...r }));
                        const row = nextPairs[rowIndex] || { a: null, b: null };
                        if (side === 'a') {
                                row.a = row.a ? { ...row.a, name: newName } : makePerson(newName);
                        } else {
                                row.b = row.b ? { ...row.b, name: newName } : makePerson(newName);
                        }
                        nextPairs[rowIndex] = row;
                        return { pairs: nextPairs };
                });
        };

        const addPair = () => {
                setSetupState(prev => ({
                        pairs: [...prev.pairs, { a: makePerson(''), b: makePerson('') }],
                }));
        };

        const collectPersons = (): Person[] => {
                const persons: Person[] = [];
                setupState.pairs.forEach(r => {
                        if (r.a && r.a.name.trim() !== '') persons.push(r.a);
                        if (r.b && r.b.name.trim() !== '') persons.push(r.b);
                });
                return persons;
        };

	// Matching algorithm: ensure no self and no partner assignment
	const findAssignments = (persons: Person[], pairs: PairRow[]): Record<string,string> | null => {
		if (persons.length < 2) return null;

		// build partner map
		const partnerOf: Record<string, string | null> = {};
		pairs.forEach(p => {
			if (p.a && p.b) {
				partnerOf[p.a.id] = p.b.id;
				partnerOf[p.b.id] = p.a.id;
			} else if (p.a && !p.b) {
				partnerOf[p.a.id] = null;
			} else if (p.b && !p.a) {
				partnerOf[p.b.id] = null;
			}
		});

		// quick feasibility check: for any person, allowed recipients count
		for (const p of persons) {
			const forbidden = 1 + (partnerOf[p.id] ? 1 : 0);
			if (persons.length - forbidden < 1) {
				return null; // impossible
			}
		}

		// recursive backtracking with randomization
		const ids = persons.map(p => p.id);
		const tries = 500;

		const shuffle = <T,>(arr: T[]) => {
			for (let i = arr.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[ arr[i], arr[j] ] = [ arr[j], arr[i] ];
			}
			return arr;
		};

		for (let t = 0; t < tries; t++) {
			const order = shuffle(persons.slice()); // order to assign
			const available = new Set(ids);
			const result: Record<string,string> = {};

			const assignRec = (index: number): boolean => {
				if (index >= order.length) return true;
				const person = order[index];
				const forbidden = new Set<string>([person.id]);
				if (partnerOf[person.id]) forbidden.add(partnerOf[person.id] as string);
				// options: available ids not in forbidden
				const opts = shuffle(Array.from(available).filter(id => !forbidden.has(id)));
				for (const opt of opts) {
					// choose
					result[person.id] = opt;
					available.delete(opt);
					if (assignRec(index + 1)) return true;
					// backtrack
					available.add(opt);
					delete result[person.id];
				}
				return false;
			};

			if (assignRec(0)) {
				return result;
			}
		}

		return null;
	};

        const getRecipientNameFromPairs = (personId: string | undefined | null): string => {
                if (!personId) return '';
                for (const r of setupState.pairs) {
                        if (r.a && r.a.id === personId) return r.a.name;
                        if (r.b && r.b.id === personId) return r.b.name;
                }
                return '';
        };

        const buildShareLinks = useCallback((assignments: Record<string, string>, persons: Person[]): PresentShare[] => {
                const rawBase = EnvHelper.getBaseUrl?.() ?? '';
                const sanitizedBase = rawBase.replace(/\/+$/, '').replace(/^\/+/, '');
                const basePrefix = sanitizedBase ? `/${sanitizedBase}` : '';
                const matchPath = `${basePrefix}/match`;
                const linkPath = matchPath.startsWith('/') ? matchPath : `/${matchPath}`;

                return persons.map(person => {
                        const recipientId = assignments[person.id];
                        const recipientName = getRecipientNameFromPairs(recipientId);
                        const payload = JSON.stringify({ giverId: person.id, recipient: recipientName });
                        const code = encodeURIComponent(Buffer.from(payload, 'utf8').toString('base64'));
                        const link = `${Linking.createURL(linkPath)}?name=${encodeURIComponent(person.name)}&presentFor=${code}`;

                        return {
                                person,
                                recipientName,
                                link,
                                code,
                        };
                });
        }, [setupState.pairs]);

        const onDraw = () => {
                const persons = collectPersons();
                if (persons.length < 2) {
                        Alert.alert('Nicht genug Personen', 'Es werden mindestens 2 Personen benötigt.');
                        return;
                }

                const result = findAssignments(persons, setupState.pairs);
                if (!result) {
                        Alert.alert('Nicht möglich', 'Mit den aktuellen Paaren/Anzahlen lässt sich keine gültige Zuweisung erzeugen. Bitte prüfe die Eingaben (z. B. nur zwei Partner ohne andere Teilnehmende).');
                        return;
                }

                const shareLinks = buildShareLinks(result, persons);
                const pairsSnapshot = setupState.pairs.map(pair => ({
                        a: pair.a ? { ...pair.a } : null,
                        b: pair.b ? { ...pair.b } : null,
                }));

                setResultState({
                        assignments: result,
                        persons,
                        pairsSnapshot,
                        shareLinks,
                });
                Alert.alert('Erfolg', 'Wichtel Partner wurden ausgelost.');
        };

        const resetDrawing = () => {
                setResultState(null);
        };

        const onCopyLink = async (link: string) => {
                try {
                        await Clipboard.setStringAsync(link);
                        Alert.alert('Kopiert', 'Link wurde in die Zwischenablage kopiert.');
                } catch (e) {
                        Alert.alert('Fehler', 'Link konnte nicht kopiert werden.');
                }
        };

        const buttonBackground = useMemo(() => foods_area_color || theme.header.text, [foods_area_color, theme.header.text]);

        const buttonTextColor = useMemo(() => myContrastColor(buttonBackground, theme, mode === 'dark'), [buttonBackground, mode, theme]);

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
									<Text style={{ ...styles.heading, color: theme.header.text }}>{'Setup'}</Text>
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
                                                        paddingHorizontal: isWeb ? (screenWidth < 500 ? 12 : 32) : 12,
                                                        paddingBottom: 48,
                                                }}
                                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                        >
                                                {!resultState && (
                                                        <>
                                                                {setupState.pairs.map((row, idx) => (
                                                                        <View key={`row-${idx}`} style={{ gap: 12, marginBottom: 18 }}>
                                                                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                                                                        <TextInput
                                                                                                placeholder={`Partner 1`}
                                                                                                value={row.a?.name ?? ''}
                                                                                                onChangeText={(t) => updateName(idx, 'a', t)}
                                                                                                style={{
                                                                                                        flex: 1,
                                                                                                        minWidth: 0,
                                                                                                        width: '100%',
                                                                                                        paddingVertical: 16,
                                                                                                        paddingHorizontal: 18,
                                                                                                        backgroundColor: theme.screen.iconBg,
                                                                                                        borderRadius: 12,
                                                                                                        borderWidth: 1,
                                                                                                        borderColor: theme.screen.text + '20',
                                                                                                        fontSize: 16,
                                                                                                        color: theme.screen.text,
                                                                                                }}
                                                                                        />
                                                                                        <TextInput
                                                                                                placeholder={`Partner 2`}
                                                                                                value={row.b?.name ?? ''}
                                                                                                onChangeText={(t) => updateName(idx, 'b', t)}
                                                                                                style={{
                                                                                                        flex: 1,
                                                                                                        minWidth: 0,
                                                                                                        width: '100%',
                                                                                                        paddingVertical: 16,
                                                                                                        paddingHorizontal: 18,
                                                                                                        backgroundColor: theme.screen.iconBg,
                                                                                                        borderRadius: 12,
                                                                                                        borderWidth: 1,
                                                                                                        borderColor: theme.screen.text + '20',
                                                                                                        fontSize: 16,
                                                                                                        color: theme.screen.text,
                                                                                                }}
                                                                                        />
                                                                                </View>
                                                                                <View style={{ height: 1, backgroundColor: theme.screen.text + '12' }} />
                                                                        </View>
                                                                ))}

                                                                <TouchableOpacity
                                                                        onPress={addPair}
                                                                        style={{
                                                                                flexDirection: 'row',
                                                                                alignItems: 'center',
                                                                                gap: 8,
                                                                                alignSelf: 'flex-start',
                                                                                paddingVertical: 10,
                                                                                paddingHorizontal: 14,
                                                                                borderRadius: 999,
                                                                                backgroundColor: theme.screen.iconBg,
                                                                        }}
                                                                >
                                                                        <Ionicons name="add" size={18} color={theme.screen.text} />
                                                                        <Text style={{ color: theme.screen.text, fontWeight: '600' }}>Weitere Personen hinzufügen</Text>
                                                                </TouchableOpacity>

                                                                <View style={{ marginTop: 28 }}>
                                                                        <TouchableOpacity
                                                                                onPress={onDraw}
                                                                                style={{
                                                                                        paddingVertical: 16,
                                                                                        borderRadius: 16,
                                                                                        backgroundColor: buttonBackground,
                                                                                        alignItems: 'center',
                                                                                        shadowColor: '#000',
                                                                                        shadowOffset: { width: 0, height: 8 },
                                                                                        shadowOpacity: 0.12,
                                                                                        shadowRadius: 16,
                                                                                }}
                                                                        >
                                                                                <Text style={{ color: buttonTextColor, fontWeight: '700', fontSize: 16 }}>Wichtel Paare generieren</Text>
                                                                        </TouchableOpacity>
                                                                </View>
                                                        </>
                                                )}

                                                {resultState && (
                                                        <View style={{ gap: 18 }}>
                                                                <View>
                                                                        <Text style={{ color: theme.screen.text, fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
                                                                                Eure Matches
                                                                        </Text>
                                                                        {resultState.shareLinks.map(entry => (
                                                                                <View
                                                                                        key={entry.person.id}
                                                                                        style={{
                                                                                                borderRadius: 16,
                                                                                                padding: 18,
                                                                                                backgroundColor: theme.screen.iconBg,
                                                                                                gap: 12,
                                                                                        }}
                                                                                >
                                                                                        <View>
                                                                                                <Text style={{ color: theme.screen.text, fontSize: 16, fontWeight: '600' }}>
                                                                                                        {entry.person.name}
                                                                                                </Text>
                                                                                                <Text style={{ color: theme.screen.text + 'CC', marginTop: 4 }}>
                                                                                                        beschenkt {entry.recipientName}
                                                                                                </Text>
                                                                                        </View>
                                                                                        <TouchableOpacity
                                                                                                onPress={() => onCopyLink(entry.link)}
                                                                                                style={{
                                                                                                        flexDirection: 'row',
                                                                                                        alignItems: 'center',
                                                                                                        justifyContent: 'space-between',
                                                                                                        paddingVertical: 12,
                                                                                                        paddingHorizontal: 16,
                                                                                                        borderRadius: 12,
                                                                                                        backgroundColor: theme.screen.background,
                                                                                                }}
                                                                                        >
                                                                                                <Text style={{ flex: 1, color: theme.screen.text, fontSize: 14 }} numberOfLines={2}>
                                                                                                        {entry.link}
                                                                                                </Text>
                                                                                                <Ionicons name="copy" size={18} color={theme.screen.text} />
                                                                                        </TouchableOpacity>
                                                                                </View>
                                                                        ))}
                                                                </View>

                                                                <TouchableOpacity
                                                                        onPress={resetDrawing}
                                                                        style={{
                                                                                alignSelf: 'flex-start',
                                                                                paddingVertical: 10,
                                                                                paddingHorizontal: 16,
                                                                                borderRadius: 12,
                                                                                borderWidth: 1,
                                                                                borderColor: theme.screen.text + '33',
                                                                        }}
                                                                >
                                                                        <Text style={{ color: theme.screen.text, fontWeight: '600' }}>Neue Runde starten</Text>
                                                                </TouchableOpacity>

                                                                <View style={{ marginTop: 16, gap: 8 }}>
                                                                        <Text style={{ color: theme.screen.text + 'CC', fontSize: 14 }}>
                                                                                Bei dem Wichteln dieses Jahr kann hier eingesehen werden, wen man beschenken soll:
                                                                        </Text>
                                                                        {resultState.shareLinks.map(entry => (
                                                                                <Text key={`share-${entry.person.id}`} style={{ color: theme.screen.text, fontSize: 14 }}>
                                                                                        - {entry.person.name}, deine zu beschenkende Person: {entry.link}
                                                                                </Text>
                                                                        ))}
                                                                </View>
                                                        </View>
                                                )}

                                        </ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
};

export default Index;
