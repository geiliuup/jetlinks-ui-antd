import React, { useEffect, useState } from "react";
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";
import { Input, Modal, Select } from "antd";
import { ConnectState } from "@/models/connect";
import { connect } from "dva";
import { Dispatch } from "redux";
import apis from "@/services";
import { DeviceProduct } from "../../product/data";
import { DeviceInstance } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<DeviceInstance>;
}

interface State {
    productList: DeviceProduct[];
}
const Save: React.FC<Props> = (props) => {
    const initState: State = {
        productList: [],
    }
    const [productList, setProductList] = useState(initState.productList);
    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            props.save(fileValue);
        })
    }

    useEffect(() => {
        //获取下拉框数据
        apis.deviceProdcut.queryNoPagin().then(response => {
            setProductList(response.result);
        });
    }, []);

    console.log(props.data.id, 'rwer');
    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}设备实例`}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { submitData() }}
            onCancel={() => props.close()}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item
                    key="id"
                    label="设备id"
                >
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: props.data.id
                    })(<Input placeholder="请输入设备名称" disabled={props.data.id ? true : false} />)}
                </Form.Item>
                <Form.Item
                    key="name"
                    label="设备名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: props.data.name
                    })(<Input placeholder="请输入设备名称" />)}
                </Form.Item>
                <Form.Item
                    key="productId"
                    label="设备型号"
                >
                    {getFieldDecorator('productId', {
                        rules: [{ required: true }],
                        initialValue: props.data.productId
                    })(
                        <Select placeholder="请输入设备型号" >
                            {(productList || []).map(item => (
                                <Select.Option key={JSON.stringify({ productId: item.id, productName: item.name })}>{item.name}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    key="describe"
                    label="说明"
                >
                    {getFieldDecorator('describe', {
                        initialValue: props.data.describe
                    })(<Input.TextArea rows={4} placeholder="请输入至少五个字符" />)}
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default connect(({ deviceProduct, loading }: ConnectState) => ({
    deviceProduct,
    loading,
}))(Form.create<Props>()(Save));
