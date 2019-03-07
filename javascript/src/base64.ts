const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-*<>|';

function char69(n: number): string {
  if (n < 69) {
    return `=${chars[n]}`;
  }
  const tokens: string[] = [];
  while (n > 0) {
    tokens.push(chars[n % 69]);
    n = Math.floor(n / 69);
  }
  return tokens.join('');
}

export function encode(bytes: Uint8Array): string {
  const len = bytes.length;
  const extraBytes = len % 7;
  const len2 = len - extraBytes;
  const codes: string[] = [];
  for (let i = 0; i < len2; i++) {
    const shift = (i % 7) + 1;
    let aft = bytes[i] >> shift;
    if (shift > 1) {
      const pre = (bytes[i - 1] & ((2 << (shift - 2)) - 1)) << (8 - shift);
      aft = pre | aft;
    }
    console.log(aft);
    codes.push(char69(aft));
    if (shift == 7) {
      aft = bytes[i] & 127;
      console.log(aft);
      codes.push(char69(aft));
    }
  }
  return codes.join('');
}

export function encodeString(value: string): string {
  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(value);
  console.log('bytes', bytes);
  return encode(bytes);
}

export function encodeNumbers(value: number[]): string {
  const buffer = new ArrayBuffer(value.length);
  const array = new Uint8Array(buffer);
  value.forEach((d, i) => {
    array[i] = d;
  });
  console.log('array', array);
  return encode(array);
}