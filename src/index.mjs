import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "passport";
import routes from "./routes/index.mjs";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose.connect("mongodb://localhost/testdb", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
	console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(cookieParser("secret"));
app.use(
	session({
		secret: "secret",
		saveUninitialized: false,
		resave: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
	res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
	console.log(req.session);
	console.log(req.session.id);
	req.session.visited = true;
	res.cookie("test", "test", { maxAge: 20000, signed: true });
	res.status(201).send("Hello World!");
});

// app.post("/api/auth", (req, res) => {
// 	const { username, password } = req.body;
// 	const findUser = users.find((user) => user.username === username);

// 	if (!findUser || findUser.password !== password)
// 		return res.status(401).send({ msg: "Username or password is incorrect" });

// 	req.session.user = findUser;

// 	return res.status(200).send(findUser);
// });

app.get("/api/auth/status", (req, res) => {
	console.log(req.user);
	console.log(req.session);
	return req.user
		? res.status(200).send(req.user)
		: res.status(401).send({ msg: "Unauthorized" });
});

app.post("/api/auth/logout", (req, res) => {
	if (!req.user) return res.sendStatus(401);
	req.logout((err) => {
		if (err) return res.sendStatus(400);
		res.sendStatus(200);
	});
});

app.get("/api/cart", (req, res) => {
	if (!req.session.user) return res.status(401).send({ msg: "Unauthorized" });
	return res.send(req.session.cart ?? []);
});

app.post("/api/cart", (req, res) => {
	if (!req.session.user) return res.status(401).send({ msg: "Unauthorized" });
	const cartItem = req.body;
	const { cart } = req.session;
	if (cart) {
		cart.push(cartItem);
	} else {
		req.session.cart = [cartItem];
	}
	return res.status(201).send(cartItem);
});
