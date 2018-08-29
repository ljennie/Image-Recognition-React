import React from 'react';
import $ from 'jquery';
import { Modal, Button, message } from 'antd';
import {WrapperCreateForm} from "./CreatePostForm";
import {API_ROOT, AUTH_PREFIX, POS_KEY, TOKEN_KEY, LOC_SHAKE} from "../constance";

export class CreatePostButton extends React.Component {
    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        // collect values //看发出去的post是不是符合要求
        this.form.validateFields((err, values) => {//enhance form & value 都会传进来
            if(!err) {
                // send request
                const { lat, lon} = JSON.parse(localStorage.getItem(POS_KEY));
                const formData = new FormData();
                formData.set('lat', lat + Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('lon', lon +- Math.random() * LOC_SHAKE * 2 - LOC_SHAKE);
                formData.set('message', values.message);
                //debugger; 从console里找你想要关于image的东西和location
                formData.set('image', values.image[0].originFileObj);
                $.ajax({
                    url: `${API_ROOT}/post`,
                    method: 'POST',
                    data: formData,
                    headers: {
                        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                    },
                    processData: false,
                    contentType: false,
                    dataType: 'text',
                }).then(() => {
                    message.success('Create post succeed!');
                    this.form.resetFields();//当文件上传后title不见了
                    this.setState({ visible: false, confirmLoading: false });//当照片上传后照片不见了，那个转圈圈的不在了
                    this.props.loadNearbyPost();
                }, (response) => {
                    message.error('Create post failed!');
                    this.setState({ confirmLoading: false });
                }).catch((e) => {
                    console.log(e);
                });
            }
        });

        // loadNearbyPost
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    }

    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    }

    saveFormRef = (formInstance) => {
        this.form = formInstance;
    }

    render() {
        const { visible, confirmLoading } = this.state;
        //const visible = this.state.visible;
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal title="Create New Post"
                       visible={visible}
                       onOk={this.handleOk}
                       okText="Create"
                       confirmLoading={confirmLoading}
                       onCancel={this.handleCancel}
                >
                   <WrapperCreateForm ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }

}

/* CreatePostButton: {
        WrappedCreatePostForm: {
            CreatePostForm: {
                this.props.form; //这个form是父WrappedCreatePostForm里面的form传给子CreatePostForm
            }
        }
    }

*/

/*
const enhance = Form.create();
export const WrappedCreatePostForm = Form.create()(CreatePostForm);

function enhance(CreatePostForm) {
    return class Wra[pedCreatePostForm extends React.Component {
        render() {
            return (
                <CreatePostForm form={this}/>//自己的reference 作为一个props form,传给了CreatePostForm
            )
        }
    }
}

 */