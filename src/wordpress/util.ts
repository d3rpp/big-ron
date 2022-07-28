import * as he from 'he';

export default function decodeHe(context: string): string {
  // respect bold
  const raw = context.replace(/(&#822[01];)/g, '**');
  return he.decode(raw);
}
