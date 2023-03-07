import { IFCPROPERTYSINGLEVALUE, IFCPROPERTYSET, IFCRELDEFINESBYPROPERTIES, IFCPROJECT } from 'web-ifc'
import viewer from '../../config/initViewer'
import { checkIfExist } from './utils'

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
        const { expressID } = props

        rawProps.push(expressID)
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
    const { HasProperties } = props

    const paramsIds = HasProperties.map((prop) => {
      const { value } = prop

      return value
    })

    rawProps.push({
      expressID: id,
      HasProperties: paramsIds
    })
  }

  return rawProps
}

export async function getAllRelsProps (modelID) {
  const lotOfIDs = await ifcManager.getAllItemsOfType(modelID, IFCRELDEFINESBYPROPERTIES)
  const rawProps = []

  for (const id of lotOfIDs) {
    const props = await ifcManager.getItemProperties(modelID, id)
    const { expressID, RelatedObjects, RelatingPropertyDefinition } = props

    rawProps.push({
      expressID,
      RelatedObjects: RelatedObjects.map((obj) => obj.value),
      RelatingPropertyDefinition
    })
  }

  return rawProps
}

export async function getAllElements (modelID, relProps) {
  const elements = []

  for (const relProp of relProps) {
    const { RelatedObjects } = relProp

    for (const element of RelatedObjects) {
      const { expressID, GlobalId } = await ifcManager.getItemProperties(modelID, element)

      elements.push({
        expressID,
        guid: GlobalId.value,
        HasProperties: []
      })
    }
  }

  return elements
}

export async function findElements (modelID, relProp) {
  const { RelatedObjects } = relProp
  const elements = []

  for (const element of RelatedObjects) {
    const { expressID, GlobalId } = await ifcManager.getItemProperties(modelID, element)

    elements.push({
      ExpresId: expressID,
      GlobalId: GlobalId.value,
      ProjectId: 'UNASSIGNED',
      HasProperties: []
    })
  }

  return elements
}
export async function getDescriptions (modelID, paramsIds) {
  const descriptions = []

  for (const paramId of paramsIds) {
    const { NominalValue, Name } = await ifcManager.getItemProperties(modelID, paramId)

    // const description = normalizeGroundFloor(
    //   parseUnicode(NominalValue.value).toUpperCase().trim()
    // )

    descriptions.push({
      description: NominalValue.value.trim(),
      name: Name.value.trim()
    })
  }

  return descriptions
}

export async function getProjectGuid (modelID) {
  const expressID = await ifcManager.getAllItemsOfType(modelID, IFCPROJECT)
  const { GlobalId } = await ifcManager.getItemProperties(modelID, expressID[0])

  return GlobalId.value
}
