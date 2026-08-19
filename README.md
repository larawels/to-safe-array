# to-safe-array

Converts **any** JavaScript value into an array, safely — never throws, always falls back to a sensible default.

## Installation

```bash
npm install to-safe-array
```

## Usage

```javascript
const toSafeArray = require('to-safe-array');

toSafeArray([1, 2, 3]);              // [1, 2, 3]        (arrays pass through)
toSafeArray('[1,2,3]');              // [1, 2, 3]        (JSON array string parsed)
toSafeArray('{"a":1,"b":2}');        // [["a",1],["b",2]] (JSON object -> entries)
toSafeArray({ a: 1, b: 2 });         // [["a",1],["b",2]] (plain object -> entries)
toSafeArray(null);                   // []
toSafeArray(undefined);              // []
toSafeArray(42);                     // [42]             (single value wrapped)
toSafeArray('hello');                // ['hello']
toSafeArray(new Set([1, 2, 3]));     // [1, 2, 3]
toSafeArray(new Map([['a', 1]]));    // [['a', 1]]
toSafeArray(null, ['default']);      // ['default']      (custom fallback)
```

## Why objects become entries, not values

Converting `{a: 1, b: 2}` to `[1, 2]` would silently discard the keys. `to-safe-array` uses `Object.entries()` instead, so no information is lost and the result stays reversible with `Object.fromEntries()`.

## Works well with `to-safe-json`

Both packages are designed to be inverses of each other:

```javascript
const arr = [1, 2, 3];
toSafeArray(JSON.stringify(arr)); // [1, 2, 3] — round-trips cleanly
```

## API

### `toSafeArray(value: any, fallback?: any[] = []): any[]`

Takes any value and always returns an array — never throws.

- `fallback` — value returned when `value` is `null`/`undefined` or can't be converted. Must itself be an array; otherwise it's silently reset to `[]`.

## License

MIT © Toby Maxham