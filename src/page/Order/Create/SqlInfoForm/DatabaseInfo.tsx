import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Row, Select } from 'antd';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WorkflowResV2ModeEnum } from '../../../../api/common.enum';
import instance from '../../../../api/instance';
import EmptyBox from '../../../../components/EmptyBox';
import { ResponseCode } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import useInstance from '../../../../hooks/useInstance';
import EventEmitter from '../../../../utils/EventEmitter';
import { DatabaseInfoProps, SchemaListType } from './index.type';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  instanceNameChange,
  setInstanceNames,
  currentSqlMode,
  setChangeSqlModeDisabled,
}) => {
  const { t } = useTranslation();

  const [schemaList, setSchemaList] = useState<SchemaListType>(
    new Map([[0, []]])
  );
  const [instanceType, setInstanceType] = useState<string[]>([]);
  const { updateInstanceList, generateInstanceSelectOption, instanceList } =
    useInstance();

  const handleInstanceNameChange = (name: string, index: number) => {
    setInstanceNames((values) => {
      const cloneValue = cloneDeep(values);
      cloneValue.set(index, name);
      return cloneValue;
    });
    instanceNameChange?.(name);
    updateSchemaList(name, index);
    const currentInstance = instanceList.find((v) => v.instance_name === name);
    setInstanceType((v) => [...v, currentInstance?.instance_type ?? '']);

    if (currentInstance && index === 0) {
      updateInstanceList({
        filter_workflow_template_id:
          currentInstance.workflow_template_id?.toString(),
        filter_db_type:
          currentSqlMode === WorkflowResV2ModeEnum.same_sqls
            ? currentInstance?.instance_type
            : undefined,
      });
    }
    setChangeSqlModeDisabled(
      currentSqlMode === WorkflowResV2ModeEnum.different_sqls &&
        new Set([...instanceType, currentInstance?.instance_type ?? '']).size >
          1
    );
  };

  const updateSchemaList = (name: string, index: number) => {
    instance
      .getInstanceSchemasV1({
        instance_name: name,
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSchemaList((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(index, res.data.data?.schema_name_list ?? []);
            return cloneValue;
          });
        }
      });
  };

  const generateInstanceSchemaSelectOption = (index: number) => {
    return (
      schemaList.get(index)?.map((schema) => (
        <Select.Option value={schema} key={schema}>
          {schema}
        </Select.Option>
      )) ?? []
    );
  };

  useEffect(() => {
    updateInstanceList();
    EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      updateInstanceList
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Create_Order_Form,
        updateInstanceList
      );
    };
  }, [updateInstanceList, currentSqlMode]);

  return (
    <Form.List name="dataBaseInfo" initialValue={[{}]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Row key={field.key}>
              <Col span={12}>
                <Form.Item
                  labelCol={{
                    xs: { span: 24 },
                    sm: { span: 16 },
                  }}
                  tooltip={
                    index === 0
                      ? t('order.sqlInfo.instanceNameTips')
                      : undefined
                  }
                  label={t('order.sqlInfo.instanceName')}
                  {...field}
                  name={[field.name, 'instanceName']}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select<string>
                    onChange={(value) => handleInstanceNameChange(value, index)}
                    showSearch
                    placeholder={t('common.form.placeholder.select', {
                      name: t('order.sqlInfo.instanceName'),
                    })}
                  >
                    {generateInstanceSelectOption()}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Row gutter={8}>
                  <Col span={22}>
                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => {
                        return (
                          prevValues?.dataBaseInfo[index]?.instanceName !==
                          curValues?.dataBaseInfo[index]?.instanceName
                        );
                      }}
                    >
                      {() => (
                        <Form.Item
                          labelCol={{
                            xs: { span: 24 },
                            sm: { span: 8 },
                          }}
                          wrapperCol={{
                            xs: { span: 24 },
                            sm: { span: 24 },
                            md: { span: 24 },
                          }}
                          {...field}
                          name={[field.name, 'instanceSchema']}
                          label={t('order.sqlInfo.instanceSchema')}
                        >
                          <Select
                            disabled={
                              !form.getFieldValue('dataBaseInfo')[index]
                                ?.instanceName
                            }
                            placeholder={t('common.form.placeholder.select')}
                            showSearch
                            allowClear
                          >
                            {generateInstanceSchemaSelectOption(index)}
                          </Select>
                        </Form.Item>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <EmptyBox if={index !== 0}>
                      <MinusCircleOutlined
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          setInstanceNames((values) => {
                            const cloneValue = cloneDeep(values);
                            cloneValue.delete(index);
                            return cloneValue;
                          });
                          remove(field.name);
                        }}
                      />
                    </EmptyBox>
                  </Col>
                </Row>
              </Col>
            </Row>
          ))}
          {/* IFTRUE_isEE */}
          <Form.Item label=" " colon={false}>
            <Button
              type="dashed"
              onClick={() => {
                setInstanceNames((values) => {
                  const cloneValue = cloneDeep(values);
                  cloneValue.set(values.size, '');
                  return cloneValue;
                });
                add();
              }}
              block
              icon={<PlusOutlined />}
            >
              {t('order.sqlInfo.addInstance')}
            </Button>
          </Form.Item>
          {/* FITRUE_isEE */}
        </>
      )}
    </Form.List>
  );
};

export default DatabaseInfo;
