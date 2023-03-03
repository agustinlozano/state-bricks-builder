import viewer from './config/initViewer'
import initMyApp from './boot'

import {
  renderSelectedElm,
  shortcuts,
  highlightMaterial
} from './utils/'

import { PROJECTS_INFO } from './config/projects'
import { projectId } from './services/allservices'
import { renderProjectInfo } from './utils/renderStuff'

renderProjectInfo(PROJECTS_INFO, projectId)

// Setear el efecto hover a los elementos
const myOpacity = 0.7
const myColor = 0xa7c957
const preselectMat = highlightMaterial(myOpacity, myColor)
viewer.IFC.selector.preselection.material = preselectMat

// Destaca los elementos del modelo que tengan hover
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem()

// Deberia destacar el seleccionado y opacar el resto
window.ondblclick = () => viewer.IFC.selector.highlightIfcItem(true)

// Logea las propiedades
window.onclick = async () => {
  try {
    const { modelID, id } = await viewer.IFC.selector.pickIfcItem(true)
    const { expressID, GlobalId } = await viewer.IFC.getProperties(modelID, id, true, false)

    renderSelectedElm({ expressID, GlobalId })
  } catch (error) {
    return null
  }
}

// Por alguna razon lo incluyen
viewer.clipper.active = true

// My shortcuts
window.onkeydown = shortcuts

initMyApp()
