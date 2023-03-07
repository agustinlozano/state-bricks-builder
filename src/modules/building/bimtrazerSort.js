import {
  getBlockCodes,
  storeBlocks,
  postDescriptionMap
} from '../../services/allservices'
import {
  checkException,
  checkBlocksHaveCode,
  checkElementsHaveProjectId
} from '../../utils/'
import { getProjectGuid } from '../getting/'
import { buildBlocks, prebuildBlocks } from './builders'
import {
  // collectDataFromBricks,
  mergeBlocks,
  assignProjectId,
  assignBlockCodes,
  filterValidBlocks,
  joinBlocksWithSameDescription,
  deleteDescriptionType,
  pushBlockCodes,
  getDescriptionTypes
} from './builderUtils'

export async function bimtrazerSort (modelID, btzPropSets, btzRelsProps, blocksInDb = []) {
  console.log('1. Bimtrazer sort production')

  const prebuiltBlocks = prebuildBlocks(btzPropSets, btzRelsProps)
  console.log('2. Prebuilt block ready', prebuiltBlocks)

  const blocks = await buildBlocks(modelID, prebuiltBlocks)
  console.log('3. Create block structure ready', blocks)

  const newBlocks = joinBlocksWithSameDescription(
    filterValidBlocks(blocks)
  )

  // Assign projectId to each element
  await handleProjectId(newBlocks, modelID)

  // Assign block codes to each block
  await handleBlockCodes(newBlocks)

  const typeOfDescriptions = getDescriptionTypes(newBlocks)
  pushBlockCodes(newBlocks, typeOfDescriptions)

  console.log('5. Type of descriptions', typeOfDescriptions)

  // Call the API to set the new blocks on descriptionMap table
  const mapDescriptionRes = await postDescriptionMap(typeOfDescriptions)

  console.log('6. Response from DescriptionMap', mapDescriptionRes)

  // Now, we have to delete the descriptionType from the blocks structure
  const readyNewBlocks = deleteDescriptionType(newBlocks)

  console.log('7. New blocks ready', readyNewBlocks)

  // Merge new blocks with blocks in db
  const finalBlocks = mergeBlocks(readyNewBlocks, blocksInDb)

  console.log('8. Final blocks', finalBlocks)

  const blockIfcRes = await storeBlocks(finalBlocks, 'BlocksIFC')

  console.log('9. Response from BlocksIFC', blockIfcRes)

  return finalBlocks
}

export async function handleProjectId (blocks, modelID) {
  const projectId = await getProjectGuid(modelID)

  assignProjectId(blocks, projectId)
  checkElementsHaveProjectId(blocks)
}

export async function handleBlockCodes (blocks) {
  const codes = await getBlockCodes(blocks.length)
  console.log('4. Block codes', codes)

  checkException(codes, 'There was an error getting the BtzCodes from the API.')

  assignBlockCodes(blocks, codes)
  checkBlocksHaveCode(blocks)
}
