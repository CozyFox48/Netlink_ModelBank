import jwt from 'jsonwebtoken';
import config from "./../../../global.config";

export const authProcess = async (req, res) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ error: 'No credentials sent!' });
    }
    const token = req.headers.authorization;
    jwt.verify(token.slice(7), config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
    });
};