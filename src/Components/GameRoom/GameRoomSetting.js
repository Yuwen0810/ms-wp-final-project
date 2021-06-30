import {Slider, Row, Col, Button} from 'antd';
import {useState} from "react";


export default function GameRoomSetting({args, isHost, handleChangeSetting, isGameEnd, setIsGameEnd, initGameRoom, roomID}) {

    const {cols, rows, teleportCycle, width, setWidth, isStart} = args

    // Temp 讓 host 更新設定時顯示不出線問題
    const [colsTemp, setColsTemp] = useState(cols);
    const [rowsTemp, setRowsTemp] = useState(rows);
    const [teleportCycleTemp, setTeleportCycleTemp] = useState(teleportCycle);

    const MAX = 50, MIN = 4;   // COL 與 ROW 的範圍

    // 『傳送點生成時間 Slider』 的控制單位
    const teleportStep = 5;

    // Antd 佈局相關 (COL -> 8:12:4)
    const titleSpan = 8;
    const sliderSpan = 12;
    const valueSpan = 4;

    return (
        <>
            <h3 className="GameRoom-SideBarTitle">Setting</h3>
            {/* Setting - COls */}
            <Row>
                <Col span={titleSpan}>
                    <p className="GameRoom-SliderTitle">Cols</p>
                </Col>
                <Col span={sliderSpan}>
                    <Slider
                        disabled={!isHost || isStart}
                        min={MIN}
                        max={MAX}
                        onChange={(value) => {setColsTemp(value)}}
                        onAfterChange={(value) => {handleChangeSetting("cols", value)}}
                        value={isHost ? colsTemp : cols}
                    />
                </Col>
                <Col span={valueSpan}>
                    <p className="GameRoom-SliderLabel">{cols}</p>
                </Col>
            </Row>

            {/* Setting - Rows */}
            <Row>
                <Col span={titleSpan}>
                    <p className="GameRoom-SliderTitle">Rows</p>
                </Col>
                <Col span={sliderSpan}>
                    <Slider
                        disabled={!isHost || isStart}
                        min={MIN}
                        max={MAX}
                        onChange={(value) => {setRowsTemp(value)}}
                        onAfterChange={(value) => {handleChangeSetting("rows", value)}}
                        value={isHost ? rowsTemp : rows}
                    />
                </Col>
                <Col span={valueSpan}>
                    <p className="GameRoom-SliderLabel">{rows}</p>
                </Col>
            </Row>

            {/* Setting - Teleport */}
            <Row>
                <Col span={titleSpan}>
                    <p className="GameRoom-SliderTitle">TP (s)</p>
                </Col>
                <Col span={sliderSpan}>
                    <Slider
                        disabled={!isHost || isStart}
                        min={0}
                        max={100}
                        step={teleportStep}
                        onChange={(value) => {setTeleportCycleTemp(value)}}
                        onAfterChange={(value) => {handleChangeSetting("teleportCycle", value)}}
                        value={isHost ? teleportCycleTemp : teleportCycle}
                    />
                </Col>
                <Col span={valueSpan}>
                    <p className="GameRoom-SliderLabel">{teleportCycle}</p>
                </Col>
            </Row>

            {/* Setting - Scale */}
            <Row>
                <Col span={titleSpan}>
                    <p className="GameRoom-SliderTitle">Scale</p>
                </Col>
                <Col span={sliderSpan}>
                    <Slider
                        min={10}
                        max={50}
                        onChange={(value) => {setWidth(value)}}
                        value={typeof cols === 'number' ? width : 0}
                    />
                </Col>
                <Col span={valueSpan}>
                    <p className="GameRoom-SliderLabel">{width}</p>
                </Col>
            </Row>

            {/* Button - Reset */}
            <Row>
                <Col span={24}>
                    <div className={"GameRoom-SliderTitle"}>
                        <Button
                            size={"small"}
                            type="primary"
                            disabled={!(isHost && isStart && isGameEnd)}
                            onClick={() => {
                                initGameRoom({variables: {roomID: roomID}})
                                setIsGameEnd(false);
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}

