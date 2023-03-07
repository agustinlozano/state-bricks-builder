import { findElements, getDescriptions } from '../getting/'

export function prebuildBlocks (propSets, relsProps) {
  return propSets.map((set, index) => {
    const { HasProperties } = set
    const { expressID, RelatedObjects } = relsProps[index]

    return {
      HasProperties,
      RelProps: {
        RelId: expressID,
        RelatedObjects
      }
    }
  })
}

export async function buildBlocks (modelID, prebuiltBlocks) {
  const blocks = []

  for (const prebuiltBlock of prebuiltBlocks) {
    const { HasProperties, RelProps } = prebuiltBlock
    const elements = await findElements(modelID, RelProps)
    const textDescriptions = await getDescriptions(modelID, HasProperties)

    for (const { description, name } of textDescriptions) {
      blocks.push({
        BtzCode: 'UNASSIGNED',
        BtzDescription: description,
        BtzDescriptionType: name,
        BtzStartDate: null,
        BtzEndDate: null,
        Elements: elements,
        Labels: []
      })
    }
  }

  return blocks
}
