#import <stdio.h>

static const unsigned char CHARS[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-*<>|";

void byteToChars(int n, unsigned char *out) {
  out[0] = CHARS[n % 69];
  out[1] = CHARS[n / 69];
}


int main() {
  printf("Base 69\n");
  return 0;
}