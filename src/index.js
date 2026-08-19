function toSafeArray(value, fallback = []) {
    if (!Array.isArray(fallback)) fallback = [];

    if (value === null || value === undefined) return fallback;

    if (Array.isArray(value)) return value;

    const type = typeof value;

    switch (type) {
        case 'string': {
            const trimmed = value.trim();
            if (trimmed === '') return fallback;

            // Versuch: JSON parsen
            const looksLikeJson = trimmed.startsWith('[') || trimmed.startsWith('{');
            if (looksLikeJson) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) return parsed;
                    if (parsed !== null && typeof parsed === 'object') {
                        return Object.entries(parsed);
                    }
                    // JSON.parse ergab primitive (z.B. "42" oder "true") -> als Einzelwert behandeln
                    return [parsed];
                } catch (e) {
                    // kein valides JSON -> String selbst als Einzelwert wrappen
                    return [value];
                }
            }
            // normaler String, kein JSON -> als Einzelwert wrappen
            return [value];
        }

        case 'number':
        case 'boolean':
        case 'bigint':
            return [value];

        case 'object': {
            if (value instanceof Set || value instanceof Map) {
                return Array.from(value);
            }
            if (value instanceof Date) {
                return [value];
            }
            // Plain Objekt -> Object.entries (verlustfrei, Keys bleiben erhalten)
            try {
                return Object.entries(value);
            } catch (e) {
                return fallback;
            }
        }

        case 'function':
        case 'symbol':
            return fallback;

        default:
            return fallback;
    }
}

module.exports = toSafeArray;
module.exports.toSafeArray = toSafeArray;