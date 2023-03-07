export function parseUnicode (str) {
  const map = {
    '00C1': 'A',
    '00E1': 'a',
    '00C9': 'E',
    '00E9': 'e',
    '00CD': 'I',
    '00ED': 'i',
    '00F3': 'O',
    '00D3': 'o',
    '00DA': 'U',
    '00FA': 'u',
    '00D1': 'Ñ',
    '00F1': 'ñ'
  }

  if (!str.includes('\\')) {
    return str
  }

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === '\\') {
      const trash = str.slice(i, i + 12)
      const hex = str.slice(i + 4, i + 8)

      str = str.replace(trash, map[hex])
    }
  }

  return str
}

export function normalizeGroundFloor (description) {
  if (description.toUpperCase().includes('PLANTA BAJA')) {
    return description.replace('PLANTA BAJA', 'PB')
  }

  return description
}
