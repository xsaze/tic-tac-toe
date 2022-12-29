const win0_ = [1,2,3] // [1,1,1,0,0,0,0,0,0]
const win1_ = [4,5,6] // [0,0,0,1,1,1,0,0,0]
const win2_ = [7,8,9] // [0,0,0,0,0,0,1,1,1]
const win_0 = [1,4,7] // [1,0,0,1,0,0,1,0,0]
const win_1 = [2,5,8] // [0,1,0,0,1,0,0,1,0]
const win_2 = [3,6,9] // [0,0,1,0,0,1,0,0,1]
const win00 = [1,5,9] // [1,0,0,0,1,0,0,0,1]
const win11 = [3,5,7] // [0,0,1,0,1,0,1,0,0]
const winList = [ win0_, win1_, win2_, win_0, win_1, win_2, win00, win11]


let type = 1;
let sign = 1;
let diff = 0;
const gridCells = document.getElementsByClassName('cell');
let grid = [1,2,3,4,5,6,7,8,9];
let containsAll = false;
let winningCombination = []

let playerScore = 0;
let compScore = 0;

player = [];
computer = [];

function resetScore() {
    playerScore = 0;
    compScore = 0;
}

function showDiffPopup() {
    document.getElementById('popup').classList.add('active');
}

function closeDiffPopup() {
    document.getElementById('popup').classList.remove('active');
}

function selectDiff(difficulty) {
    diff = difficulty;
    game();
}

function selectSymbol(symbol) {
    if (symbol == 'x') {
        document.getElementById('symbolX').classList.add('selected');
        document.getElementById('symbolO').classList.remove('selected');
        sign = 1;
        return
    }

    document.getElementById('symbolO').classList.add('selected');
    document.getElementById('symbolX').classList.remove('selected');
    sign = 2;
}

function refreshGrid() {
    Array.from(gridCells).forEach(function (el) {el.addEventListener('click', selectCell)});
    Array.from(gridCells).forEach(function (el) {el.classList.add('choice')});
    Array.from(gridCells).forEach(function (el) {el.classList.remove('full')});
    Array.from(gridCells).forEach(function (el) {el.classList.remove('winCell')});
    Array.from(gridCells).forEach(function (el) {el.classList.remove('loseCell')});
    Array.from(gridCells).forEach(function (el) {el.textContent=''});
    grid = [1,2,3,4,5,6,7,8,9];
    player = [];
    computer = [];
    containsAll = false;
    winningCombination = [];
}

function selectCell(event) {
    if (event.target.textContent!='') return
    if (sign==1) symbol = 'X'
    else symbol = 'O'
    event.target.textContent=symbol;
    event.target.classList.remove('choice');
    event.target.classList.add('full');
    player.push(parseInt(event.target.id));
    delete grid[event.target.id-1];
    turn();
}

function checkWin(who, isPlayer) {
    if (containsAll) {
        return;
    }
    
    const sortedArray = who.sort();

    for (let el in winList) {
        containsAll = winList[el].every(element => {
            return sortedArray.includes(element);
        })

        if(containsAll) {
            winningCombination = winList[el];
            if (isPlayer) {
               outcome(1);
            }
            else {
               outcome(2);
            }
            return;
        }
       
    }

    
}

function outcome(isWin) {
    stopFunctions();
    if (isWin == 0) {
        document.getElementById(4).textContent='T';
        document.getElementById(5).textContent='I';
        document.getElementById(6).textContent='E';
        //Tie
    }
    if (isWin == 1) {
        //Win
        document.getElementById(winningCombination[0]).classList.add('winCell');
        document.getElementById(winningCombination[1]).classList.add('winCell');
        document.getElementById(winningCombination[2]).classList.add('winCell');
        playerScore += 1;
        document.getElementById('player-score').textContent=`${'Player: '+playerScore}`
    }
    if (isWin == 2) {
        //Lose
        document.getElementById(winningCombination[0]).classList.add('loseCell');
        document.getElementById(winningCombination[1]).classList.add('loseCell');
        document.getElementById(winningCombination[2]).classList.add('loseCell');
        compScore += 1;
        document.getElementById('comp-score').textContent=`${'Comp: '+compScore}`
    }
}

function stopFunctions() {
    Array.from(gridCells).forEach(function (el) {el.removeEventListener('click', selectCell)});
    Array.from(gridCells).forEach(function (el) {el.classList.remove('choice')});
    Array.from(gridCells).forEach(function (el) {el.classList.add('full')});
}

