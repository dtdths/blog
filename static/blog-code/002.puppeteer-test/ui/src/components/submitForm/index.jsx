import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { getAllApiByUrl, uuid, backEndURL } from '../../utils';
import ApiListContainer from '../../stores';
const { TextArea } = Input;

const layout = {
  labelCol: {
    span: 1,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const SubmitForm = () => {
  const [form] = Form.useForm();
  const { setApiList } = ApiListContainer.useContainer();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    window.sessionStorage.setItem('_cookie', values.cookie);
    try {
      const res = await getAllApiByUrl(values);
      setApiList(res?.data?.apiList?.map(item => ({
        ...item,
        key: uuid(),
        time: item.timeEnd - item.timeStart
      })));
      console.log({pageImg: `${backEndURL}/${res.data.pageImg}`})
    } catch(e) {
      message.error(e?.error || 'error');
      console.log(e)
    }
    setLoading(false);
    
  };


  return (
    <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
      <Form.Item
        name="pageUrl"
        label="页面url"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="cookie"
        label="cookie"
        initialValue={window.sessionStorage.getItem('_cookie')}
      >
        <TextArea />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType='submit' loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SubmitForm;