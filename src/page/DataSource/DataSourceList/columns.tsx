import { DownOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Menu, Popconfirm, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { IInstanceResV1 } from '../../../api/common';
import EmptyBox from '../../../components/EmptyBox';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { timeAddZero } from '../../../utils/Common';

export const dataSourceColumns = (
  deleteDatabase: (instanceName: string) => void,
  testDatabaseConnection: (instanceName: string) => void,
  projectName: string,
  actionPermission: boolean
): TableColumn<IInstanceResV1, 'operate' | 'address' | 'connect'> => {
  return [
    {
      dataIndex: 'instance_name',
      title: () => i18n.t('dataSource.databaseList.instanceName'),
    },
    {
      dataIndex: 'address',
      title: () => i18n.t('dataSource.databaseList.address'),
      render(_, record) {
        return `${record.db_host}:${record.db_port}`;
      },
    },
    {
      dataIndex: 'desc',
      title: () => i18n.t('dataSource.databaseList.describe'),
    },
    {
      dataIndex: 'db_type',
      title: () => i18n.t('dataSource.databaseList.type'),
    },
    {
      dataIndex: 'rule_template_name',
      title: () => i18n.t('dataSource.databaseList.ruleTemplate'),
    },
    {
      dataIndex: 'maintenance_times',
      title: () => i18n.t('dataSource.databaseList.maintenanceTime'),
      render(value: IInstanceResV1['maintenance_times']) {
        return value?.map((t, i) => (
          <Tag key={i}>
            {timeAddZero(t.maintenance_start_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_start_time?.minute ?? 0)} -
            {timeAddZero(t.maintenance_stop_time?.hour ?? 0)}:
            {timeAddZero(t.maintenance_stop_time?.minute ?? 0)}
          </Tag>
        ));
      },
    },
    {
      dataIndex: 'operate',
      title: i18n.t('common.operate'),
      width: actionPermission ? 180 : 40,
      render: (_, record) => {
        return (
          <>
            <EmptyBox if={actionPermission}>
              <Link
                to={`/project/${projectName}/data/update/${record.instance_name}`}
              >
                <Typography.Link>{i18n.t('common.edit')}</Typography.Link>
              </Link>
              <Divider type="vertical" />
              <Popconfirm
                title={i18n.t('dataSource.deleteDatabase.confirmMessage', {
                  name: record.instance_name,
                })}
                onConfirm={deleteDatabase.bind(
                  null,
                  record.instance_name ?? ''
                )}
              >
                <Typography.Link type="danger">
                  {i18n.t('common.delete')}
                </Typography.Link>
              </Popconfirm>
              <Divider type="vertical" />
            </EmptyBox>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="test-connection"
                    onClick={testDatabaseConnection.bind(
                      null,
                      record.instance_name ?? ''
                    )}
                  >
                    {i18n.t('dataSource.dataSourceForm.testDatabaseConnection')}
                  </Menu.Item>
                </Menu>
              }
            >
              <Typography.Link>
                {i18n.t('common.more')}
                <DownOutlined />
              </Typography.Link>
            </Dropdown>
          </>
        );
      },
    },
  ];
};
