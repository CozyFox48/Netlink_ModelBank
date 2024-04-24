import dbConnect from "../../../server/dbConnect";
import User from "../../../server/model/user";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import config from "./../../../../global.config";
import cors from "../../../server/utils/cors";

export default async function handler(req, res) {
    await dbConnect();
    await cors(req, res);

    if (req.method === 'POST') {
        try {
            const user = await User.findOne({
                username: req.body.username,
            });

            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            // if (user.allowed == false) {
            //     return res.status(404).send({ message: "You are not allowed." });
            // }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

            if (!passwordIsValid) {
                return res.status(401).send({ message: "Invalid Password!" });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400, // 24 hours
            });

            res.status(200).send({
                id: user._id,
                username: user.username,
                token: token,
                user_type: user.user_type,
                bankNumber: user.bankNumber,
                balance_usd: user.balance_usd,
                balance_eur: user.balance_eur,
                balance_gbp: user.balance_gbp,
            });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
}
