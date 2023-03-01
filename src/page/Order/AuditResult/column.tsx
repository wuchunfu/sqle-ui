import { Popconfirm, Space, Tag, Typography } from 'antd';
import moment from 'moment';
import {
  IAuditTaskSQLResV1,
  IGetWorkflowTasksItemV2,
  IMaintenanceTimeResV1,
} from '../../../api/common';
import {
  GetWorkflowTasksItemV2StatusEnum,
  WorkflowRecordResV2StatusEnum,
} from '../../../api/common.enum';
import {
  getAuditTaskSQLsV1FilterAuditStatusEnum,
  getAuditTaskSQLsV1FilterExecStatusEnum,
} from '../../../api/task/index.enum';
import AuditResultErrorMessage from '../../../components/AuditResultErrorMessage';
import EditText from '../../../components/EditText/EditText';
import EmptyBox from '../../../components/EmptyBox';
import {
  auditStatusDictionary,
  execStatusDictionary,
} from '../../../hooks/useStaticStatus/index.data';
import i18n from '../../../locale';
import { TableColumn } from '../../../types/common.type';
import { formatTime } from '../../../utils/Common';
import HighlightCode from '../../../utils/HighlightCode';
import { floatToPercent } from '../../../utils/Math';
import { checkTimeInWithMaintenanceTime } from '../Detail/OrderSteps/utils';
import InstanceTasksStatus from './InstanceTasksStatus';

export const orderAuditResultColumn = (
  updateSqlDescribe: (sqlNum: number, sqlDescribe: string) => void,
  clickAnalyze: (sqlNum: number) => void
): TableColumn<IAuditTaskSQLResV1, 'operator'> => {
  return [
    {
      dataIndex: 'number',
      title: () => i18n.t('audit.table.number'),
    },
    {
      dataIndex: 'audit_status',
      title: () => i18n.t('audit.table.auditStatus'),
      render: (status: getAuditTaskSQLsV1FilterAuditStatusEnum) => {
        return status ? i18n.t(auditStatusDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'audit_result',
      title: () => i18n.t('audit.table.auditResult'),
      render: (errorMessage) => {
        return <AuditResultErrorMessage resultErrorMessage={errorMessage} />;
      },
    },
    {
      dataIndex: 'exec_sql',
      title: () => i18n.t('audit.table.execSql'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'exec_status',
      title: () => i18n.t('audit.table.execStatus'),
      render: (status: getAuditTaskSQLsV1FilterExecStatusEnum) => {
        return status ? i18n.t(execStatusDictionary[status]) : '';
      },
    },
    {
      dataIndex: 'exec_result',
      title: () => i18n.t('audit.table.execResult'),
    },
    {
      dataIndex: 'rollback_sql',
      title: () => i18n.t('audit.table.rollback'),
      render: (sql?: string) => {
        if (!!sql) {
          return (
            <pre
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql),
              }}
              className="pre-warp-break-all"
            ></pre>
          );
        }
        return null;
      },
    },
    {
      dataIndex: 'description',
      title: () => i18n.t('audit.table.describe'),
      width: '200px',
      render: (description: string, record) => {
        return (
          <EditText
            editable={{
              autoSize: true,
              onEnd: (val) => {
                updateSqlDescribe(record.number ?? 0, val);
              },
            }}
          >
            {description}
          </EditText>
        );
      },
    },
    /* IFTRUE_isEE */
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      width: '70px',
      render: (_, record) => {
        return (
          <Typography.Link onClick={() => clickAnalyze(record.number ?? 0)}>
            {i18n.t('audit.table.analyze')}
          </Typography.Link>
        );
      },
    },
    /* FITRUE_isEE */
  ];
};

