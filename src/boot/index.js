import loadIfc from '../config/loadIfc'
import { getAllPropSingleValue } from '../modules/getting/getStuff'

export default function initMyApp () {
  const $fileElment = document.getElementById('file-input')

  $fileElment.addEventListener('change',
    async (changed) => {
      const { myModel, file } = await loadIfc(changed)
      const { modelID } = myModel

      console.log('File', file)
      console.log('Model', modelID)

      const textDescriptions = await getAllPropSingleValue('description', modelID)

      console.log('Text Descriptions', textDescriptions[0])
    })
}
