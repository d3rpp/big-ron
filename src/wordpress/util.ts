import * as he from 'he';

export default function decodeHe(context: string): string {
  return he.decode(context);
}
