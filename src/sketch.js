function sketch(p5) {

    let cols, rows;
    const w = 40
    let grid = [];

    p5.setup = function() {
        p5.createCanvas(400, 400);
        cols = p5.floor(p5.width / w);
        rows = p5.floor(p5.height / w);

        for (let j = 0; j < rows; j++){
            for (let i = 0; i < cols; i++){
                let cell = new Cell(i, j);
                grid.push(cell);
            }
        }

    };

    p5.draw = function() {
        p5.background(50);
        for (let i = 0; i < grid.length; i++){
            grid[i].show()
        }
    };

    function Cell(i, j) {
        this.i = i;
        this.j = j;
        this.walls = [false, false, true, true];

        this.show = function() {
            let x = this.i * w;
            let y = this.j * w;
            p5.stroke(255);
            if (this.walls[0]) p5.line(x, y, x + w, y);
            if (this.walls[1]) p5.line(x + w, y, x + w, y + w);
            if (this.walls[2]) p5.line(x + w, y + w, x, y + w);
            if (this.walls[3]) p5.line(x, y + w, x, y);
            p5.noFill();
        }
    }


}

export default sketch;
