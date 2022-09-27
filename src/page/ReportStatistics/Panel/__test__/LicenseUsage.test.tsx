/* eslint-disable no-console */
import { useTheme } from '@material-ui/styles';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import statistic from '../../../../api/statistic';
import { SupportLanguage } from '../../../../locale';
import { mockUseSelector } from '../../../../testUtils/mockRedux';
import {
  resolveErrorThreeSecond,
  resolveThreeSecond,
} from '../../../../testUtils/mockRequest';
import { SupportTheme } from '../../../../theme';
import LicenseUsage from '../LicenseUsage';
import mockRequestData from './mockRequestData';

jest.mock('@material-ui/styles', () => {
  return {
    ...jest.requireActual('@material-ui/styles'),
    useTheme: jest.fn(),
  };
});

const { LicenseUsageData } = mockRequestData;

describe('test LicenseUsage', () => {
  const error = console.error;

  const mockGetLicenseUsageV1 = () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond(LicenseUsageData);
    });
    return spy;
  };

  const mockErrorGetLicenseUsageV1 = () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveErrorThreeSecond({});
    });
    return spy;
  };

  const useThemeMock: jest.Mock = useTheme as jest.Mock;

  beforeEach(() => {
    console.error = jest.fn((message: any) => {
      if (
        message.includes('React does not recognize the') ||
        message.includes('Invalid value for prop')
      ) {
        return;
      }
      error(message);
    });

    jest.useFakeTimers();

    mockUseSelector({
      user: { theme: SupportTheme.LIGHT },
      locale: { language: SupportLanguage.zhCN },
      reportStatistics: { refreshFlag: false },
    });
    useThemeMock.mockReturnValue({ common: { padding: 24 } });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    console.error = error;
  });

  test('should match snapshot', async () => {
    mockGetLicenseUsageV1();
    const { container } = render(<LicenseUsage />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should match snapshot when request goes wrong', async () => {
    mockErrorGetLicenseUsageV1();
    const { container } = render(<LicenseUsage />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should called getLicenseUsageV1Spy when first rendered', async () => {
    const getLicenseUsageV1Spy = mockGetLicenseUsageV1();
    render(<LicenseUsage />);
    expect(getLicenseUsageV1Spy).toBeCalledTimes(1);
  });

  test('should match snapshot when environment is qa', async () => {
    const spy = jest.spyOn(statistic, 'getLicenseUsageV1');
    spy.mockImplementation(() => {
      return resolveThreeSecond({
        instances_usage: [
          {
            is_limited: false,
            limit: 0,
            resource_type: 'test1',
            used: 10,
          },
          {
            is_limited: false,
            limit: 0,
            resource_type: 'test2',
            used: 110,
          },
        ],
        users_usage: {
          is_limited: false,
          limit: 0,
          resource_type: 'user',
          used: 20,
        },
      });
    });

    const { container } = render(<LicenseUsage />);
    expect(spy).toBeCalledTimes(1);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });
});