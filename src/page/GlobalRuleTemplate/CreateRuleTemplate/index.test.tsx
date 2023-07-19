import CreateRuleTemplate from '.';
import rule_template from '../../../api/rule_template';
import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithThemeAndRouter } from '../../../testUtils/customRender';
import { resolveThreeSecond, mockDriver } from '../../../testUtils/mockRequest';

import { allRulesWithType } from '../../Rule/__testData__';
import { IRuleReqV1 } from '../../../api/common';
import useNavigate from '../../../hooks/useNavigate';

jest.mock('../../../hooks/useNavigate', () => jest.fn());

describe('RuleTemplate/CreateRuleTemplate', () => {
  const navigateSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetAllRules();
    mockDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockGetAllRules = () => {
    const spy = jest.spyOn(rule_template, 'getRuleListV1');
    spy.mockImplementation(() => resolveThreeSecond(allRulesWithType));
    return spy;
  };

  const mockCreateTemplate = () => {
    const spy = jest.spyOn(rule_template, 'createRuleTemplateV1');
    spy.mockImplementation(() => resolveThreeSecond({}));
    return spy;
  };

  test('should render base form at init', async () => {
    const { container } = renderWithThemeAndRouter(<CreateRuleTemplate />);
    expect(container).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  test('should jump to /rule/template when user click back btn', async () => {
    renderWithThemeAndRouter(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('common.back')).toBeInTheDocument();
    fireEvent.click(screen.getByText('common.back'));
    expect(navigateSpy).toBeCalledTimes(1);
    expect(navigateSpy).toBeCalledWith(-1);
  });

  test('should jump to next step when user input all require fields', async () => {
    const createTemplateSpy = mockCreateTemplate();
    renderWithThemeAndRouter(<CreateRuleTemplate />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName'),
      {
        target: { value: 'testRuleTemplateId' },
      }
    );
    fireEvent.input(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateDesc'),
      {
        target: { value: 'rule template desc' },
      }
    );
    fireEvent.mouseDown(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.databaseType')
    );
    await act(async () => jest.advanceTimersByTime(0));

    const databaseTypeOption = screen.getAllByText('oracle')[1];
    expect(databaseTypeOption).toHaveClass('ant-select-item-option-content');
    fireEvent.click(databaseTypeOption);

    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    fireEvent.click(screen.getByText('common.prevStep'));
    expect(screen.getByTestId('base-form')).not.toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).toHaveAttribute('hidden');
    expect(
      screen.getByLabelText('ruleTemplate.ruleTemplateForm.templateName')
    ).toHaveValue('testRuleTemplateId');
    fireEvent.click(screen.getByText('common.nextStep'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByTestId('base-form')).toHaveAttribute('hidden');
    expect(screen.getByTestId('rule-list')).not.toHaveAttribute('hidden');

    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.disableAllRules')
    );
    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getByText('ruleTemplate.ruleTemplateForm.activeAllRules')
    );
    expect(screen.getByTestId('rule-list')).toMatchSnapshot();
    fireEvent.click(
      screen.getAllByText('ruleTemplate.ruleTemplateForm.disableRule')[0]
    );

    fireEvent.click(screen.getByText('common.submit'));

    expect(createTemplateSpy).toBeCalledTimes(1);
    const resultRuleName: IRuleReqV1[] = allRulesWithType
      .filter((e) => e.db_type === 'oracle')
      .map((rule) => {
        return {
          is_custom_rule: !!rule.is_custom_rule,
          name: rule.rule_name,
          level: rule.level,
          params: rule.params.map((v) => ({ key: v.key, value: v.value })),
        };
      });
    resultRuleName.shift();
    expect(createTemplateSpy).toBeCalledWith({
      db_type: 'oracle',
      rule_template_name: 'testRuleTemplateId',
      desc: 'rule template desc',
      rule_list: resultRuleName,
    });
  });
});
