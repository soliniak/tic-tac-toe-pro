// design https://dribbble.com/shots/6532744-How-to-Make-a-Tic-Tac-Toe-Bot-with-WebAssembly-for-Go/attachments

const area = document.querySelector(".area"),
    items = document.querySelectorAll('.item')

let winningHorizontal = [],
    winningVertical = [],
    winningDiagonalTopLeftBottomRight = [],
    winningDiagonalTopRightBottomLeft = [],
    areaSize = 3,
    cellSize = 500 / areaSize - 10 * 2,
    finished = false

const calculateWinningFields = areaSize => {
    winningHorizontal = [],
        winningVertical = [],
        winningDiagonalTopLeftBottomRight = [],
        winningDiagonalTopRightBottomLeft = []

    for (let i = 0; i <= areaSize - 1; i++) {

        const startRowNr = i > 0 ? (areaSize * i + 1) : 1
        let keepHorizontal = [], keepVertical = []

        // diagonal from top right to bottom left
        winningDiagonalTopRightBottomLeft.push(areaSize * (i + 1) - i)

        // diagonal from top left to bottom right
        winningDiagonalTopLeftBottomRight.push((i + 1) + areaSize * i)

        // horizontal
        for (let j = parseInt(startRowNr); j <= parseInt(startRowNr) + areaSize - 1; j++) {
            keepHorizontal.push(j)
        }
        winningHorizontal.push(keepHorizontal)
        keepHorizontal = []

        //vertical
        for (let k = 1; k <= areaSize; k++) {
            keepVertical.push((i + areaSize * k) - (areaSize - 1))
        }
        winningVertical.push(keepVertical)
        keepVertical = []
    }
}

// draw grid
const drawGrid = areaSize => {
    area.innerHTML = ""
    for (let i = 0; i < areaSize * areaSize; i++) {
        const divToAppend = document.createElement("div")
        divToAppend.classList.add("item")
        divToAppend.setAttribute("id", i + 1);
        area.appendChild(divToAppend)
    }
    area.style.gridTemplate = `repeat(${areaSize}, ${cellSize}px) / repeat(${areaSize}, ${cellSize}px)`
    calculateWinningFields(areaSize)
}

drawGrid(areaSize)

const checkForWinner = pawn => {

    const fields = [
        winningHorizontal,
        winningVertical,
        winningDiagonalTopLeftBottomRight,
        winningDiagonalTopRightBottomLeft
    ]

    const check = arrayOfFields => arrayOfFields.every(fieldId => {
        const fieldById = document.getElementById(fieldId)
        return fieldById.hasAttribute("data-pawn") ? (fieldById.dataset.pawn === pawn) : ''
    })

    const highlightWinner = winningFields => {
        winningFields.forEach(winningField => {
            document.getElementById(winningField).classList.add('winning-field')
            document.getElementById(winningField).style.backgroundImage = "none"
        })
        finished = true
        return
    }

    fields.some(arrayOfWinningFields => {
        if (arrayOfWinningFields === winningHorizontal || arrayOfWinningFields === winningVertical) {
            arrayOfWinningFields.forEach(nestedArray => {
                check(nestedArray) ? highlightWinner(nestedArray) : false
            })
        } else {
            check(arrayOfWinningFields) ? highlightWinner(arrayOfWinningFields) : false
        }
    })
}

let pawn = "x", clicks = 0
const pawnO = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" 
width="80%" height="80%" shape-rendering="geometricPrecision" 
fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 15863 15863">
  <linearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="7931.66" y1="0" x2="7931.66" y2="15863.3">
    <stop offset="0" stop-opacity="1" stop-color="#00A0E3"/>
    <stop offset="1" stop-opacity="1" stop-color="#1479AF"/>
   </linearGradient>
 </defs>
  <path class="pawn" fill="url(#gradient) #01aad6" d="M7932 3245c2588,0 4686,2098 4686,4687 0,2588 -2098,4686 -4686,4686 -2589,0 -4687,-2098 -4687,-4686 0,-2589 2098,-4687 4687,-4687zm0 -3245c4380,0 7931,3551 7931,7932 0,4380 -3551,7931 -7931,7931 -4381,0 -7932,-3551 -7932,-7931 0,-4381 3551,-7932 7932,-7932z"/>
</svg>
`
const pawnX = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" 
width="80%" height="80%" shape-rendering="geometricPrecision" 
fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 17194 17163">
 <defs>
   <linearGradient id="gradient2" gradientUnits="userSpaceOnUse" x1="8596.87" y1="0" x2="8596.87" y2="17162.9">
    <stop offset="0" stop-opacity="1" stop-color="#F36668"/>
    <stop offset="1" stop-opacity="1" stop-color="#F09411"/>
   </linearGradient>
 </defs>
  <polygon class="pawn" fill="url(#gradient2) orange" points="0,2763 2763,0 8597,5784 14430,0 17194,2763 11403,8566 17194,14308 14369,17163 8597,11378 2825,17163 0,14308 5791,8566 "/>
`
// using event delegation to make it scalable
area.addEventListener("click", e => {
    // console.log(e)
    if (!e.target.hasAttribute('data-pawn') && e.target.classList.contains("item") && finished === false) {

        e.target.dataset.pawn = pawn
        e.target.innerHTML = pawn === "x" ? pawnX : pawnO

        clicks++ >= areaSize ? checkForWinner(pawn) : ''
        pawn = pawn == "x" ? "o" : "x"
    }

    if (clicks >= areaSize * areaSize && finished === false) {
        console.log("remis")
    }
})

const resetGameFn = () => {
    finished = false;
    pawn = "x", clicks = 0

    items.forEach(item => {
        item.dataset.pawn = ""
        item.innerText = ""
    })

    cellSize = 500 / areaSize - 10 * 2;
    drawGrid(areaSize)
}

resetGameBtn.addEventListener("click", () => {
    resetGameFn()
})

gridSelect.addEventListener("input", e => {
    areaSize = parseInt(e.target.value)
    resetGameFn()
})