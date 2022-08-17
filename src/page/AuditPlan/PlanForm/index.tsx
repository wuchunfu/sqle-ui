import { useBoolean } from 'ahooks';
import { Button, Form, Input, Select, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IAuditPlanParamResV1 } from '../../../api/common';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import CronInput from '../../../components/CronInput';
import EmptyBox from '../../../components/EmptyBox';
import { PageBigFormLayout } from '../../../data/common';
import EmitterKey from '../../../data/EmitterKey';
import { checkCron } from '../../../hooks/useCron/cron.tool';
import useRuleTemplate from '../../../hooks/useRuleTemplate';
import EventEmitter from '../../../utils/EventEmitter';
import { nameRule } from '../../../utils/FormRule';
import { AuditTaskType } from './AuditTaskType';
import { DataSource } from './DataSource';
import { PlanFormField, PlanFormProps } from './index.type';

const PlanForm: React.FC<PlanFormProps> = (props) => {
  const { t } = useTranslation();

  const [form] = useForm<PlanFormField>();

  const [dbType, setDbType] = useState('');
  const [dataSource, setDataSource] = useState('');

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const [asyncParams, setAsyncParams] = useState<
    IAuditPlanParamResV1[] | undefined
  >([]);

  const { mergeFromValueIntoParams } = useAsyncParams();
  const {
    generateRuleTemplateSelectOption,
    loading: getRuleTemplateLoading,
    updateRuleTemplateList,
  } = useRuleTemplate();

  const submit = (values: PlanFormField) => {
    if (values.params && asyncParams) {
      const params = values.params;
      delete values.params;
      values.asyncParams = mergeFromValueIntoParams(params, asyncParams);
    }
    startSubmit();
    props.submit(values).finally(() => {
      submitFinish();
    });
  };

  const resetForm = () => {
    setDataSource('');
    if (!!props.defaultValue) {
      form.resetFields(['databaseName', 'cron', 'schema']);
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    if (props.defaultValue) {
      form.setFieldsValue({
        name: props.defaultValue.audit_plan_name,
        databaseName: props.defaultValue.audit_plan_instance_name,
        schema: props.defaultValue.audit_plan_instance_database,
        cron: props.defaultValue.audit_plan_cron,
        dbType: props.defaultValue.audit_plan_db_type,
        ruleTemplateName: props.defaultValue.rule_template_name,
      });
      if (!!props.defaultValue.audit_plan_instance_name) {
        setDataSource(props.defaultValue.audit_plan_instance_name);
      }
      if (!!props.defaultValue.audit_plan_db_type) {
        setDbType(props.defaultValue.audit_plan_db_type);
      }
    }
    updateRuleTemplateList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultValue]);

  useEffect(() => {
    const reset = () => {
      resetForm();
    };
    EventEmitter.subscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    return () => {
      EventEmitter.unsubscribe(EmitterKey.Rest_Audit_Plan_Form, reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form {...PageBigFormLayout} form={form} onFinish={submit}>
      <Form.Item
        label={t('auditPlan.planForm.name')}
        name="name"
        rules={[
          {
            required: true,
          },
          ...nameRule(),
        ]}
      >
        <Input
          disabled={!!props.defaultValue}
          placeholder={t('common.form.placeholder.input')}
        />
      </Form.Item>
      <DataSource
        dataSource={dataSource}
        form={form}
        dataSourceChange={setDataSource}
        dbTypeChange={setDbType}
        defaultValue={props.defaultValue}
      />
      <AuditTaskType
        dbType={dbType}
        form={form}
        updateCurrentTypeParams={setAsyncParams}
        defaultValue={props.defaultValue}
      />

      <Form.Item
        hidden={!dbType}
        label={t('auditPlan.planForm.ruleTemplateName')}
        name="ruleTemplateName"
        tooltip={t('auditPlan.planForm.ruleTemplateNameTips')}
      >
        <Select>
          {!getRuleTemplateLoading && generateRuleTemplateSelectOption(dbType)}
        </Select>
      </Form.Item>

      <Form.Item
        label={t('auditPlan.planForm.cron')}
        name="cron"
        initialValue="0 0 * * *"
        rules={[
          {
            required: true,
          },
          {
            validator(_, value) {
              const error = checkCron(value);
              if (error === '') {
                return Promise.resolve();
              }
              return Promise.reject(t(error));
            },
          },
        ]}
      >
        <CronInput />
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Space>
          <Button htmlType="submit" type="primary" loading={submitLoading}>
            {t('common.submit')}
          </Button>
          <Button onClick={resetForm} disabled={submitLoading}>
            {t('common.reset')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PlanForm;
