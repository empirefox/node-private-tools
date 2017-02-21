const unquote = require('unquote');

// import from golang!
export function lookupGotag(tag: string, key: string): string | null {
  // When modifying this code, also update the validateStructTag code
  // in cmd/vet/structtag.go.

  while (tag) {
    // Skip leading space.
    let i = 0
    while (i < tag.length && tag[i] === ' ') {
      i++
    }
    tag = tag.slice(i)
    if (!tag) {
      break
    }

    // Scan to colon. A space, a quote or a control character is a syntax error.
    // Strictly speaking, control chars include the range [0x7f, 0x9f], not just
    // [0x00, 0x1f], but in practice, we ignore the multi-byte control characters
    // as it is simpler to inspect the tag's bytes than the tag's runes.
    i = 0
    while (i < tag.length && tag[i] > ' ' && tag[i] !== ':' && tag[i] !== '"' && tag.charCodeAt(i) !== 0x7f) {
      i++
    }
    if (i === 0 || i + 1 >= tag.length || tag[i] !== ':' || tag[i + 1] !== '"') {
      break
    }
    let name = tag.slice(0, i)
    tag = tag.slice(i + 1)

    // Scan quoted string to find value.
    i = 1
    while (i < tag.length && tag[i] !== '"') {
      if (tag[i] === '\\') {
        i++
      }
      i++
    }
    if (i >= tag.length) {
      break
    }
    let qvalue = tag.slice(0, i + 1)
    tag = tag.slice(i + 1)

    if (key === name) {
      let value = unquote(qvalue)
      if (value === qvalue) {
        break
      }
      return value
    }
  }
  return null;
}