import { Router } from "express";
import {
	checkSchema,
	matchedData,
	query,
	validationResult,
} from "express-validator";

import { users } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";

const router = Router();

router.get("/api/users", query("key").isString().notEmpty(), (req, res) => {
	console.log(req.session.id);
	req.sessionStore.get(req.session.id, (err, session) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ msg: "Something went wrong" });
		}
		console.log(session);
	});
	const { value, key } = req.query;

	if (value && key)
		return res.send(
			users.filter((user) =>
				user[key].toString().toLowerCase().includes(value.toLowerCase())
			)
		);
	return res.send(users);
});

router.post("", checkSchema(createUserValidationSchema), (req, res) => {
	const result = validationResult(req);

	if (!result.isEmpty())
		return res.status(400).send({ error: result.array()[0].msg });

	const data = matchedData(req);

	const newUser = { id: users[users.length - 1].id + 1, ...data };
	users.push(newUser);
	return res.status(201).send(newUser);
});

router.get("/:id", resolveIndexByUserId, (req, res) => {
	const findUser = users[req.userIndex];

	if (!findUser) return res.status(404).send({ msg: "User not found" });

	return res.status(200).send(users.find((user) => user.id == req.params.id));
});

router.put("/:id", resolveIndexByUserId, (req, res) => {
	const { userIndex, body } = req;

	users[userIndex] = { id: users[userIndex].id, ...body };
	return res.status(200).send(users[userIndex]);
});

router.patch("/:id", (req, res) => {
	const { userIndex, body } = req;

	users[userIndex] = { ...users[userIndex], ...body };
	return res.status(200).send(users[userIndex]);
});

router.delete("/:id", resolveIndexByUserId, (req, res) => {
	const { userIndex } = req;

	users.splice(userIndex, 1);
	return res.sendStatus(204);
});

export default router;
