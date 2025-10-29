import {NumberHelper, StringHelper} from 'repo-depkit-common';

export const excerpt = (text: string, length: number) => {
	if (!text) {
		return '';
	}
	return text.length > length ? text.substring(0, length) + '...' : text;
};

export const numToOneDecimal = (num: number) => {
	return Math.round(num * 10) / 10;
};

export function formatFoodInformationValue(value: string | number | null | undefined, unit: string | null | undefined): string | null {
	// If the value is not found, return null early
	if (!value) return null;

	// If value is a number, format it; otherwise, treat it as a string
	let valueWithUnit: string = '';

	if (typeof value === 'number') {
		// Assuming NumberHelper.formatNumber handles null/undefined unit gracefully
		valueWithUnit = NumberHelper.formatNumber(value, unit, false, ',', '.', 1);
	} else {
		// If value is not a number, convert it to string
		valueWithUnit = String(value);

		// Append the unit if it's provided
		if (unit) {
			valueWithUnit += StringHelper.NONBREAKING_HALF_SPACE + unit;
		}
	}

	return valueWithUnit;
}
