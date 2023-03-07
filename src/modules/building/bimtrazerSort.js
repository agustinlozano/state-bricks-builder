import { getBlockCodes, storeBlocks } from '../../services/allservices'
import {
  normalizeGroundFloor,
  parseUnicode,
  checkException
} from '../../utils/'
import { getProjectGuid } from '../getting/'
import { buildBlocks, prebuildBlocks } from './builders'
import {
  assignBlockCodes,
  assignProjectId,
  checkElementsHaveProjectId,
  checkBlocksHaveCode,
  filterValidBlocks,
  mergeBlocks
} from './builderUtils'

export async function bimtrazerSort (modelID, btzPropSets, btzRelsProps, blocksInDb = []) {
  console.log('1. Bimtrazer sort production')

  blocksInDb.forEach(block => {
    block.BtzDescription = normalizeGroundFloor(
      parseUnicode(block.BtzDescription).toUpperCase().trim()
    )
  })

  const prebuiltBlocks = prebuildBlocks(btzPropSets, btzRelsProps)
  console.log('2. Prebuilt block ready', prebuiltBlocks)

  const blocks = await buildBlocks(modelID, prebuiltBlocks)
  console.log('2. Create block structure ready', blocks)

  // Avoid a block with BtzDescription empty
  const newBlocks = filterValidBlocks(blocks)

  // Assign projectId to each element
  const projectId = await getProjectGuid(modelID)
  assignProjectId(newBlocks, projectId)
  checkElementsHaveProjectId(newBlocks)

  // Filter blocks with BtzCode === 'UNASSIGNED'
  const codes = await getBlockCodes(newBlocks.length)

  checkException(codes, 'There was an error getting the BtzCodes from the API.')

  // Assign BtzCode to each block
  assignBlockCodes(newBlocks, codes)
  checkBlocksHaveCode(newBlocks)

  console.log('3. New blocks ready', newBlocks)

  // Merge new blocks with blocks in db
  const finalBlocks = mergeBlocks(newBlocks, blocksInDb)

  console.log('4. Final blocks', finalBlocks)

  const response = await storeBlocks(finalBlocks, 'BlocksIFC')

  console.log('5. Response from Bimtrazer', response)

  return finalBlocks
}
