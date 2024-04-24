import User from "../../server/model/user";
import { authProcess } from '../../server/utils/withAuth';
import dbConnect from "../../server/dbConnect";

const handler = async (req, res) => {
    await dbConnect();
    await authProcess(req, res);

    if (req.method === 'GET') {
        const users = await User.find();
        return res.status(200).json(users);
    }
}
export default handler;