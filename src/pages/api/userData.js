import User from "../../server/model/user";
import { authProcess } from './../../server/utils/withAuth';
import dbConnect from "../../server/dbConnect";

const handler = async (req, res) => {
    await dbConnect();
    await authProcess(req, res);

    if (req.method === 'GET') {
        const user = await User.findById(req.query.userID);

        return res.status(200).json({
            bankNumber: user.bankNumber,
            balance_usd: user.balance_usd,
            balance_eur: user.balance_eur,
            balance_gbp: user.balance_gbp,
            username: user.username
        });
    } else if (req.method === 'POST') {
        await User.findByIdAndUpdate(req.query.userID, req.body);

        return res.status(200).json({
            success: true
        });
    }
}
export default handler;