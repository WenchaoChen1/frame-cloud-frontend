import { useState } from 'react';
import { Select, Checkbox } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const TableFilterComponent = ({ fields }) => {
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [selectOpt, setSelectOpt] = useState([]);

  // 复选框勾选内容
  const handleCheckboxChange = (field) => {
    setSelectedFilter((prevFilter) => {
      if (prevFilter && prevFilter.some((filter) => filter.field === field?.dataIndex)) {
        // 如果已经选中，将其从数组中移除
        const list = prevFilter.filter((filter) => filter.field !== field?.dataIndex)

        const fieldArray = list?.map((item) => item.field);
        setSelectOpt(fieldArray);
        
        return list;
      } else {
        // 如果未选中，将其添加到数组中
        const list = [...prevFilter, { field: field?.dataIndex, order: '' }]
        if (list?.length > 0) {
          const fieldArray = list?.map((item) => item.field);
          setSelectOpt(fieldArray);
        }
        return list;
      }
    });
  };

  // 点击排序按钮的功能，对应数据存储
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

  // 自定义下拉框内容展示：排序箭头上升下降功能的按钮颜色
  const getOrderColor = (field: any, order: any) => {
    const selectedFilterItem = selectedFilter?.find((filter) => filter.field === field && filter.order === order);
    if (selectedFilterItem) {
      return 'blue';
    }
    return '#ccc';
  };

  // Select 选择框删除
  const changeOption = (value: any) => {
    const filteredValue = selectedFilter.filter((field) =>
      value.some((filter) => field.field === filter)
    );
    setSelectOpt(value);
    setSelectedFilter(value?.length > 0? filteredValue : []);
  };

  return (
    <Select
      mode="multiple"
      value={selectOpt}
      key={'dataIndex'}
      allowClear
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