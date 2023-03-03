import viewer from './initViewer'

async function loadIfc (changed) {
  const file = changed.target.files[0]
  const ifcURL = URL.createObjectURL(file)
  const myModel = await viewer.IFC.loadIfcUrl(ifcURL)

  URL.revokeObjectURL(ifcURL)

  return { myModel, file }
}

export default loadIfc
