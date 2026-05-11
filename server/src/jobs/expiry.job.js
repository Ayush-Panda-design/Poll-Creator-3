import cron from 'node-cron';
import Poll from '../models/Poll.js';
import { POLL_STATUS } from '../constants/index.js';
import { emitPollExpired } from '../services/socket.service.js';

/**
 * Cron job that runs every minute to auto-expire polls
 * whose expiresAt timestamp has passed.
 */
const startExpiryJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find active polls that should have expired
      const expiredPolls = await Poll.find({
        status: POLL_STATUS.ACTIVE,
        expiresAt: { $lte: now },
      });

      if (expiredPolls.length > 0) {
        const ids = expiredPolls.map((p) => p._id);

        await Poll.updateMany(
          { _id: { $in: ids } },
          { $set: { status: POLL_STATUS.EXPIRED } }
        );

        // Notify connected clients
        expiredPolls.forEach((poll) => {
          emitPollExpired(poll._id.toString());
          console.log(`⏰ Poll expired: ${poll.title} (${poll.pollCode})`);
        });
      }
    } catch (err) {
      console.error('Expiry cron job error:', err.message);
    }
  });

  console.log('✅ Poll expiry cron job started');
};

export default startExpiryJob;
