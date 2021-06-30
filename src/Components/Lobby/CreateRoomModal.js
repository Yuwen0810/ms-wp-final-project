import {useEffect} from "react";

import { Modal, Form, Input } from "antd";

// Apollo & GraphQL
import {useMutation} from "@apollo/client";
import {MUTATION_CREATE_ROOM} from "../../graphql";

// utils
import {getDefaultRoomNameRandom} from "../../utils/getDefaultRoomNameRandom";


const CreateRoomModal = ({me, setRoomID, visible, setModalVisible}) => {

    const [form] = Form.useForm();

    // [GraphQL] 新增 GameRoom 到 DB
    const [createRoom] = useMutation(MUTATION_CREATE_ROOM);

    // 剛進入 Modal 時，載入預設的房間名稱
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                "Room Name": getDefaultRoomNameRandom(),
            });
        }
    }, [visible])


    // 點選 Create Button 時呼叫
    async function handleCreateGameRoom() {
        const roomName = await form.validateFields().then(res => res["Room Name"])  // 取得 Form 上的 roomName

        // [GraphQL] 新增房間、紀錄 Server 生成的 RoomID
        const roomID = await createRoom({
            variables: {
                hostName: me,
                roomName: roomName,
            }
        }).then(res => res.data.createGameRoom)

        setRoomID(roomID);
        setModalVisible(false);
    }

    /* --------------------------------------------- */
    /*                    Render                     */
    /* --------------------------------------------- */
    return (
        <Modal
            visible={visible}
            title="Create a new Game room"
            okText="Create" cancelText="Cancel"
            onCancel={() => {
                setModalVisible(false);
            }}
            keyboard={true}
            onOk={handleCreateGameRoom}
        >
            <Form form={form} layout="vertical"
                  name="form_in_modal">
                <Form.Item
                    name="Room Name" label="Room Name"
                    rules={[{
                        required: true,
                        message: "Error: Please enter the name of the person to chat!",
                    },]}
                >
                <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default CreateRoomModal;
