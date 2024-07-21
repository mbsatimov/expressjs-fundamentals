import { users } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
	const parsedId = parseInt(req.params.id);

	if (isNaN(parsedId)) return res.status(400).send({ msg: "Invalid ID" });

	const userIndex = users.findIndex((user) => user.id == parsedId);

	if (userIndex === -1) return res.status(404).send({ msg: "User not found" });
	req.userIndex = userIndex;
	next();
};
