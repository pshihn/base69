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

function encodeArrayWithLength(bytes: Uint8Array, startIndex: number, length: number, codes: string[]): void {
  const endIndex = startIndex + length;
  for (let i = startIndex; i < endIndex; i++) {
    const shift = (i % 7) + 1;
    let shifted = bytes[i] >> shift;
    if (shift > 1) {
      const pre = (bytes[i - 1] & ((2 << (shift - 2)) - 1)) << (8 - shift);
      shifted = pre | shifted;
    }
    codes.push(char69(shifted));
    if (shift == 7) {
      shifted = bytes[i] & 127;
      codes.push(char69(shifted));
    }
  }
}

export function encode(bytes: Uint8Array): string {
  const codes: string[] = [];
  const len = bytes.length;
  const extraBytes = len % 7;
  encodeArrayWithLength(bytes, 0, len - extraBytes, codes);
  if (extraBytes) {
    const extra = new Uint8Array(7);
    extra.fill(0, 0);
    extra.set(bytes.slice(len - extraBytes), 0);
    encodeArrayWithLength(extra, 0, extra.length, codes);
    codes[codes.length - 1] = `${7 - extraBytes}=`;
  }
  return codes.join('');
}

export function encodeString(value: string): string {
  const textEncoder = new TextEncoder();
  const bytes = textEncoder.encode(value);
  console.log('string as bytes', bytes);
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