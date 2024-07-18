import React, { useState } from 'react';
import { Select, Checkbox } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const TableFilterComponent = ({ fields }) => {
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [selectOpt, setSelectOpt] = useState([]);

  const handleCheckboxChange = (field) => {
    setSelectedFilter((prevFilter) => {
      if (prevFilter && prevFilter.some((filter) => filter.field === field?.dataIndex)) {
        // 如果已经选中，将其从数组中移除
        const list = prevFilter.filter((filter) => filter.field !== field?.dataIndex)

        if (list?.length > 0) {
          const fieldArray = list?.map((item) => item.field);
          console.log(fieldArray, '8888888')
          setSelectOpt(fieldArray);
        }

        return list;
      } else {
        // 如果未选中，将其添加到数组中
        console.log([...prevFilter, { field: field?.dataIndex, order: '' }], '选择的数据')
        const list = [...prevFilter, { field: field?.dataIndex, order: '' }]

        if (list?.length > 0) {
          const fieldArray = list?.map((item) => item.field);
          console.log(fieldArray, '8888888')
          setSelectOpt(fieldArray);
        }

        return list;
      }
    });
  };

  const handleOrderSelection = (field, order) => {
    setSelectedFilter((prevFilter) => {
      const updatedFilter = prevFilter.map((item) => {
        if (item.field === field) {
          return { ...item, order };
        }
        return item;
      });
      return updatedFilter;
    });
  };

  const getOrderColor = (field: any, order: any) => {
    const selectedFilterItem = selectedFilter?.find((filter) => filter.field === field && filter.order === order);
    if (selectedFilterItem) {
      return 'blue';
    }
    return '#ccc';
  };

  const changeOption = (value: any) => {
    console.log(value, '6666')
   
    const filteredValue = value.filter((field) =>
      selectedFilter.some((filter) => filter.field === field)
    );
    setSelectOpt(value);
    setSelectedFilter(filteredValue);
  };

  return (
    <Select
      mode="multiple"
      value={selectOpt}
      key={'dataIndex'}
      onChange={changeOption}
      style={{ width: 200 }}
      dropdownRender={() => (
        <div>
          {fields.map((filter) => (
            <span
              key={filter.dataIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 10px',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {console.log(selectedFilter, '查看')}
                <Checkbox
                  checked={selectedFilter?.some((selected) => selected.field === filter.dataIndex)}
                  onChange={() => handleCheckboxChange(filter)}
                  style={{ color: selectedFilter.some((selected) => selected.field === filter.dataIndex) ? 'blue' : 'black' }}
                />
                {filter.title}
              </div>
              {selectedFilter.some((selected) => selected.field === filter.dataIndex) && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <CaretUpOutlined
                    style={{ marginLeft: 4, color: getOrderColor(filter.dataIndex, 'asc') }}
                    onClick={() => handleOrderSelection(filter.dataIndex, 'asc')}
                  />
                  <CaretDownOutlined
                    style={{ marginLeft: 4, color: getOrderColor(filter.dataIndex, 'desc') }}
                    onClick={() => handleOrderSelection(filter.dataIndex, 'desc')}
                  />
                </div>
              )}
            </span>
          ))}
        </div>
      )}
    />
  );
};

export default TableFilterComponent;