import TypedObject from "../util/TypedObject";

function matchesRegex(regex: string | RegExp): (code?: string) => boolean {
	return code => {
		if (code === undefined) {
			return false;
		}
		const match = code.match(regex);
		if (match) {
			return match.length > 0;
		} else {
			return false;
		}
	};
}

function hasMinLength(length: number): (code?: string) => boolean {
	return code => {
		if (code) {
			return code.length >= length;
		} else {
			return false;
		}
	};
}

const isNumber = matchesRegex("^[0-9]*$");

export enum PasswordValidationErrors {
	EMPTY = "PASSWORD_EMPTY",
	TOO_SHORT = "PASSWORD_TOO_SHORT",
	MISSING_UPPERCASE = "PASSWORD_MISSING_UPPERCASE",
	MISSING_LOWERCASE = "PASSWORD_MISSING_LOWERCASE",
	MISSING_NUMBER = "PASSWORD_MISSING_NUMBER",
	MISSING_SPECIAL = "PASSWORD_MISSING_SPECIAL"
}

export const Validations = {
	isValidationCode: matchesRegex("^[0-9]{6}$"),

	isName: hasMinLength(1),

	isPassword(code?: string): boolean {
		return Validations.validatePassword(code).length === 0;
	},

	isDocumentNumber: isNumber,

	isPhoneNumber: isNumber,

	isNationality: hasMinLength(1),

	isEmail: matchesRegex(
		"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
	),

	validatePassword: (password?: string): PasswordValidationErrors[] => {
		const checks = {
			[PasswordValidationErrors.EMPTY]: hasMinLength(1),
			[PasswordValidationErrors.TOO_SHORT]: hasMinLength(8),
			[PasswordValidationErrors.MISSING_UPPERCASE]: matchesRegex("[A-Z]"),
			[PasswordValidationErrors.MISSING_LOWERCASE]: matchesRegex("[a-z]"),
			[PasswordValidationErrors.MISSING_NUMBER]: matchesRegex("[0-9]"),
			[PasswordValidationErrors.MISSING_SPECIAL]: matchesRegex("[^A-Za-z0-9]")
		};
		return TypedObject.keys(checks).filter(c => !checks[c](password));
	}
};
