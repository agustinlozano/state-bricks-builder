export const validate = (param, message) => {
  if (param === null || param === undefined || param === '') {
    console.error(message)
    return null
  }
  return param
}

export const validateAnArray = (param, message) => {
  if (param === null || param.length === 0) {
    console.error(message)
    return null
  }
  return param
}

// A function that throws an error (exception) if the parameter is null or undefined
export const checkException = (param, message) => {
  if (param === null || param === undefined || param === '') {
    throw new Error(message)
  }

  return param
}

export function checkElementsHaveProjectId (blocks) {
  blocks.forEach(block => {
    const { Elements } = block
    const hasProjectId = Elements.every(element => element.ProjectId !== '' || element.ProjectId !== null || element.ProjectId !== undefined)

    checkException(hasProjectId, 'Some elements have the ProjectId empty.')
  })
}

export function checkBlocksHaveCode (blocks) {
  const hasCode = blocks.every(block => block.BtzCode !== 'UNASSIGNED')

  checkException(hasCode, 'Some blocks have the BtzCode UNASSIGNED.')
}
