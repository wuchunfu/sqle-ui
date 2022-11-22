import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useParams } from 'react-router-dom';
import MemberGroupList from '..';
import { SystemRole } from '../../../../data/common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { mockBindProjects } from '../../../../hooks/useCurrentUser/index.test';
import { selectOptionByIndex } from '../../../../testUtils/customQuery';
import {
  mockUseDispatch,
  mockUseSelector,
} from '../../../../testUtils/mockRedux';
import {
  mockUseInstance,
  mockUseUserGroup,
} from '../../../../testUtils/mockRequest';
import EventEmitter from '../../../../utils/EventEmitter';
import {
  mockDeleteMemberGroup,
  mockGetMemberGroups,
  mockMemberGroupList,
} from './utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));
const projectName = mockBindProjects[0].project_name;

describe('test MemberGroupList', () => {
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  let getMemberGroupsSpy: jest.SpyInstance;
  let deleteMemberGroupSpy: jest.SpyInstance;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    getMemberGroupsSpy = mockGetMemberGroups();
    deleteMemberGroupSpy = mockDeleteMemberGroup();
    mockUseUserGroup();
    mockUseInstance();
    useParamsMock.mockReturnValue({ projectName });
    dispatchSpy = mockUseDispatch().scopeDispatch;
    mockUseSelector({
      user: { role: SystemRole.admin, bindProjects: mockBindProjects },
    });

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should match snapshot', async () => {
    const { container } = render(<MemberGroupList />);
    expect(container).toMatchSnapshot();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
  });

  test('should call refresh list request when receive event from EventEmit', async () => {
    expect(getMemberGroupsSpy).toBeCalledTimes(0);
    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMemberGroupsSpy).toBeCalledTimes(1);
    expect(getMemberGroupsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

    act(() => {
      EventEmitter.emit(EmitterKey.Refresh_Member_Group_List);
    });

    expect(getMemberGroupsSpy).toBeCalledTimes(2);
    expect(getMemberGroupsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
  });

  test('should call refresh list request when clicking search button and reset button', async () => {
    expect(getMemberGroupsSpy).toBeCalledTimes(0);
    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(getMemberGroupsSpy).toBeCalledTimes(1);
    expect(getMemberGroupsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });

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

    expect(getMemberGroupsSpy).toBeCalledTimes(2);
    expect(getMemberGroupsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
      filter_user_group_name: 'user_group_name1',
      filter_instance_name: 'instance1',
    });

    fireEvent.click(screen.getByText('common.reset'));
    expect(getMemberGroupsSpy).toBeCalledTimes(3);
    expect(getMemberGroupsSpy).toBeCalledWith({
      page_index: 1,
      page_size: 10,
      project_name: projectName,
    });
  });

  test('should dispatch "updateMemberModalStatus" when clicking create button', async () => {
    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('member.memberGroupList.createAction'));
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Member_Group,
        status: true,
      },
    });
  });

  test('should dispatch "updateSelectMemberGroup" and "updateMemberModalStatus" when clicking edit button', async () => {
    render(<MemberGroupList />);
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.edit')).toBeInTheDocument();

    expect(dispatchSpy).toBeCalledTimes(0);

    fireEvent.click(screen.getByText('common.edit'));

    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateSelectMemberGroup',
      payload: {
        memberGroup: mockMemberGroupList[0],
      },
    });
    expect(dispatchSpy).toBeCalledWith({
      type: 'member/updateModalStatus',
      payload: {
        modalName: ModalName.Update_Member_Group,
        status: true,
      },
    });
  });

  test('should call delete memberGroup request when clicking delete button', async () => {
    render(<MemberGroupList />);
    expect(getMemberGroupsSpy).toBeCalledTimes(1);

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).toBeInTheDocument();

    fireEvent.click(screen.getByText('common.delete'));

    expect(
      screen.queryByText('member.memberGroupList.tableColumn.confirmTitle')
    ).toBeInTheDocument();

    expect(deleteMemberGroupSpy).toBeCalledTimes(0);
    fireEvent.click(screen.getByText('common.ok'));

    expect(deleteMemberGroupSpy).toBeCalledTimes(1);
    expect(deleteMemberGroupSpy).toBeCalledWith({
      user_group_name: mockMemberGroupList[0].user_group_name,
      project_name: projectName,
    });
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.memberGroupList.deleteSuccessTips')
    ).toBeInTheDocument();
    expect(getMemberGroupsSpy).toBeCalledTimes(2);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(
      screen.queryByText('member.memberGroupList.deleteSuccessTips')
    ).not.toBeInTheDocument();
  });

  test('should hide the Create, Add, Edit feature when not currently a project manager or admin', async () => {
    mockUseSelector({
      user: {
        role: SystemRole.admin,
        bindProjects: [{ projectName: 'test', isManager: false }],
      },
    });

    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).toBeInTheDocument();
    expect(screen.queryByText('common.edit')).toBeInTheDocument();
    expect(
      screen.queryByText('member.memberGroupList.createAction')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: mockBindProjects,
      },
    });
    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).toBeInTheDocument();
    expect(screen.queryByText('common.edit')).toBeInTheDocument();
    expect(
      screen.queryByText('member.memberGroupList.createAction')
    ).toBeInTheDocument();

    cleanup();
    jest.clearAllMocks();

    mockUseSelector({
      user: {
        role: '',
        bindProjects: [{ projectName: 'default', isManager: false }],
      },
    });
    render(<MemberGroupList />);
    await waitFor(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('common.delete')).not.toBeInTheDocument();
    expect(screen.queryByText('common.edit')).not.toBeInTheDocument();
    expect(
      screen.queryByText('member.memberGroupList.createAction')
    ).not.toBeInTheDocument();
  });
});