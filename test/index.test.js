const assert = require('assert');
const toSafeArray = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(description, actual, expected) {
    try {
        assert.deepStrictEqual(actual, expected);
        console.log(`✅ ${description}`);
        passed++;
    } catch (e) {
        console.error(`❌ ${description}`);
        console.error(`   erwartet: ${JSON.stringify(expected)}, erhalten: ${JSON.stringify(actual)}`);
        failed++;
    }
}

console.log('--- Arrays (Passthrough) ---');
test('Array bleibt Array', toSafeArray([1, 2, 3]), [1, 2, 3]);
test('leeres Array bleibt leeres Array', toSafeArray([]), []);
test('Array mit gemischten Typen', toSafeArray([1, 'a', true]), [1, 'a', true]);
test('verschachteltes Array bleibt erhalten', toSafeArray([[1, 2], [3, 4]]), [[1, 2], [3, 4]]);

console.log('\n--- null / undefined ---');
test('null -> fallback []', toSafeArray(null), []);
test('undefined -> fallback []', toSafeArray(undefined), []);
test('null mit custom fallback', toSafeArray(null, [1, 2]), [1, 2]);
test('undefined mit custom fallback', toSafeArray(undefined, ['x']), ['x']);

console.log('\n--- JSON Array Strings ---');
test('JSON-Array-String wird geparst', toSafeArray('[1,2,3]'), [1, 2, 3]);
test('JSON-Array-String mit Strings', toSafeArray('["a","b"]'), ['a', 'b']);
test('leeres JSON-Array', toSafeArray('[]'), []);
test('verschachteltes JSON-Array', toSafeArray('[[1,2],[3,4]]'), [[1, 2], [3, 4]]);
test('JSON-Array mit Leerzeichen drumrum', toSafeArray('  [1,2,3]  '), [1, 2, 3]);

console.log('\n--- JSON Object Strings (-> Object.entries) ---');
test('JSON-Objekt-String wird zu entries', toSafeArray('{"a":1,"b":2}'), [['a', 1], ['b', 2]]);
test('leeres JSON-Objekt', toSafeArray('{}'), []);
test('verschachteltes JSON-Objekt', toSafeArray('{"a":{"x":1}}'), [['a', { x: 1 }]]);

console.log('\n--- Plain Objects (-> Object.entries) ---');
test('Objekt wird zu entries', toSafeArray({ a: 1, b: 2 }), [['a', 1], ['b', 2]]);
test('leeres Objekt -> leeres Array', toSafeArray({}), []);

console.log('\n--- Ungültiges JSON -> Einzelwert wrappen ---');
test('kaputtes JSON-Array wird als String gewrapped', toSafeArray('[1,2,'), ['[1,2,']);
test('kaputtes JSON-Objekt wird als String gewrapped', toSafeArray('{a:1}'), ['{a:1}']);

console.log('\n--- Primitive (Einzelwert -> gewrapped) ---');
test('Zahl wird gewrapped', toSafeArray(42), [42]);
test('normaler String wird gewrapped', toSafeArray('hallo'), ['hallo']);
test('Boolean wird gewrapped', toSafeArray(true), [true]);
test('BigInt wird gewrapped', toSafeArray(10n), [10n]);
test('leerer String -> fallback (kein sinnvoller Einzelwert)', toSafeArray(''), []);
test('String mit nur Leerzeichen -> fallback', toSafeArray('   '), []);

console.log('\n--- JSON-String der primitive ergibt ---');
test('JSON-String "42" wird als Zahl geparst und gewrapped', toSafeArray('42'), ['42']);
test('JSON-Array-String mit primitivem Inhalt "[42]"', toSafeArray('[42]'), [42]);

console.log('\n--- Set / Map ---');
test('Set wird zu Array', toSafeArray(new Set([1, 2, 3])), [1, 2, 3]);
test('Map wird zu Array von Paaren', toSafeArray(new Map([['a', 1], ['b', 2]])), [['a', 1], ['b', 2]]);
test('leeres Set', toSafeArray(new Set()), []);

console.log('\n--- Date ---');
test('Date wird gewrapped', toSafeArray(new Date(1000))[0] instanceof Date, true);

console.log('\n--- Symbol / Function ---');
test('Symbol -> fallback', toSafeArray(Symbol('test')), []);
test('Function -> fallback', toSafeArray(function () {}), []);

console.log('\n--- Custom Fallback Edge Cases ---');
test('ungültiger fallback (kein Array) wird zu []', toSafeArray(null, 'nicht-array'), []);
test('ungültiger fallback (Objekt) wird zu []', toSafeArray(undefined, { a: 1 }), []);

console.log('\n--- Rundreise-Konsistenz (Array -> JSON -> Array) ---');
const original = [1, 2, 3];
const jsonString = JSON.stringify(original);
test('Array -> JSON.stringify -> toSafeArray ergibt Original', toSafeArray(jsonString), original);

console.log(`\n${passed} bestanden, ${failed} fehlgeschlagen`);
if (failed > 0) process.exit(1);