import { TableProps } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React from 'react';
import { Dictionary } from '../../types/common.type';
import { TablePagination, UseTableOption } from './index.type';

const useTable = <T = Dictionary>(option?: UseTableOption) => {
  const { defaultPageSize = 10, defaultPageIndex = 1, defaultFilterInfo = {} } =
    option ?? {};

  const [form] = useForm<T>();

  const submitFilter = React.useCallback(() => {
    const values = form.getFieldsValue();
    setFilterInfo(values);
  }, [form]);

  const resetFilter = React.useCallback(() => {
    form.resetFields();
    setFilterInfo({} as any);
  }, [form]);

  const [pagination, setPagination] = React.useState<TablePagination>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  });
  const [filterInfo, setFilterInfo] = React.useState<T>(
    defaultFilterInfo as any
  );

  const tableChange = React.useCallback<Required<TableProps<any>>['onChange']>(
    (newPagination) => {
      if (
        newPagination.current !== pagination.pageIndex ||
        newPagination.pageSize !== pagination.pageSize
      ) {
        setPagination({
          pageIndex: newPagination.current ?? defaultPageIndex,
          pageSize: newPagination.pageSize ?? defaultPageSize,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.pageIndex, pagination.pageSize]
  );

  return {
    filterForm: form,
    filterInfo,
    pagination,
    setPagination,
    setFilterInfo,
    submitFilter,
    resetFilter,
    tableChange,
  };
};

export default useTable;
