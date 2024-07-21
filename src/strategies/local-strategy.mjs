import passport from "passport";
import { Strategy } from "passport-local";
import { users } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
	console.log("serializeUser", user);
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	console.log("deserializeUser id", id);
	try {
		const findUser = users.find((user) => user.id === id);
		if (!findUser) throw new Error("User not found");
		done(null, findUser);
	} catch (err) {
		done(err, null);
	}
});

passport.use(
	new Strategy((username, password, done) => {
		try {
			const findUser = users.find(
				(user) => user.username === username && user.password === password
			);
			if (!findUser) throw new Error("Invalid username or password");
			done(null, findUser);
		} catch (err) {
			done(err, null);
		}
	})
);

export default passport;
