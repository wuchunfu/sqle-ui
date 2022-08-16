import { Button, Card, PageHeader, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useResizeObserver from 'use-resize-observer';
import { Responsive as ResponsiveReactGridLayout } from 'react-grid-layout';
import { ReportStatisticsPanelEnum } from './index.enum';
import {
  DiffInstanceOrderRejectedPercent,
  DiffUserOrderRejectedPercent,
  LicenseUsage,
  OrderAverageExecuteTime,
  OrderAverageReviewTime,
  OrderQuantityWithDbType,
  InstanceProportionWithDbType,
  OrderPassPercent,
  OrderQuantityTrend,
  OrderStatus,
  OrderTotalNumbers,
} from './Panel';
import reportStatisticsData from './index.data';
import { Theme } from '../../types/theme.type';
import { useTheme } from '@material-ui/styles';
import IconTipsLabel from '../../components/IconTipsLabel';
import { SyncOutlined } from '@ant-design/icons';

import './index.less';
import 'react-grid-layout/css/styles.css';
import { useDispatch } from 'react-redux';
import { refreshReportStatistics } from '../../store/reportStatistics';

const { initialLayouts, gridLayoutCols, rowHeight } = reportStatisticsData;
const ReportStatistics: React.FC = () => {
  const { t } = useTranslation();
  const { ref, width = 0 } = useResizeObserver();
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const refreshPanelData = () => {
    dispatch(refreshReportStatistics());
  };
  return (
    <>
      <PageHeader
        title={
          <>
            {t('reportStatistics.title')}
            <IconTipsLabel
              tips={t('reportStatistics.titleTips')}
              iconStyle={{ fontSize: 14, marginLeft: 6 }}
            />
          </>
        }
        /* IFTRUE_isEE */
        extra={
          <Button
            onClick={refreshPanelData}
            data-testid="refreshReportStatistics"
          >
            <SyncOutlined />
          </Button>
        }
        /* FITRUE_isEE */
        ghost={false}
      />

      {/* IFTRUE_isCE */}
      <section className="padding-content">
        <Card>
          {t('reportStatistics.ceTips')}
          <Typography.Paragraph>
            <ul>
              <li>
                <a href="https://actiontech.github.io/sqle-docs-cn/">
                  https://actiontech.github.io/sqle-docs-cn/
                </a>
              </li>
              <li>
                <a href="https://www.actionsky.com/">
                  https://www.actionsky.com/
                </a>
              </li>
            </ul>
          </Typography.Paragraph>
        </Card>
      </section>
      {/* FITRUE_isCE */}

      {/* IFTRUE_isEE */}
      <section ref={ref} className="page-report-statistics-namespace">
        <ResponsiveReactGridLayout
          width={width}
          layouts={initialLayouts}
          cols={gridLayoutCols}
          rowHeight={rowHeight}
          margin={[theme.common.padding, theme.common.padding]}
          containerPadding={[theme.common.padding, theme.common.padding]}
        >
          <div key={ReportStatisticsPanelEnum.OrderTotalNumbers}>
            <OrderTotalNumbers />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderAverageReviewTime}>
            <OrderAverageReviewTime />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderAverageExecuteTime}>
            <OrderAverageExecuteTime />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderPassPercent}>
            <OrderPassPercent />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderQuantityTrend}>
            <OrderQuantityTrend />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderStatus}>
            <OrderStatus />
          </div>
          <div key={ReportStatisticsPanelEnum.OrderQuantityWithDbType}>
            <OrderQuantityWithDbType />
          </div>
          <div key={ReportStatisticsPanelEnum.InstanceProportionWithDbType}>
            <InstanceProportionWithDbType />
          </div>
          <div key={ReportStatisticsPanelEnum.LicenseUsage}>
            <LicenseUsage />
          </div>
          <div key={ReportStatisticsPanelEnum.DiffUserOrderRejectedPercent}>
            <DiffUserOrderRejectedPercent />
          </div>
          <div key={ReportStatisticsPanelEnum.DiffInstanceOrderRejectedPercent}>
            <DiffInstanceOrderRejectedPercent />
          </div>
        </ResponsiveReactGridLayout>
      </section>
      {/* FITRUE_isEE */}
    </>
  );
};

export default ReportStatistics;
