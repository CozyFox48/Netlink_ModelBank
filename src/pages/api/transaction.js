import Transaction from "../../server/model/transaction";
import User from "../../server/model/user";
import cors from "../../server/utils/cors";
import dbConnect from "../../server/dbConnect";
import { authProcess } from './../../server/utils/withAuth';

const handler = async (req, res) => {
  await dbConnect();
  await cors(req, res);
  await authProcess(req, res);

  if (req.method === 'GET') {
    try {
      const user = await User.findById(req.query.userID);
      let result = [];
      for (const each of user.transaction) {
        const eachTrans = await Transaction.findById(each);
        result.push({
          sender: eachTrans.sender,
          receiver: eachTrans.receiver,
          amount: eachTrans.amount,
          currency: eachTrans.currency
        });
      }
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message
      });
    }
  }

}
export default handler;