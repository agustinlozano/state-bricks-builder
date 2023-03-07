export function filterPropSets (allPropSet, descriptionIds) {
  return allPropSet.filter((set) => {
    const { HasProperties } = set

    return HasProperties.some((id) => {
      return descriptionIds.some((descId) => {
        return id === descId
      })
    })
  })
}

export function filterRelsProps (allRelsProps, btzPropSets) {
  return allRelsProps.filter((rel) => {
    const { RelatingPropertyDefinition } = rel

    return btzPropSets.some((set) => {
      return set.expressID === RelatingPropertyDefinition.value
    })
  })
}
