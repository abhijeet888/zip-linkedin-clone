(function(){
  class Cell {
    constructor(x,y,left,right,top,bottom,data,valueOneId){
        this.id = {x:x, y:y};
        this.walls = {left: left, right: right, top: top, bottom: bottom};
        this.data = data;
        this.clickedCellId = valueOneId;
    };

    renderCell(){
        const cell = document.createElement("div");
        cell.id = `${this.id.x},${this.id.y}`;
        cell.innerHTML = this.data;
        cell.style.width = "50px";
        cell.style.height = "50px";
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.alignContent = "center";
        cell.style.borderLeft = this.walls.left ? "1px solid black" : "1px solid blue";
        cell.style.borderRight = this.walls.right ? "1px solid black" : "1px solid blue";
        cell.style.borderTop = this.walls.top ? "1px solid black" : "1px solid blue";
        cell.style.borderBottom = this.walls.bottom ? "1px solid black" : "1px solid blue";
        this.data === 1 ? this.onClick(cell) : this.onMouseEnter(cell);
        return cell;
    };

    onClick(cell){
        cell.addEventListener("click", () => {
            cell.style.fontWeight = "bold";
            cell.style.backgroundColor = "blue";
            this.clickedCellId = cell.id;
        });
    };
    
    onMouseEnter(cell){
        this.onDragEnd(cell);
        cell.addEventListener("dragover", () => {
            if(document.getElementById(this.clickedCellId)?.style.backgroundColor === "blue"){
                cell.style.fontWeight = "bold";
                cell.style.backgroundColor = "blue";
            }
        });
    };

    onDragEnd(cell){
        cell.addEventListener("dragleave", () => {
            this.clickedCellId = cell.id;
        });
    };
  };

  class Grid {
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;
    };

    renderGrid(){
        const [matrix, valueOneId] = this.createRandomSparseMatrix(7, 60, 15);
        this.displayMatrix(matrix);
        const body = document.body;
        const grid = document.createElement("div");
        body.appendChild(grid);
        grid.id = "grid";
        for(let i=0;i<this.rows;i++){
           const row = document.createElement("div");
           row.id = i;
           row.style.display = "flex";
           grid.appendChild(row);
           for(let j=0;j<this.columns;j++){
            const cell = new Cell(i,j,false,false,false,false,matrix[i][j], valueOneId);
            row.appendChild(cell.renderCell());
           };
        };
    };

    createRandomSparseMatrix(n, density = 10, maxValue = 100){
        //create nxn matrix fill with zeros
        const matrix = Array(n).fill().map(() => Array(n).fill(0));

        //calculate how many non-zero elements we need
        const totalElements = n * n ;
        const nonZeroCount = Math.floor((density / 100) * totalElements);
        const array = Array.from({length: maxValue}, (_,i) => i+1);
        let valueOneId = null;

        //Generate random non-zero elements
        for(let count =0;count< nonZeroCount;count++){
            let row, col;

            //Find an empty position (avoid overwriting)
            do{
                row = Math.floor(Math.random() * n);
                col = Math.floor(Math.random() * n);
            } while (matrix[row][col] !== 0);

            //Generate random value (avoid zero)
            const value = array[0] ? array[0] : 0;
            if(value === 1) {valueOneId = `${row},${col}`};
            array.shift();
            matrix[row][col] = value;
        };

        return [matrix, valueOneId];
    };

    displayMatrix(matrix) {
        console.log("Matrix");
        for(let row of matrix){
            console.log(row.map(val => val.toString().padStart(4)).join(' '));
        };
    };

    analyzeMatrix(matrix){
        const n = matrix.length;
        const totalElements = n * n;
        let nonZeroCount = 0;

        for(let i = 0; i < n; i++){
            for(let j=0;j < n;j++){
                if(matrix[i][j] !== 0) nonZeroCount++;
            };
        };

        const sparsity = ((totalElements - nonZeroCount) / totalElements) * 100;

        console.log(`\nMatrix Statistics:`);
        console.log(`Size: ${n}x${n}`);
        console.log(`Total elements: ${totalElements}`);
        console.log(`Non-zero Elements: ${nonZeroCount}`);
        console.log(`Sparsity: ${sparsity.toFixed(2)}%`);
    };
  };

  const grid = new Grid(7,7);
  grid.renderGrid();
})();