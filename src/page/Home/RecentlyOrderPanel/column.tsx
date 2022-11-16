import i18n from 'i18next';
import { Link } from 'react-router-dom';
import { IWorkflowDetailResV1 } from '../../../api/common';
import OrderStatusTag from '../../../components/OrderStatusTag';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';

export const customColumn: () => TableColumn<IWorkflowDetailResV1> = () => {
  return [
    {
      dataIndex: 'workflow_name',
      title: () => i18n.t('order.order.name'),
      render: (text) => {
        return <Link to={text ? `/order/${text}` : '/order'}>{text}</Link>;
      },
      width: 'auto',
    },
    {
      dataIndex: 'project_name',
      title: () => i18n.t('projectManage.projectForm.projectName'),
      width: 'auto',
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('order.order.desc'),
      width: 'auto',
    },
    {
      dataIndex: 'create_time',
      title: () => i18n.t('order.order.createTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'status',
      title: () => i18n.t('order.order.status'),
      render: (status) => {
        return <OrderStatusTag status={status} />;
      },
      width: 'auto',
    },
  ];
};
