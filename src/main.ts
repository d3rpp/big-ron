import startBot from './bot';
import post from './bot/posts';
import { getUpdates } from './wordpress/update';
// import decodeHe from './wordpress/util';

const TEN_MINUTES = 10 * 60 * 1000;

async function main(): Promise<void> {
  await startBot();

  setInterval(() => {
    getUpdates(post);
  }, TEN_MINUTES);
}

main();
