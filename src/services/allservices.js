import { transformDescriptions } from './serviceUtils'

const fullUrl = window.location.host
const subdomain = fullUrl.split('.')[0]
export const projectId =
  subdomain.includes('localhost') || subdomain.includes('127')
    ? '30'
    : subdomain

const BASE_URL = `http://${projectId}.bimtrazer.com`

export async function postDescriptionMap (descriptionsMap) {
  descriptionsMap = transformDescriptions(descriptionsMap)

  console.log('descriptionsMap', descriptionsMap)

  const URL = BASE_URL + '/api/PostDataProj'
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ID: 'assignBlocksDescription',
      DATA: descriptionsMap
    })
  }

  try {
    const res = await fetch(URL, options)
    return await res.json()
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}

export async function storeBlocks (data, serviceType) {
  const URL = BASE_URL + '/api/PostDataProj'
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ID: serviceType,
      DATA: data
    })
  }

  try {
    const res = await fetch(URL, options)
    return await res.json()
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}

export async function evaluateModel (data) {
  const modelData = new FormData()

  modelData.append('Name', data.Name)
  modelData.append('Guids', JSON.stringify(data.Guids))
  modelData.append('IfcContent', data.IfcContent)

  const URL = BASE_URL + '/checksum'
  const options = {
    method: 'POST',
    body: modelData
  }

  try {
    const res = await fetch(URL, options)
    return await res.json()
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}

export async function getBlockCodes (numberOfBlocks) {
  const URL = BASE_URL + `/api/GetBlocks/${numberOfBlocks}/0`
  const options = {
    method: 'GET'
  }

  try {
    const res = await fetch(URL, options)
    const {
      DATA: data,
      DESCRIPCION: status,
      ID: id
    } = await res.json()

    if (status === 'Successful' && id === '00') {
      return data
    }
  } catch (error) {
    console.error('There was an error: ', error)
    return null
  }
}