function getRandomPosition() {
    let newGrid = grid.filter(el => {
        return el !== '';
    })
    let randomCell = newGrid[Math.floor(Math.random() * newGrid.length)];
    let playPositionId = grid.indexOf(randomCell) + 1;
    return playPositionId
}

function stopThreeInRow() {
    let newGrid = grid.filter(el => {
        return el !== '';
    })

    let playPositionId = 0;
    let matches = 0;

    for (let arr in winList) {
        let tempList = [];
        matches = 0;

    for (let pos in player) {
        if (winList[arr].includes(player[pos])) {
            matches += 1
            tempList.push(player[pos]);
        };
        let dangerCell = winList[arr].filter(x => !tempList.includes(x));
        if (matches > 1 && newGrid.includes(parseInt(dangerCell))) {
            playPositionId = parseInt(dangerCell);
            return playPositionId;
        };
    }
    }
    return playPositionId;
}

function smartMove() {
    let newGrid = grid.filter(el => {
        return el !== '';
    })

    let playPositionId = getRandomPosition();
    let matches = 0;

    for (let arr in winList) {
        let tempList = [];
        matches = 0;

        for (let pos in computer) {
            if (winList[arr].includes(computer[pos])) {
                matches += 1
                tempList.push(computer[pos]);
            };
            let winCell = winList[arr].filter(x => !tempList.includes(x));
            if (matches > 1 && newGrid.includes(parseInt(winCell))) {
                playPositionId = parseInt(winCell);
                return playPositionId;
            };
        }

        tempList = [];
        matches = 0;

        for (let pos in player) {
            if (winList[arr].includes(player[pos])) {
                matches += 1
                tempList.push(player[pos]);
            };
            let dangerCell = winList[arr].filter(x => !tempList.includes(x));
            if (matches > 1 && newGrid.includes(parseInt(dangerCell))) {
                playPositionId = parseInt(dangerCell);
                return playPositionId;
            };
        }
    }
    return playPositionId;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function insaneTactic(type) {
    let newGrid = grid.filter(el => {
        return el !== '';
    })
    let corners = [1,3,7,9];
    let edges = [2,4,6,8];
    let center = 5;

    if (type == 1) {
        if (newGrid.includes(center)) {return center}
        else return smartMove();        
    }

    if (type == 2) {
        if (computer.length == 0) {return corners[randomInt(0,3)]}
        if (computer.length == 1) {
            let availableCorners = newGrid.filter(x => corners.includes(x));

            if (computer[0] == 1 && player.includes(9)) {
                playPositionId = availableCorners[randomInt(0,availableCorners.length-1)];
                return playPositionId;
            }
            if (computer[0] == 3 && player.includes(7)) {
                playPositionId = availableCorners[randomInt(0,availableCorners.length-1)];
                return playPositionId;
            }
            if (computer[0] == 7 && player.includes(3)) {
                playPositionId = availableCorners[randomInt(0,availableCorners.length-1)];
                return playPositionId;
            }
            if (computer[0] == 9 && player.includes(1)) {
                playPositionId = availableCorners[randomInt(0,availableCorners.length-1)];
                return playPositionId;
            }
            else {return smartMove()};
        }
        else {return smartMove();}
    }
    
    if (type == 3) {
        return smartMove();
    }

    }
function turn() {
    
    //check win logic
    if (containsAll==true) {
        return;
    }

    checkWin(player, true);
    if (containsAll==true) {
        return;
    }

    //ai turn
    let newGrid = grid.filter(el => {
        return el !== '';
    })


    if (newGrid.length == 0) {
        outcome(0);}
    else {
        if (sign==1) symbol = 'O'
        else symbol = 'X'

        if (diff==1) {compMove(getRandomPosition())}

        if (diff==2) {compMove(smartMove())}

        if (diff==3) {
            
            let corners = [1,3,7,9];
            let edges = [2,4,6,8];
            let center = 5;
            if (player.length == 1) {
                if (corners.includes(player[0])) {
                    type = 1;
                }

                if (center == player[0]) {
                    type = 2;
                }

                if (edges.includes(player[0])) {
                    type = 3;
                }
                }

            compMove(insaneTactic(type))
        }

        checkWin(computer, false);
    }
}

function compMove(position){
    delete grid[position-1];
    document.getElementById(position).textContent=symbol;
    document.getElementById(position).classList.remove('choice');
    computer.push(position);
}


function game() {
    closeDiffPopup();
    refreshGrid();
    console.log('game is running');
}
