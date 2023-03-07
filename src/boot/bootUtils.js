import { getProjectGuid } from '../modules/getting/'

export async function collectModelData (modelID, file, allElements) {
  return {
    Name: await getProjectGuid(modelID),
    IfcContent: file,
    Guids: allElements
  }
}
