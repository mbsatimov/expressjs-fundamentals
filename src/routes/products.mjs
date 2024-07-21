import { Router } from "express";
import { products } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (req, res) => {
	if (req.signedCookies.test && req.signedCookies.test === "test")
		return res.send(products);

	return res.status(403).send({ msg: "You need the correct cookie" });
});

export default router;
