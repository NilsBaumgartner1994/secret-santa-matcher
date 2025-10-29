import React from 'react';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer';

const Index = () => {
	return <Redirect href="/(app)" />;
};

export default Index;
