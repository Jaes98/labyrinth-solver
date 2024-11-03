window.addEventListener("load", init);

function init() {
  fetch("maze.json")
    .then((response) => response.json())
    .then((data) => initializeMaze(data));
}

let maze = [];
let visited = new Set();
let start, goal;


function initializeMaze(data) {
  maze = data.maze;
  init = data.start;
  goal = data.goal;

  displayMaze(data.rows, data.cols); 
  if (solveMaze(init.row, init.col)) {
    console.log("Rute fundet");
  } else {
    console.log("ingen rute fundet");
  }
}

function displayMaze(rows, cols) {
  const grid = document.createElement("div");
  grid.className = "grid";
  grid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  document.body.appendChild(grid);

  maze.forEach((row, rowIndex) => {
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      if (cell.north) cellElement.classList.add("north-wall");
      if (cell.east) cellElement.classList.add("east-wall");
      if (cell.south) cellElement.classList.add("south-wall");
      if (cell.west) cellElement.classList.add("west-wall");

      if (rowIndex === init.row && cell.col === init.col)
        cellElement.classList.add("start");
      if (rowIndex === goal.row && cell.col === goal.col)
        cellElement.classList.add("goal");

      cellElement.id = `cell-${cell.row}-${cell.col}`;
      grid.appendChild(cellElement);
    });
  });
}

// depth-first search
function solveMaze(row, col) {
  const cellId = `${row}-${col}`;
  // hvis visited return false
  if (visited.has(cellId)) return false;
  // tilføj til visited cells
  visited.add(cellId);

  const cellElement = document.getElementById(`cell-${row}-${col}`);
  cellElement.classList.add("route");

  // if goal return true
  if (row === goal.row && col === goal.col) return true;

  // tjek cellens vægge
  const currentCell = maze[row][col];
  if (!currentCell.east && solveMaze(row, col + 1)) return true;
  if (!currentCell.south && solveMaze(row + 1, col)) return true;
  if (!currentCell.west && solveMaze(row, col - 1)) return true;
  if (!currentCell.north && solveMaze(row - 1, col)) return true;

  // kør igen hvis ikke fundet
  cellElement.classList.remove("route");
  return false;
}
