class OctTreeNode {
  color: number[]
  level: number
  isLeaf: boolean
  pixelCount: number
  r: number
  g: number
  b: number
  children: OctTreeNode[] | null[]
  next: OctTreeNode | null
  constructor (level: number) {
    this.color = []
    this.level = level
    this.isLeaf = false
    // 节点出现次数
    this.pixelCount = 0
    this.r = 0
    this.g = 0
    this.b = 0
    this.children = new Array(8).fill(null)
    this.next = null
  }
}

interface paletteMapType {
  [key: string]: number
}

type colorMapType = {
  color: string
  count: number
}

function dec2bin(decnum: number, displayLength: number): string {
  let bin = decnum.toString(2)
  if (displayLength) {
    while (bin.length < displayLength) {
      bin = "0" + bin
    }
  }
  return bin
}
function bin2dec(bin: string): number {
  return parseInt(bin, 2)
}

// 合并叶子节点

function getThemeColor(pixels: number[][] = [], maxColors: number = 8): colorMapType[] {
  let leafNum = 0 //叶子结点数量
  let reducible = new Array(8).fill(null) //存储每一层链表的表头的数组

  function colorThief(pixels = [], maxColors: number = 8) {
    function addColor(
      parentNode: OctTreeNode | null,
      color: number[],
      level: number,
    ) {
      if (parentNode === null) return
      if (!color) {
        throw new Error("color must be provided, like [255,0,0]")
      }
      let [r, g, b] = color
      if (parentNode.isLeaf) {
        parentNode.pixelCount++
        parentNode.r += r
        parentNode.g += g
        parentNode.b += b
        return
      }

      let binR = dec2bin(r, 8)
      let binG = dec2bin(g, 8)
      let binB = dec2bin(b, 8)

      let concatColBin = `${binR[level]}${binG[level]}${binB[level]}`
      let index = bin2dec(concatColBin)
      if (!parentNode.children[index]) {
        parentNode.children[index] = createNode(level)
      }
      addColor(parentNode.children[index], color, level + 1)
    }

    function createNode(level: number): OctTreeNode {
      let node = new OctTreeNode(level)
      if (level === 7) {
        node.isLeaf = true
        leafNum++
      } else {
        node.next = reducible[level]
        reducible[level] = node
      }
      return node
    }
    function reduceTree() {
      let lv = 6
      while (reducible[lv] === null) lv--
      let node = reducible[lv]
      reducible[lv] = node.next

      let r = 0
      let g = 0
      let b = 0
      let count = 0
      for (let i = 0; i < 8; i++) {
        if (null === node.children[i]) continue
        r += node.children[i].r
        g += node.children[i].g
        b += node.children[i].b
        count += node.children[i].pixelCount
        leafNum--
      }

      node.isLeaf = true
      node.r = r
      node.g = g
      node.b = b
      node.pixelCount = count
      leafNum++
    }
    function colorsStats(
      node: OctTreeNode | null,
      paletteMap: paletteMapType,
    ): void {
      if (!node) return
      if (node.isLeaf) {
        let r = Math.floor(node.r / node.pixelCount)
        let g = Math.floor(node.g / node.pixelCount)
        let b = Math.floor(node.b / node.pixelCount)
        let color = `${r},${g},${b}`
        if (paletteMap[color]) paletteMap[color] += node.pixelCount
        else paletteMap[color] = node.pixelCount

        return
      }

      for (let i = 0; i < 8; i++) {
        node.children[i] && colorsStats(node.children[i], paletteMap)
      }
    }

    leafNum = 0
    let rootNode = new OctTreeNode(0)
    pixels.map((item) => {
      addColor(rootNode, item, 0)

      // 边构建，边合并叶子结点！
      while (leafNum > maxColors) reduceTree()
    })


    let paletteMap: paletteMapType = {}
    colorsStats(rootNode, paletteMap)
    console.log("提取的颜色:", paletteMap)

    let palette = []
    for (let key in paletteMap) {
      palette.push({
        color: `${key}`,
        count: paletteMap[key],
      })
    }
    palette.sort((a, b) => {
      return b.count - a.count
    })

    return palette
  }
  return colorThief(pixels, maxColors)
}
export default getThemeColor
