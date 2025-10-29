import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	mainContainer: {
		flex: 1,
	},

	sheetHeading: {
		fontSize: 26,
		fontFamily: 'Poppins_400Regular',
	},
	canteensContainer: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'stretch',
		flexWrap: 'wrap',
		rowGap: 10,
		marginTop: 20,
	},
	card: {
		borderRadius: 18,
		paddingBottom: 10,
	},
	imageContainer: {
		width: '100%',
		borderRadius: 18,
	},
	image: {
		width: '100%',
		height: '100%',
		borderTopRightRadius: 18,
		borderTopLeftRadius: 18,
		resizeMode: 'cover',
	},
	canteenName: {
		fontSize: 16,
		fontFamily: 'Poppins_400Regular',
		textAlign: 'center',
		marginTop: 5,
		paddingHorizontal: 5,
	},
	archiveContainer: {
		width: 35,
		height: 35,
		borderRadius: 50,
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 5,
		right: 5,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		gap: 10,
	},
	continueButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
	continueLabel: {
		fontSize: 16,
		fontFamily: 'Poppins_400Regular',
		marginLeft: 5,
	},
	// New styles used by the index/setup pages
	title: {
		fontSize: 28,
		fontFamily: 'Poppins_400Regular',
		textAlign: 'center',
		marginBottom: 6,
	},
	subtitle: {
		fontSize: 14,
		fontFamily: 'Poppins_400Regular',
		textAlign: 'center',
		marginBottom: 12,
	},
	secondaryButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 10,
		borderWidth: 1,
		marginTop: 8,
	},
	secondaryLabel: {
		fontSize: 14,
		fontFamily: 'Poppins_400Regular',
		marginLeft: 8,
	},
	headerContainer: {
		paddingTop: 10,
		paddingBottom: 8,
		alignItems: 'center',
	},
	foodOfferContainer: {
		flex: 1,
	},
	header: {
		width: '100%',
		paddingBottom: 10,
		paddingVertical: 10,
		gap: 10,
	},
	row: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	col1: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	col2: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	heading: {
		fontSize: 18,
		fontFamily: 'Poppins_400Regular',
	},
	container: {
		flex: 1,
	},
	contentContainer: {
		width: '100%',
		alignItems: 'center',
		paddingBottom: 20,
	},
	foodContainer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'stretch',
		flexWrap: 'wrap',
		marginTop: 20,
	},
	sheetBackground: {
		borderTopRightRadius: 30,
		borderTopLeftRadius: 30,
	},
	feebackContainer: {
		width: '100%',
		marginTop: 20,
	},
	foodLabels: {
		fontSize: 24,
		fontFamily: 'Poppins_700Bold',
	},
	elementContainer: {
		width: '100%',
		marginTop: 20,
	},
	noFoodContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	animationContainer: {
		width: 250,
		height: 250,
		marginBottom: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	noFoodOffer: {
		fontSize: 18,
		fontFamily: 'Poppins_400Regular',
	},
	jumpButton: {
		marginTop: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: 'center',
	},
	jumpButtonText: {
		fontSize: 16,
		fontFamily: 'Poppins_500Medium',
	},
});
