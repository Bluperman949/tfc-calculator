const MOVE_MAP = {
  "Shrink": 16,
  "Upset": 13,
  "Bend": 7,
  "Punch": 2,
  "Light Hit": -3,
  "Medium Hit": -6,
  "Hard Hit": -9,
  "Draw": -15
}
const MOVES = Object.entries(MOVE_MAP).map((val, i, arr) => {
  return { name: val[0], val: val[1] }
})

// Find the *real* target that takes the recipe offset into account.
function anvil(target, recipe = [], processed = []) {
  console.log("anvil()", target, recipe)
  var offset = 0
  for (let i in recipe) {
    if (recipe[i] === "") continue;
    // if recipe says Hit, branch into 3 solutions and return the best one
    if (recipe[i] === "Hit") {
      let rSlice = recipe.slice(i + 1)
      let s1 = anvil(target - offset + 9, rSlice, processed.concat(MOVES[6].name))
      let s2 = anvil(target - offset + 6, rSlice, processed.concat(MOVES[5].name))
      let s3 = anvil(target - offset + 3, rSlice, processed.concat(MOVES[4].name))
      if (s1.length < s2.length && s1.length < s3.length) return s1
      if (s2.length < s1.length && s2.length < s3.length) return s2
      return s3
    }
    // otherwise, move the offset
    offset += MOVE_MAP[recipe[i]]
    processed.push(recipe[i])
  }
  // calculate solution
  const TARGET = target - offset
  const MIN = 0;
  const MAX = 150;

  console.log("solving", TARGET)

  let queue = [{ pos: 0, moves: [] }]
  let visited = new Set([0])

  while (queue.length > 0) {
    let { pos, moves } = queue.shift()
    if (pos === TARGET) return moves.concat(processed)
    for (let i in MOVES) {
      let move = MOVES[i]
      let next = pos + move.val

      if (next >= MIN && next <= MAX && !visited.has(next)) {
        visited.add(next);
        queue.push({ pos: next, moves: moves.concat(move.name) })
      }
    }
  }
  return ["No Solutions"];
}

const form = document.getElementById("calculator-anvil")
const targetInput = document.getElementById("input-target")
const recipeDropdowns = Array.from(document.getElementsByClassName("input-recipe"))
const solution = document.getElementById("anvil-solution")

form.onsubmit = e => {
  let target = parseInt(targetInput.value)
  let recipe = recipeDropdowns.map(elem => elem.options[elem.selectedIndex].value)

  let result = anvil(target, recipe)
  console.log("final", result)
  solution.textContent = `(${result.length}) ${result}`

  e.preventDefault()
}