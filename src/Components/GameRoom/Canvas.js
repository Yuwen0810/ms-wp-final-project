import {Circle, Rect, Layer, Stage, Line, Group} from "react-konva";
import Cell from "./Cell";
import { Spin } from 'antd';

function Canvas({cols, rows, width, maze, teleportPosition, players, me, isFinished}) {

    // 將 players 拆成 me 跟 other
    // 目的：渲染時讓自己圖層在上面
    let otherInfo = []
    let myInfo;

    players.forEach(player => {
        if (player.name === me) {
            myInfo = player;
        } else {
            otherInfo.push(player);
        }
    })

    const sizeBias = 4  // 方形往內縮的 pixel 數（才不會跟迷宮線重疊）

    return (
        <>
            {maze.length === 0 ? (
                <Spin tip="Loading..." size="large"/>
            ) : (
                <Stage width={cols * width} height={rows * width}>
                    <Layer>
                        {/* 起點、終點 */}
                        <Rect x={0} y={0} height={width} width={width} fill={"yellow"}/>
                        <Rect x={(cols - 1) * width} y={(rows - 1) * width} height={width} width={width} fill={"yellow"}/>

                        {/* 傳送點 */}
                        {teleportPosition.map(({x1, y1, x2, y2, r, g, b}) => (
                            <Group key={`${x1}_${y1}`}>
                                <Rect x={x1 * width} y={y1 * width} height={width} width={width} fill={`rgb(${r},${g},${b})`}/>
                                <Rect x={x2 * width} y={y2 * width} height={width} width={width} fill={`rgb(${r},${g},${b})`}/>
                            </Group>
                        ))}

                        {/* 其他玩家 */}
                        {otherInfo.map(player => (
                            <Rect key={player.name} x={player.i * width + sizeBias/2} y={player.j * width + sizeBias/2} height={width - sizeBias} width={width - sizeBias} fill={"red"}/>
                        ))}

                        {/* 自己 */}
                        <Rect x={myInfo.i * width + sizeBias/2} y={myInfo.j * width + sizeBias/2} height={width - sizeBias} width={width - sizeBias} fill={"blue"}/>

                        {/* 如果結束，使畫面變灰 */}
                        {isFinished ? <Rect x={0} y={0} height={rows * width} width={cols * width} fill={"gray"} opacity={0.5}/> : <Line/>}
                    </Layer>
                    <Layer>
                        {/* 迷宮線 */}
                        {maze.map(args =>
                            <Cell
                                args={args}
                                w={width}
                                myInfo={myInfo}
                                key={`${args.i}_${args.j}`}
                            />
                        )}
                    </Layer>
                </Stage>
            )}
        </>
    )
}


export default Canvas

