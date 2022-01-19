import { SyncOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Card, message, Space, Table, Button } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import audit_plan from '../../../../../api/audit_plan';
import { ResponseCode } from '../../../../../data/common';
import EmitterKey from '../../../../../data/EmitterKey';
import useTable from '../../../../../hooks/useTable';
import EventEmitter from '../../../../../utils/EventEmitter';

const SqlPool: React.FC<{ auditPlanName: string }> = (props) => {
  const { t } = useTranslation();

  const { pagination, tableChange } = useTable();

  const [columns, setColumns] = useState<ColumnType<any>[]>([]);

  const { loading, data, refresh } = useRequest(
    () =>
      audit_plan.getAuditPlanSQLsV2({
        audit_plan_name: props.auditPlanName,
        page_index: pagination.pageIndex,
        page_size: pagination.pageSize,
      }),
    {
      ready: !!props.auditPlanName,
      refreshDeps: [props.auditPlanName, pagination],
      formatResult(res) {
        return {
          head: res.data.data?.head,
          list: res.data.data?.rows,
          total: res.data.total_nums,
        };
      },
      onSuccess: (res) => {
        const { head = [] } = res;
        setColumns(
          head.map((item: any) => ({
            title: item.desc,
            dataIndex: item.name,
          }))
        );
      },
    }
  );

  const triggerAudit = () => {
    const hide = message.loading(t('auditPlan.sqlPool.action.loading'), 0);
    audit_plan
      .triggerAuditPlanV1({ audit_plan_name: props.auditPlanName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('auditPlan.sqlPool.action.triggerSuccess'));
          EventEmitter.emit(EmitterKey.Refresh_Audit_Plan_Record);
        }
      })
      .finally(() => {
        hide();
      });
  };

  return (
    <Card
      title={
        <Space>
          {t('auditPlan.sqlPool.title')}
          <Button onClick={refresh}>
            <SyncOutlined spin={loading} />
          </Button>
        </Space>
      }
      extra={[
        <Button key="trigger" type="primary" onClick={triggerAudit}>
          {t('auditPlan.sqlPool.action.trigger')}
        </Button>,
      ]}
    >
      <Table
        pagination={{
          total: data?.total ?? 0,
          showSizeChanger: true,
        }}
        dataSource={data?.list ?? []}
        columns={columns}
        loading={loading}
        onChange={tableChange}
      />
    </Card>
  );
};

export default SqlPool;
