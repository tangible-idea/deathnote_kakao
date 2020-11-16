import { Table, Button, Space } from 'antd';
import {useState} from 'react';

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

const DeathNoteGroup = ({parsedData}) => {

    console.log("DeathNoteGroup:",parsedData);

    const [tableState, setTableState] = useState({
        filteredInfo: null,
        sortedInfo: null,
    });

    const handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        setTableState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    const clearFilters = () => {
        setTableState({
            filteredInfo: null,
            sortedInfo: tableState.sortedInfo
        });
    };

    const clearAll = () => {
        setTableState({
            filteredInfo: null,
            sortedInfo: null,
        });
    };

    const setAgeSort = () => {
        setTableState({
            sortedInfo: {
                order: 'descend',
                columnKey: 'age',
            },
        });
    };

    ///////////////

    let { sortedInfo, filteredInfo } = tableState;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
        {
            title: '아이디',
            dataIndex: 'id',
            key: 'id',
            filteredValue: filteredInfo.name || null,
            sorter: (a, b) => a.name.length - b.name.length,
            sortOrder: sortedInfo.columnKey === 'id' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: '대상',
            dataIndex: 'target',
            key: 'target',
            sorter: (a, b) => a.target.length - b.target.length,
            sortOrder: sortedInfo.columnKey === 'target' && sortedInfo.order,
            ellipsis: true,
        },
        {
            title: '첫대화',
            dataIndex: 'firstchat',
            key: 'firstchat',
            filteredValue: filteredInfo.firstchat || null,
            onFilter: (value, record) => record.firstchat.includes(value),
            sorter: (a, b) => a.firstchat.length - b.firstchat.length,
            sortOrder: sortedInfo.columnKey === 'firstchat' && sortedInfo.order,
            ellipsis: true,
        },{
            title: '마지막대화',
            dataIndex: 'latestchat',
            key: 'latestchat',
            filteredValue: filteredInfo.latestchat || null,
            onFilter: (value, record) => record.latestchat.includes(value),
            sorter: (a, b) => a.latestchat.length - b.latestchat.length,
            sortOrder: sortedInfo.columnKey === 'latestchat' && sortedInfo.order,
            ellipsis: true,
        },{
            title: '채팅수',
            dataIndex: 'bubblecount',
            key: 'bubblecount',
            filteredValue: filteredInfo.bubblecount || null,
            onFilter: (value, record) => record.bubblecount.includes(value),
            sorter: (a, b) => a.bubblecount.length - b.bubblecount.length,
            sortOrder: sortedInfo.columnKey === 'bubblecount' && sortedInfo.order,
            ellipsis: true,
        },
        ,{
            title: '글자수',
            dataIndex: 'textcount',
            key: 'textcount',
            filteredValue: filteredInfo.textcount || null,
            onFilter: (value, record) => record.textcount.includes(value),
            sorter: (a, b) => a.textcount.length - b.textcount.length,
            sortOrder: sortedInfo.columnKey === 'textcount' && sortedInfo.order,
            ellipsis: true,
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={setAgeSort}>Sort age</Button>
                <Button onClick={clearFilters}>Clear filters</Button>
                <Button onClick={clearAll}>Clear filters and sorters</Button>
            </Space>
            <Table
                bordered
                rowClassName={() => 'editable-row'}
                pagination={false}
                columns={columns}
                dataSource={data}
                onChange={handleChange}
            />
        </>
    );
}

export default DeathNoteGroup;