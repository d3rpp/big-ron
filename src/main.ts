import { API_ROOT } from './wordpress';
import { initUpdateTimer } from './wordpress/init_update';

async function main(): Promise<void> {
  // run initialisation steps
  const updateTimer = initUpdateTimer(
    // _fields - only ID
    // order - desc -> newest first (highest number value)
    // order_by - date
    // page - most recent
    // per_page - max 20 fetched at a time
    `${API_ROOT}/wp-json/wp/v2/posts?_fields=id&order=desc&orderby=date&page=1&per_page=20`,
    () => {},
  );

  // run Application
  console.log('Hello world.');

  // run shutdown steps
  clearInterval(updateTimer);
}

await main();

export {};
