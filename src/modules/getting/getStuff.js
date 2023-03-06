import { IFCPROPERTYSINGLEVALUE } from 'web-ifc'
import { IFCPROPERTYSET } from 'web-ifc/ifc2x4'
import viewer from '../../config/initViewer'

const { ifcManager } = viewer.IFC.loader

export async function getAllPropSingleValue (parameter, modelID) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSINGLEVALUE)
  const rawProps = []

  if (parameter == null) return null

  if (parameter === 'description') {
    for (const id of lotOfIDs) {
      const props = await ifcManager.getItemProperties(modelID, id)
      const { Name } = props
      const hasBtzDescription = checkIfExist(Name.value, parameter)

      if (hasBtzDescription) {
        const { Name, NominalValue, expressID } = props

        rawProps.push({
          expressID,
          paramName: Name.value,
          paramValue: NominalValue.value
        })
      }
    }
  }

  return rawProps
}

export async function getAllPropertySets (modelID) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCPROPERTYSET)
  const rawProps = []

  for (const id of lotOfIDs) {
    const props = await ifcManager.getItemProperties(modelID, id)
    const { Name, HasProperties } = props

    const paramsIds = HasProperties.map((prop) => {
      const { value } = prop

      return value
    })

    rawProps.push({
      paramName: Name.value,
      HasProperties: paramsIds
    })
  }

  return rawProps
}

export function checkIfExist (ifcParam, typeOfParam) {
  const parameter = ifcParam.toLowerCase()

  if (typeOfParam === 'description') {
    return parameter === 'btz_description_7'
  }

  return console.error('Bad parameter')
}
