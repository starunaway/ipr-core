import {ModelApi, PutAction} from '@/app/types';
/**
 *
 * 处理API请求结果
 *
 * @param action
 * @param res
 */

export const onSuccess = (action: PutAction, res: any): any => {
  const result: any = {
    result: res.data.result,
    loading: false,
    success: res.data.success,
  };

  if (res.data.errMsg) {
    result.error = res.data.errMsg;
  }

  return result;
};

/**
 *
 * 调用API时添加默认参数
 *
 * @param option
 * @param item
 */
export const onFetchOption = (option: any, reducer: ModelApi) => {
  const opt = option;
  if (reducer.key !== 'user.login') {
    opt.headers = option.headers || {};
  }

  return opt;
};
