import { List, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function sortItem(x,y){
    return ((x.ranking > y.ranking)?1:-1);
}

export default function GameRoomPlayers({players,me}) {
    let tempPlayer = players.map(x => x);
    tempPlayer = tempPlayer.sort((a,b) => parseInt(a.ranking) - parseInt(b.ranking));


    return (
        <>
            <h3 className="GameRoom-SideBarTitle">Players</h3>

            <List
                style={{ width: "90%", margin: "5%"}}
                itemLayout="horizontal"
                dataSource={tempPlayer}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={item.name == me ? <Avatar icon={<UserOutlined />} style={{color:'red'}}/> :<Avatar icon={<UserOutlined />}/>}
                            title={<a>{item.name}</a>}
                            description={item.finished ? item.ranking : "X"}
                        />
                    </List.Item>
                )}
            />,

        </>
    )
}


