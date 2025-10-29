import {ActivityIndicator, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import useSelectedCanteen from '@/hooks/useSelectedCanteen';
import styles from './styles';
import {useTheme} from '@/hooks/useTheme';
import {SET_BUILDINGS, SET_CANTEENS} from '@/redux/Types/types';
import {useFocusEffect, useNavigation, useRouter} from 'expo-router';
import {DatabaseTypes} from 'repo-depkit-common';
import {Ionicons} from '@expo/vector-icons';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootState} from '@/redux/reducer';
import {TranslationKeys} from '@/locales/keys';
import {useLanguage} from '@/hooks/useLanguage';

const Home = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const drawerNavigation = useNavigation<DrawerNavigationProp<Record<string, object | undefined>>>();
	const { theme } = useTheme();
	const { translate } = useLanguage();

	return (
		<View
			style={{
				...styles.emptyContainer,
				backgroundColor: theme.screen.background,
			}}
		>
			<Text style={{ color: theme.screen.text }}>{translate(TranslationKeys.no_canteens_found)}</Text>
			<TouchableOpacity
				style={{
					...styles.continueButton,
					backgroundColor: theme.screen.iconBg,
				}}
				onPress={() => drawerNavigation.toggleDrawer()}
			>
				<Ionicons name="menu" size={24} color={theme.screen.icon} />
				<Text style={{ ...styles.continueLabel, color: theme.screen.text }}>{translate(TranslationKeys.open_drawer)}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Home;
