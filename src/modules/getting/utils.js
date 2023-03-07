
export function checkIfExist (ifcParam, typeOfParam) {
  const parameter = ifcParam.toLowerCase()

  if (typeOfParam === 'description') {
    return parameter === 'btz_description_7'
  }

  return console.error('Bad parameter')
}
