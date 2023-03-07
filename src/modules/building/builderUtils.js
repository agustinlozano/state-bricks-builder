import { checkException } from '../../utils'

export function mergeBlocks (blocksA, blocksB) {
  const nonDuplicatedBlocks = []

  // Merge the blocks that have the same BtzDescription
  for (const blockA of blocksA) {
    let isDuplicated = false

    for (const blockB of blocksB) {
      if (blockA.BtzDescription === blockB.BtzDescription) {
        // Join the elements
        blockB.Elements = mergeElements(blockA.Elements, blockB.Elements)
        isDuplicated = true
        break
      }
    }

    if (!isDuplicated) {
      nonDuplicatedBlocks.push(blockA)
    }
  }

  return [...nonDuplicatedBlocks, ...blocksB]
}

// merge the elements of two different blocks without duplicating them
function mergeElements (elementsA, elementsB) {
  const nonDuplicatedElements = []

  for (const elementA of elementsA) {
    let isDuplicated = false

    for (const elementB of elementsB) {
      if (elementA.GlobalId === elementB.GlobalId) {
        isDuplicated = true
        break
      }
    }

    if (!isDuplicated) {
      nonDuplicatedElements.push(elementA)
    }
  }

  return [...nonDuplicatedElements, ...elementsB]
}

export function removeDuplicatedBricks (bricks) {
  const result = []

  for (const brick of bricks) {
    const { description } = brick

    const isDuplicated = result.some((b) => b.BtzDescription === description)

    if (!isDuplicated) {
      result.push(brick)
    } else {
      // Join blocks that have the same BtzDescription

      // Find the duplicated block
      const duplicatedBrick = result.find(
        (b) => b.BtzDescription === description
      )

      // Join the elements
      duplicatedBrick.elements = [
        ...duplicatedBrick.elements,
        ...brick.elements
      ]

      // Find the index of the duplicated block
      const duplicatedBrickIndex = result.findIndex(
        (b) => b.BtzDescription === description
      )

      result[duplicatedBrickIndex].elements = [
        ...result[duplicatedBrickIndex].elements,
        ...brick.elements
      ]
    }
  }

  return result
}

export function assignProjectId (blocks, projectId) {
  blocks.forEach(newBlock => {
    const { Elements } = newBlock

    Elements.forEach(element => {
      element.ProjectId = projectId
    })
  })
}

export function filterValidBlocks (blocks) {
  return blocks.filter(block => block.BtzDescription !== '')
}

export function assignBlockCodes (blocks, codes) {
  blocks.forEach((block, index) => {
    block.BtzCode = codes[index]
  })
}

export function joinBlocksWithSameDescription (blocks) {
  const blocksWithSameDescription = {}

  blocks.forEach(block => {
    const { BtzDescription, Elements } = block

    if (blocksWithSameDescription[BtzDescription]) {
      blocksWithSameDescription[BtzDescription].Elements.push(...Elements)
    } else {
      blocksWithSameDescription[BtzDescription] = block
    }
  })

  return Object.values(blocksWithSameDescription)
}

// a function to get all the DescriptionTypes of blcoks withouth duplicates
export function getDescriptionTypes (blocks) {
  const descriptionTypes = []

  blocks.forEach(block => {
    const { BtzDescriptionType } = block

    if (!descriptionTypes.includes(BtzDescriptionType)) {
      descriptionTypes.push(BtzDescriptionType)
    }
  })

  return descriptionTypes.map(type => {
    return {
      description: type,
      blocks: []
    }
  })
}

// push the block codes into typeOfDescriptions.blocks according to the block.BtzDescriptionType
export function pushBlockCodes (blocks, typeOfDescriptions) {
  blocks.forEach(block => {
    const { BtzDescriptionType, BtzCode } = block

    typeOfDescriptions.forEach(type => {
      if (type.description === BtzDescriptionType) {
        type.blocks.push(BtzCode)
      }
    })
  })
}

export function deleteDescriptionType (blocks) {
  return blocks.map(block => {
    const { BtzDescriptionType, ...rest } = block

    return rest
  })
}

export function collectDataFromBricks (bricks) {
  console.log('...')
  for (const block of bricks) {
    const { Elements, BtzDescription } = block
    console.log(`Block "${BtzDescription}" has \t ${Elements.length} elements.`)
  }
  console.log('...')
}
