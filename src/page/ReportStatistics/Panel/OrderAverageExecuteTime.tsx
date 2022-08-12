import { useBoolean } from 'ahooks';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import statistic from '../../../api/statistic';
import { ResponseCode } from '../../../data/common';
import { minuteToHourMinute } from '../../../utils/Math';
import PanelWrapper from './PanelWrapper';

const OrderAverageExecuteTime: React.FC = () => {
  const { t } = useTranslation();
  const [loading, { setFalse: finishGetData, setTrue: startGetData }] =
    useBoolean(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const getData = () => {
      startGetData();
      statistic
        .getTaskDurationOfWaitingForExecutionV1()
        .then((res) => {
          if (res.data.code !== ResponseCode.SUCCESS) {
            setErrorMessage(res.data.message ?? t('common.unknownError'));
          } else {
            setErrorMessage('');
            setTime(minuteToHourMinute(res.data.data?.minutes || 0));
          }
        })
        .catch((error) => {
          setErrorMessage(error?.toString() ?? t('common.unknownError'));
        })
        .finally(() => {
          finishGetData();
        });
    };
    getData();
  }, [finishGetData, startGetData, t]);

  return (
    <PanelWrapper
      title={t('reportStatistics.orderAverageExecuteTime.title')}
      loading={loading}
      error={
        errorMessage ? (
          <Typography.Text type="danger">{errorMessage}</Typography.Text>
        ) : undefined
      }
    >
      <div className="statistics-value-style">
        <span>{time}</span>
      </div>
    </PanelWrapper>
  );
};

export default OrderAverageExecuteTime;
