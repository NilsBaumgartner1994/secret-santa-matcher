import React from 'react';
import {Drawer} from 'expo-router/drawer';
import CustomDrawerContent from '@/components/Drawer/CustomDrawerContent';
import {useTheme} from '@/hooks/useTheme';
import {useSelector} from 'react-redux';
import {useGlobalSearchParams} from 'expo-router';
import {AppScreens} from 'repo-depkit-common';
import CustomStackHeader from '@/components/CustomStackHeader/CustomStackHeader';
import {useLanguage} from '@/hooks/useLanguage';
import DeviceMock from '@/components/DeviceMock/DeviceMock';
import {isWeb} from '@/constants/Constants';
import {TranslationKeys} from '@/locales/keys';
// TODO: replace HashHelper with expo-crypto once packages can be installed
import {RootState} from '@/redux/reducer';

export default function Layout() {
	const { theme } = useTheme();
	const { translate } = useLanguage();
	const { deviceMock } = useGlobalSearchParams();
	const { drawerPosition } = useSelector((state: RootState) => state.settings);

	return (
		<>
			{deviceMock && deviceMock === 'iphone' && isWeb && <DeviceMock />}
			<Drawer
				screenOptions={{
					headerStyle: { backgroundColor: theme.header.background },
					headerTintColor: theme.header.text,
					drawerType: 'front',
					drawerPosition: (() => {
						const position = drawerPosition === 'system' ? 'left' : drawerPosition;
						return position === 'left' || position === 'right' ? position : 'left';
					})(),
				}}
				detachInactiveScreens={true}
				drawerContent={props => <CustomDrawerContent {...props} />}
				backBehavior="history"
			>
				<Drawer.Screen
					name="index"
					options={{
						title: translate(TranslationKeys.please_select_your_canteen),
						headerLeft: () => null,
					}}
				/>
				<Drawer.Screen
					name={AppScreens.FOOD_OFFERS}
					options={{
						title: 'Canteens',
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="forms/index"
					options={{
						header: () => <CustomStackHeader label={translate(TranslationKeys.select_a_form)} />,
					}}
				/>
				<Drawer.Screen
					name="form-submissions/index"
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="form-submission/index"
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="image-full-screen"
					options={{
						headerShown: false,
					}}
				/>
			</Drawer>
		</>
	);
}
