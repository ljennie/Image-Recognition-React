import React from 'react';
import { Form, Input, Button, message } from 'antd';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import {API_ROOT} from "../constance";

const FormItem = Form.Item;


class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                $.ajax({
                    //API_ROOT + '/signup'
                    url: `${API_ROOT}/signup`,
                    method: 'POST',
                    data: JSON.stringify({//把json变成string
                        username: values.username,
                        password: values.password,
                    })
                }).then((response) => {
                    message.success(response);
                    this.props.history.push('/login');
                }, (response) => {
                    message.error(response.responseText);
                }).catch((e) => {
                    console.log(e);
                });
            }
        });
    }
    // promise:
    // 1. new with behavior function
    // 2. run time call behavior function
    // const promise = new Promise((resolve, reject) => {
    //      resolve(1);
    //      setTimeout(() => {
    //          resolve(1);
    //  }, 3000)等了三秒钟后显示resolved with 1
    //
    // });
    // promise.then((v) => {
    //      console.log('resolved with ', v);
    // ), (v) => {
    //      console.log('rejected with ', v);
    // });
    // 这个方法并不常用


    // $.ajax = function(options) {
    // const promise = new Promise((resolve, reject) => {
    //     xhr.open(options.method, options.url);
    //     xhr.onload = function() {
    //      if (xhr.status === 200) {
    //              resolve(xhr.data);
    //      } else {
    //              reject(xhr.data);
    //      }
    //     }
    //     xhr.send(options.data);
    //  });
    //  return promise;
    // }

    // const promise = $.ajax ({
    //  url: '',
    //  method: 'POST',
    //  data: {}
    // });
    //
    // promise.then((response) => {
    //      return $.ajax(...);
    //      console.log(response);
    // }).catch((e) => {
    // }).then((v) => {
    // })

    // function timeout() {
    //      const promise = new Promise((resolve, reject) => {
    //          setTimeout(() => {
    //              resolve(1);
    //          }, 3000);
    //      });
    //      return promise;
    // }
    // const p1 = timeout().then((v) => {
    //      console.log('resolved with ', v);
    //      //return timeout();
    //      throw new Error("my error");
    // }, (v) => {
    //      console.log('rejected with ', v);
    // }).catch((e) => {
    //      console.log(e);
    // }
    // .then((v) => {
    //      console.log('resolve with ', v);
    //      return timeout();
    // }, (v) => {
    //      console.log('rejected with ', v);
    // }


    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };


        return (
            <Form onSubmit={this.handleSubmit} className="register-form">

                <FormItem
                    {...formItemLayout}
                    label="UserName"
                >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!'}],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Password"
                >
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: this.validateToNextPassword,
                        }],
                    })(
                        <Input type="password" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Confirm Password"
                >
                    {getFieldDecorator('confirm', {
                        rules: [{
                            required: true, message: 'Please confirm your password!',
                        }, {
                            validator: this.compareToFirstPassword,
                        }],
                    })(
                        <Input type="password" onBlur={this.handleConfirmBlur} />
                    )}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">Register</Button>
                    <p>I already have an account, go back to <Link to="/login">login</Link></p>
                </FormItem>
            </Form>
        );
    }
}

export const Register = Form.create()(RegistrationForm);
//Form.create()返回的是一个function， Register 是 RegistrationForm的加强版
//返回自动校验的register from

