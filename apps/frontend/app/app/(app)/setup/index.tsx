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
import React, {useCallback, useEffect, useState, useRef} from 'react';
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


const Index: React.FC<DrawerContentComponentProps> = (_props) => {
	const { theme } = useTheme();
	const { translate } = useLanguage();
	const drawerNavigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
	const { drawerPosition, primaryColor } = useSelector((state: RootState) => ({ drawerPosition: state.settings.drawerPosition, primaryColor: state.settings.primaryColor }));
	const foods_area_color = primaryColor;
	const [refreshing, setRefreshing] = useState(false);

	// Neuer State: Personen/Paare und Ergebnisse
	// rows: array of pairs: [{id1, name1, id2?, name2?}]
	type Person = { id: string; name: string };
	type PairRow = { a: Person | null; b: Person | null };

	const idCounter = useRef(1);
	const makePerson = (name = ''): Person => ({ id: `${Date.now()}-${idCounter.current++}`, name });

	const [rows, setRows] = useState<PairRow[]>(() => [ { a: makePerson(''), b: makePerson('') } ]);
	const [assignments, setAssignments] = useState<Record<string, string> | null>(null); // personId -> recipientId
	const [revealed, setRevealed] = useState<Record<string, boolean>>({});

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

	// Helper: update a name in rows
	const updateName = (rowIndex: number, side: 'a' | 'b', newName: string) => {
		setRows(prev => {
			const next = prev.map(r => ({ ...r }));
			const row = next[rowIndex] || { a: null, b: null };
			if (side === 'a') {
				row.a = row.a ? { ...row.a, name: newName } : makePerson(newName);
			} else {
				row.b = row.b ? { ...row.b, name: newName } : makePerson(newName);
			}
			next[rowIndex] = row;
			return next;
		});
	};

	const addPair = () => {
		setRows(prev => [...prev, { a: makePerson(''), b: makePerson('') }]);
	};

	const collectPersons = (): Person[] => {
		const persons: Person[] = [];
		rows.forEach(r => {
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

	const onDraw = () => {
		const persons = collectPersons();
		if (persons.length < 2) {
			Alert.alert('Nicht genug Personen', 'Es werden mindestens 2 Personen benötigt.');
			return;
		}

		const result = findAssignments(persons, rows);
		if (!result) {
			Alert.alert('Nicht möglich', 'Mit den aktuellen Paaren/Anzahlen lässt sich keine gültige Zuweisung erzeugen. Bitte prüfe die Eingaben (z. B. nur zwei Partner ohne andere Teilnehmende).');
			return;
		}

		setAssignments(result);
		// reset revelations
		setRevealed({});
		Alert.alert('Erfolg', 'Wichtel Partner wurden ausgelost und sind verdeckt.');
	};

	const toggleReveal = (personId: string) => {
		setRevealed(prev => ({ ...prev, [personId]: !prev[personId] }));
	};

	const getRecipientName = (personId: string) => {
		if (!assignments) return '';
		const recipientId = assignments[personId];
		if (!recipientId) return '';
		// find name
		for (const r of rows) {
			if (r.a && r.a.id === recipientId) return r.a.name;
			if (r.b && r.b.id === recipientId) return r.b.name;
		}
		return '';
	};

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
							paddingHorizontal: isWeb ? (screenWidth < 500 ? 5 : 20) : 5,
						}}
						refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
					>

						{/* Personenpaare als TextInputs */}
						{rows.map((row, idx) => (
							<View key={`row-${idx}`} style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
								<View style={{ flex: 1 }}>
									<TextInput
										placeholder={`Partner 1`}
										value={row.a?.name ?? ''}
										onChangeText={(t) => updateName(idx, 'a', t)}
										style={{
											padding: 10,
											backgroundColor: theme.screen.iconBg,
											borderRadius: 6,
										}}
									/>
								</View>
								<View style={{ flex: 1 }}>
									<TextInput
										placeholder={`Partner 2`}
										value={row.b?.name ?? ''}
										onChangeText={(t) => updateName(idx, 'b', t)}
										style={{
											padding: 10,
											backgroundColor: theme.screen.iconBg,
											borderRadius: 6,
										}}
									/>
								</View>
							</View>
						))}

						{/* + weitere Personen hinzufuegen */}
						<TouchableOpacity onPress={addPair} style={{ padding: 12, alignSelf: 'flex-start', marginBottom: 20 }}>
							<Text style={{ color: theme.screen.text, fontWeight: '600' }}>+ weitere Personen hinzufügen</Text>
						</TouchableOpacity>

						{/* Nach dem Losen: Liste der Personen mit verdeckter Zuteilung */}
						{assignments && (
							<View style={{ marginTop: 8, gap: 8 }}>
								{collectPersons().map(p => (
									<View key={p.id} style={{ padding: 12, backgroundColor: theme.screen.iconBg, borderRadius: 8, marginBottom: 8 }}>
										<Text style={{ color: theme.screen.text, fontWeight: '700' }}>{p.name}</Text>
										<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
											<Text style={{ color: theme.screen.text }}>{revealed[p.id] ? getRecipientName(p.id) : 'VERDECKT'}</Text>
											<TouchableOpacity onPress={() => toggleReveal(p.id)} style={{ padding: 6 }}>
												<Text style={{ color: theme.screen.text }}>{revealed[p.id] ? 'Verstecken' : 'Anzeigen'}</Text>
											</TouchableOpacity>
										</View>
									</View>
								))}
							</View>
						)}

						{/* Button zum Auslosen */}
						<View style={{ marginTop: 16, marginBottom: 40 }}>
							<TouchableOpacity
								onPress={onDraw}
								style={{
									padding: 14,
									borderRadius: 8,
									backgroundColor: foods_area_color || theme.header.text,
									alignItems: 'center',
								}}
							>
								<Text style={{ color: theme.screen.background, fontWeight: '700' }}>Wichtel Partner auslosen</Text>
							</TouchableOpacity>
						</View>

					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
};

export default Index;
