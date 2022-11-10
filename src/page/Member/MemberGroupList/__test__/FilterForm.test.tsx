import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useLocation } from 'react-router-dom';
import EmitterKey from '../../../../data/EmitterKey';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseInstance,
  mockUseUserGroup,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import MemberGroupListFilterForm from '../FilterForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
const projectName = 'test';

describe('test MemberGroupListFilterForm', () => {
  let useInstanceSpy: jest.SpyInstance;
  let useUserGroupSpy: jest.SpyInstance;
  const useLocationMock: jest.Mock = useLocation as jest.Mock;
  const submitSpy = jest.fn();
  beforeEach(() => {
    useInstanceSpy = mockUseInstance();
    useUserGroupSpy = mockUseUserGroup();
    useLocationMock.mockImplementation(() => {
      return { state: { projectName } };
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    useLocationMock.mockRestore();
  });
  test('should match snapshot', async () => {
    const { container } = render(
      <MemberGroupListFilterForm submit={submitSpy} />
    );
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should get data from request', () => {
    expect(useInstanceSpy).toBeCalledTimes(0);
    expect(useUserGroupSpy).toBeCalledTimes(0);
    render(<MemberGroupListFilterForm submit={submitSpy} />);

    expect(useInstanceSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledWith({
      filter_project: projectName,
    });
  });

  test('should call username tips request when receive event form EventEmit', async () => {
    render(<MemberGroupListFilterForm submit={submitSpy} />);
    expect(useUserGroupSpy).toBeCalledTimes(1);
    expect(useUserGroupSpy).toBeCalledWith({
      filter_project: projectName,
    });

    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Filter_User_Group_Tips);
    });
    expect(useUserGroupSpy).toBeCalledTimes(2);
    expect(useUserGroupSpy).toBeCalledWith({
      filter_project: projectName,
    });
  });

  test('should perform submission request when clicking a reset or search', async () => {
    render(<MemberGroupListFilterForm submit={submitSpy} />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(submitSpy).toBeCalledTimes(0);

    selectOptionByIndex(
      'member.memberGroupList.filterForm.userGroupName',
      'user_group_name1'
    );
    selectOptionByIndex(
      'member.memberGroupList.filterForm.instance',
      'instance1'
    );

    fireEvent.click(screen.getByText('common.search'));
    await waitFor(() => {
      jest.advanceTimersByTime(0);
    });
    expect(submitSpy).toBeCalledTimes(1);
    expect(submitSpy).toBeCalledWith({
      filterUserGroupName: 'user_group_name1',
      filterInstance: 'instance1',
    });
    fireEvent.click(screen.getByText('common.reset'));
    expect(
      screen.getByLabelText('member.memberGroupList.filterForm.userGroupName')
    ).toHaveValue('');
    expect(
      screen.getByLabelText('member.memberGroupList.filterForm.instance')
    ).toHaveValue('');
    expect(submitSpy).toBeCalledTimes(2);
    expect(submitSpy).toBeCalledWith({});
  });
});