export const auditResultOverviewColumn: (
  sqlExecuteHandle: (taskId: string) => void,
  openScheduleModalAndSetCurrentTask: (record: IGetWorkflowTasksItemV2) => void,
  scheduleTimeHandle: (
    scheduleTime?: string | undefined,
    taskId?: string
  ) => Promise<void>,
  currentUserName: string,
  orderStatus?: WorkflowRecordResV2StatusEnum
) => TableColumn<IGetWorkflowTasksItemV2, 'operator'> = (
  sqlExecuteHandle,
  openScheduleModalAndSetCurrentTask,
  scheduleTimeHandle,
  currentUsername,
  orderStatus
) => {
  const unusableStatus = [
    WorkflowRecordResV2StatusEnum.rejected,
    WorkflowRecordResV2StatusEnum.canceled,
    WorkflowRecordResV2StatusEnum.finished,
  ];

  const enableSqlExecute = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum,
    maintenanceTime: IMaintenanceTimeResV1[] = []
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    if (maintenanceTime.length) {
      return checkTimeInWithMaintenanceTime(moment(), maintenanceTime);
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableSqlScheduleTime = (
    currentStepAssigneeUsernameList: string[] = [],
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum) ||
      !currentStepAssigneeUsernameList.includes(currentUsername)
    ) {
      return false;
    }

    return status === GetWorkflowTasksItemV2StatusEnum.wait_for_execution;
  };

  const enableCancelSqlScheduleTime = (
    status?: GetWorkflowTasksItemV2StatusEnum
  ) => {
    if (
      !status ||
      unusableStatus.includes(orderStatus as WorkflowRecordResV2StatusEnum)
    ) {
      return false;
    }
    return status === GetWorkflowTasksItemV2StatusEnum.exec_scheduled;
  };
  return [
    {
      dataIndex: 'instance_name',
      title: () => i18n.t('order.auditResultCollection.table.instanceName'),
    },
    {
      dataIndex: 'status',
      title: () => i18n.t('order.auditResultCollection.table.status'),
      render: (status: GetWorkflowTasksItemV2StatusEnum) => (
        <InstanceTasksStatus status={status} />
      ),
    },
    {
      dataIndex: 'task_pass_rate',
      title: () => i18n.t('order.auditResultCollection.table.passRate'),
      render: (rate: number = 0) => `${floatToPercent(rate)}%`,
    },
    {
      dataIndex: 'task_score',
      title: () => i18n.t('order.auditResultCollection.table.score'),
    },
    {
      dataIndex: 'current_step_assignee_user_name_list',
      title: () => i18n.t('order.auditResultCollection.table.assigneeUserName'),
      render: (names: string[] = []) =>
        names.map((v) => <Tag key={v}>{v}</Tag>),
    },
    {
      dataIndex: 'execution_user_name',
      title: () => i18n.t('order.auditResultCollection.table.executeUserName'),
    },
    {
      dataIndex: 'exec_start_time',
      title: () => i18n.t('order.auditResultCollection.table.execStartTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'exec_end_time',
      title: () => i18n.t('order.auditResultCollection.table.execEndTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'schedule_time',
      title: () =>
        i18n.t('order.auditResultCollection.table.scheduleExecuteTime'),
      render: (time) => {
        return formatTime(time);
      },
    },
    {
      dataIndex: 'operator',
      title: () => i18n.t('common.operate'),
      render: (_, record) => {
        const taskId = record.task_id?.toString() ?? '';
        return (
          <Space>
            <Popconfirm
              overlayClassName="popconfirm-small"
              placement="topRight"
              okText={i18n.t('common.ok')}
              disabled={
                !enableSqlExecute(
                  record.current_step_assignee_user_name_list,
                  record.status,
                  record.instance_maintenance_times
                )
              }
              title={i18n.t(
                'order.auditResultCollection.table.sqlExecuteConfirmTips'
              )}
              onConfirm={(e) => {
                e?.stopPropagation();
                sqlExecuteHandle(taskId);
              }}
              onCancel={(e) => {
                e?.stopPropagation();
              }}
            >
              <Typography.Link
                disabled={
                  !enableSqlExecute(
                    record.current_step_assignee_user_name_list,
                    record.status,
                    record.instance_maintenance_times
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {i18n.t('order.auditResultCollection.table.sqlExecute')}
              </Typography.Link>
            </Popconfirm>
            <EmptyBox
              if={
                record.status ===
                GetWorkflowTasksItemV2StatusEnum.exec_scheduled
              }
              defaultNode={
                <Typography.Link
                  disabled={
                    !enableSqlScheduleTime(
                      record.current_step_assignee_user_name_list,
                      record.status
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    openScheduleModalAndSetCurrentTask(record);
                  }}
                >
                  {i18n.t('order.auditResultCollection.table.scheduleTime')}
                </Typography.Link>
              }
            >
              <Typography.Link
                disabled={!enableCancelSqlScheduleTime(record.status)}
                onClick={(e) => {
                  e.stopPropagation();
                  scheduleTimeHandle(
                    undefined,
                    record.task_id?.toString() ?? ''
                  );
                }}
              >
                {i18n.t(
                  'order.auditResultCollection.table.cancelExecScheduled'
                )}
              </Typography.Link>
            </EmptyBox>
          </Space>
        );
      },
    },
  ];
};
