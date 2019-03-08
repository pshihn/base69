const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-*<>|';

function byteToChars(n: number): string {
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

function charsToByte(s: string): number {
  if (s.charAt(0) === '=') {
    return chars.indexOf(s.charAt(1));
  } else {
    return (69 * chars.indexOf(s.charAt(1))) + chars.indexOf(s.charAt(0));
  }
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
    codes.push(byteToChars(shifted));
    if (shift == 7) {
      shifted = bytes[i] & 127;
      codes.push(byteToChars(shifted));
    }
  }
}

function decodeChunk(s: string): Uint8Array {
  const paddedBytes = s.endsWith('=') ? (+s.charAt(s.length - 2)) : 0;
  const decoded = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    decoded[i] = (i === 7 && paddedBytes) ? 0 : charsToByte(s.substring(i * 2, i * 2 + 2));
  }
  const result = new Uint8Array(7);
  for (let i = 0; i < 7; i++) {
    let t1 = decoded[i] << (i + 1);
    let t2 = decoded[i + 1] >> (7 - i - 1);
    result[i] = t1 | t2;
  }
  return result;
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

export function decode(value: string): Uint8Array {
  let extraBytes = 0;
  if (value.charAt(value.length - 1) === '=') {
    extraBytes = +value.charAt(value.length - 2);
  }
  const chunkCount = Math.ceil(value.length / 16);
  const bytes = new Uint8Array(chunkCount * 7 - extraBytes);
  for (let i = 0; i < chunkCount; i++) {
    const chunkString = value.substring(i * 16, (i + 1) * 16);
    if (extraBytes && (i == chunkCount - 1)) {
      bytes.set(decodeChunk(chunkString).subarray(0, 7 - extraBytes), i * 7);
    } else {
      bytes.set(decodeChunk(chunkString), i * 7);
    }
  }
  return bytes;
}