// 跟 server 要
export function getMazeGrid(cols, rows) {
    let grid = []

    for (let j = 0; j < rows; j++){
        for (let i = 0; i < cols; i++){
            grid.push({
                visited: false,
                count: '',
                i: i,
                j: j,
                backgroundColor: "white",
                walls: [true, true, true, true], // [up, right, down, left]
            })
        }
    }

    function index(i, j){
        if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) return -1
        return i + j * cols;
    }

    function checkNeighbors(current) {
        let i = current.i, j = current.j;
        let neighbors = [];

        let top     = grid[index(i, j - 1)];
        let right   = grid[index(i + 1, j)];
        let bottom  = grid[index(i, j + 1)];
        let left    = grid[index(i - 1, j)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }

    function removeWalls(a, b) {
        const dx = a.i - b.i;
        if (dx === 1) {
            a.walls[3] = false;
            b.walls[1] = false;
        } else if (dx === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }

        const dy = a.j - b.j;
        if (dy === 1) {
            a.walls[0] = false;
            b.walls[2] = false;
        } else if (dy === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }


    let stack = [grid[0]]
    let counter = 0;

    while (stack.length > 0) {
        let current = stack.pop();
        current.visited = true;

        while (current){
            let next = checkNeighbors(current);
            if (next) {
                next.visited = true;
                next.count = counter ++;
                stack.push(current);
                removeWalls(current, next);
            }
            current = next
        }
    }

    // 打開起點跟終點
    // grid[index(0, 0)].walls[3] = false;
    grid[index(0, 0)].backgroundColor = "yellow";
    // grid[index(cols - 1, rows - 1)].walls[1] = false;
    grid[index(cols - 1, rows - 1)].backgroundColor = "yellow";

    return grid;
}





