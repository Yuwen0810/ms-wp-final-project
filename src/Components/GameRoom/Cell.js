import {Line, Group} from "react-konva";

function Cell({args, w}) {

    const {i, j, walls} = args;

    // 四條鞭的畫法
    const directions = [
        [0, 0, w, 0],   // up
        [w, 0, w, w],   // right
        [w, w, 0, w],   // down
        [0, w, 0, 0],   // left
    ]

    return (
        <Group>
            {/* 遍歷四個牆，為 True 就畫上線 */}
            {walls.map((isOpen, idx) => {
                if (isOpen) {
                    return <Line key={`${i}_${j}_${idx}`} x={i*w} y={j*w} points={directions[idx]} stroke={"black"} strokeWidth={1}/>
                }
            })}

        </Group>
    )
}


export default Cell;


