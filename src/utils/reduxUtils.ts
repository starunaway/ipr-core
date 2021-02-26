import {ModelApi} from '@/app/types';
/**
 *
 * 处理API请求结果
 *
 * @param action
 * @param res
 */

export const onEffect = async (action: any, res: any) => {
  const temp = action;
  try {
    const body = await res.json();
    temp.status = body.status;
    temp.loading = false;
    temp.result = body.result;
  } catch (error) {
    temp.success = false;
    temp.error = '请求失败';
  }
  return temp;
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
