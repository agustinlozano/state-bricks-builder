import loadIfc from '../config/loadIfc'
import { bimtrazerSort } from '../modules/building/bimtrazerSort'
import {
  getAllPropSingleValue,
  getAllPropertySets,
  getAllRelsProps,
  getAllElements
} from '../modules/getting/'
import { filterPropSets, filterRelsProps } from '../modules/sorting/'
import { evaluateModel } from '../services/allservices'
import { collectModelData } from './bootUtils'

import { SAMPLE_RES } from '../../data/responses/sample'

export default function initMyApp () {
  const $fileElment = document.getElementById('file-input')

  $fileElment.addEventListener('change',
    async (changed) => {
      const { myModel, file } = await loadIfc(changed)
      const { modelID } = myModel

      console.log('Booting: File', file)

      const descriptionIds = await getAllPropSingleValue('description', modelID)
      const allPropSets = await getAllPropertySets(modelID)
      const allRelsProps = await getAllRelsProps(modelID)

      const btzPropSets = filterPropSets(allPropSets, descriptionIds)
      const btzRelsProps = filterRelsProps(allRelsProps, btzPropSets)

      console.log('Booting: rels props:', btzRelsProps.length)

      const btzElements = await getAllElements(modelID, btzRelsProps)
      const modelData = await collectModelData(modelID, file, btzElements)

      console.log('Booting: Model data', modelData)

      const response = await evaluateModel(modelData)
      console.log(response)

      // checkResponse(response, modelID, btzPropSets, btzRelsProps)
      checkResponse(SAMPLE_RES, modelID, btzPropSets, btzRelsProps)
    })
}

function checkResponse (res, modelID, btzPropSets, btzRelsProps) {
  const isTheSameModel = res?.ID === '00'
  const aNewModel = res?.ID === '01'
  const anUpdatedModel = res?.ID === '02'

  if (aNewModel) {
    // shared blocks feature to be implemented
    const { DATA: DATA_FROM_API } = res
    const { Blocks: blocksInDb } = DATA_FROM_API

    console.log('Check Res: The file corresponds to a new document', blocksInDb)

    setTimeout(() => {
      return bimtrazerSort(modelID, btzPropSets, btzRelsProps)
    }, 1500)
  }
  if (anUpdatedModel) {
    const { DATA: DATA_FROM_API } = res

    console.log('Check Res: The document belongs to an existing project')
    console.log('Check Res: added elements', DATA_FROM_API)

    // return updateBlocks(DATA_FROM_API, updatedElements, modelId, projectId)
  }
  if (isTheSameModel) {
    console.log('Check Res: The document is already in the storage')
  }
  if (!aNewModel && !anUpdatedModel && !isTheSameModel) {
    console.log('Check Res: It was not a valid case [00 | 01 | 02]', res)
  }

  return res
}
