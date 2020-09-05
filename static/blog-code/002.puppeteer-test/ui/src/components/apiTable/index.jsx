import React, { useMemo, useCallback } from 'react';
import { Table, Space, Button } from 'antd';
import Zmage from 'react-zmage'
import ApiListContainer from '../../stores';
import { getApiErrorScreenshot, backEndURL } from '../../utils';


function ApiTable() {
  const { apiList, setApiList } = ApiListContainer.useContainer();

  const getErrorImg = useCallback(async (record) => {
    const { pageUrl, apiUrl } = record;
    const res = await getApiErrorScreenshot({ pageUrl, apiUrl, cookie: window.sessionStorage.getItem('_cookie') });
    setApiList(oldList => oldList.map(item => {
      if (item.apiUrl === apiUrl) {
        return { ...item, errorImg: `${backEndURL}/${res.data.errorImg}` };
      } else {
        return { ...item }
      }
    }));
  }, [setApiList]);

  const columns = useMemo(() => [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: 'api',
      dataIndex: 'apiUrl',
      key: 'apiUrl',
      render: text => <a style={{
        wordWrap: 'break-word',
        wordBreak: 'break-word'
      }} href={text}>{text}</a>,
      width: '50%',
    },
    {
      title: 'method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '耗时(ms)',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '托底检测',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {
            record.errorImg ? (<Zmage style={{ height: 60 }} src={record.errorImg} />) : (<Button type="primary" onClick={() => getErrorImg(record)}>托底</Button>)
          }
        </Space>
      ),
    },
  ], [getErrorImg]);

  return (
    <Table columns={columns} dataSource={apiList} pagination={false} />
  );
}

export default ApiTable;
