export const createUserValidationSchema = {
	name: {
		notEmpty: {
			errorMessage: "Name is required",
		},
		isString: {
			errorMessage: "Name must be a string",
		},
		isLength: {
			errorMessage: "Name must be at least 3 and at most 32 characters long",
			options: { min: 3, max: 32 },
		},
	},
	email: {
		notEmpty: {
			errorMessage: "Email is required",
		},
		isEmail: {
			errorMessage: "Email must be valid",
		},
	},
};
