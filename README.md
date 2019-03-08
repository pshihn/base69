# Base69

Base69 is a binary-to-text encoding scheme inspired by [Base64](https://en.wikipedia.org/wiki/Base64) encoding.

Why Base69 when Base64 is adequate?
Because it's *NICE*!

## Technique

Base69 is similar to Base64 - it uses a set of 69 characters (not 64) to represent the data and uses the character `=` to indicate padding. 

Base64 works with blocks of 3 bytes which can be broken into four 6-bit chunks. (6 bits can represent 64 values). 

Base69 works with block of 7 bytes instead which can be broken into eight 7-bit chunks. 
(Need at least 7 bytes to represent 69 values; and since 7 is prime, need at least 7 bytes to break the data into 8 chunks of 7 bits).

The 69 characters in the set are:
```
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/-*<>|
```

## Algorithm

* Divide the input byte stream to 7 byte chunks.
* Divide the 56 bits in a chunk to 8 groups of 7 bits.
* Take the numeric value (n) of each 7 bit group and turn them into a 2 character string: Divide n by 69 and get the quotient and remainder. The string's first character is the character corresponding to the remainder and the second character corresponds to the quotient from the 69-character dataset.
* If the trailing data is less than 7 bytes, then extra bytes of value `0` are added at the end to make a 7-byte chunk.
* The last two characters of the encoded padded data are replaced by `p=` whre p is the number of bytes padded at the end. e.g. if the data at the end is 4 bytes long, 3 bytes are added. So the last 2 characters in the encoded string will be `3=`

## Implementations

A basic Javascript implementation is added to this project. Implementations in other languages are welcome from contributors. 

[View demo](http://pshihn.github.io/base69/) that turns text to Base69 strings and vice versa.

## FAQ

**Why implement Base69?**

Because it's *noice!*

**Is it better than Base64?**

Not really

## License
[MIT License](https://github.com/pshihn/base69/blob/master/LICENSE) (c) [Preet Shihn](https://twitter.com/preetster)
