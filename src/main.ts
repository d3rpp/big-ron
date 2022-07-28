import startBot from './bot';
import post from './bot/posts';
import { getUpdates } from './wordpress/update';

const TEN_MINUTES = 10 * 60 * 1000;

async function main(): Promise<void> {
  await startBot();

  await getUpdates(post);
  setInterval(() => {
    getUpdates(post);
  }, TEN_MINUTES);
}

main();
