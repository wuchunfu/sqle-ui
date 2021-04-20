/* tslint:disable no-identical-functions */
/* tslint:disable no-useless-cast */
/* tslint:disable no-unnecessary-type-assertion */
/* tslint:disable no-big-function  */
/* tslint:disable no-duplicate-string  */
import ServiceBase from '../Service.base';
import { AxiosRequestConfig } from 'axios';

import {
  IGetRuleTemplateTipsV1Return,
  IGetRuleTemplateListV1Params,
  IGetRuleTemplateListV1Return,
  ICreateRuleTemplateV1Params,
  ICreateRuleTemplateV1Return,
  IGetRuleTemplateV1Params,
  IGetRuleTemplateV1Return,
  IDeleteRuleTemplateV1Params,
  IDeleteRuleTemplateV1Return,
  IUpdateRuleTemplateV1Params,
  IUpdateRuleTemplateV1Return,
  IGetRuleListV1Return
} from './index.d';

class RuleTemplateService extends ServiceBase {
  public getRuleTemplateTipsV1(options?: AxiosRequestConfig) {
    return this.get<IGetRuleTemplateTipsV1Return>(
      '/v1/rule_template_tips',
      undefined,
      options
    );
  }

  public getRuleTemplateListV1(
    params: IGetRuleTemplateListV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.get<IGetRuleTemplateListV1Return>(
      '/v1/rule_templates',
      paramsData,
      options
    );
  }

  public createRuleTemplateV1(
    params: ICreateRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    return this.post<ICreateRuleTemplateV1Return>(
      '/v1/rule_templates',
      paramsData,
      options
    );
  }

  public getRuleTemplateV1(
    params: IGetRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.get<IGetRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public deleteRuleTemplateV1(
    params: IDeleteRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.delete<IDeleteRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public updateRuleTemplateV1(
    params: IUpdateRuleTemplateV1Params,
    options?: AxiosRequestConfig
  ) {
    const paramsData = this.cloneDeep(params);
    const rule_template_name = paramsData.rule_template_name;
    delete paramsData.rule_template_name;

    return this.patch<IUpdateRuleTemplateV1Return>(
      `/v1/rule_templates/${rule_template_name}/`,
      paramsData,
      options
    );
  }

  public getRuleListV1(options?: AxiosRequestConfig) {
    return this.get<IGetRuleListV1Return>('/v1/rules', undefined, options);
  }
}

export default new RuleTemplateService();