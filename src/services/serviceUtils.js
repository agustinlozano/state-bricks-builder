export function transformDescriptions (descriptionsMap) {
  return descriptionsMap.map(item => {
    const description = item.description
    const descriptionType = description
      .replace('BTZ_', '')
      .replace('_', ' ')

    return {
      description: descriptionType,
      blocks: item.blocks
    }
  })
}
