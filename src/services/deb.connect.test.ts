/* Import mongoose from 'mongoose';
import 'dotenv/config';
import { dbConnect } from './db.connect';

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    await dbConnect();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
*/
