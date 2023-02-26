import User from '../../Models/User';
import db from '../../utils/db';
import data from '../../utils/data';

const handler = async (req, res) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await db.disconnect();
  res.send({ message: 'seeded succesfully' });
};

export default handler;
