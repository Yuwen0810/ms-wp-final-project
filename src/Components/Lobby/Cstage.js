
import "../../App.css";
import {Circle, Rect, Layer, Stage, Line, Group} from "react-konva";
import Cell from "./Cell";

function stage({maze}) {

    return (
        <Stage width={300} height={300}>
            <Layer>
                {maze.map(args =>
                    <Cell
                        args={args}
                        w={30}
                        key={`${args.i}_${args.j}`}
                    />
                )}
            </Layer>

            </Stage>
    )
}


export default stage;


