import {ModelApi} from '../types';
import {isEmptyObject} from '@/utils/isType';

/**
 * 创建state的子级时，判断是否可以创建
 * @param state
 * @param reducer
 */

export function isStateLegal(state: any, reducer: ModelApi) {
  const reducerKey = reducer.key.split('.');
  reducerKey.shift();
  const reducerStateKeys = isEmptyObject(reducer.initialState || {})
    ? [reducerKey.join('.')]
    : Object.keys(reducer.initialState || {}).map(
        (key) => `${reducerKey.join('.')}.${key}`
      );

  const stateKeys = getDeepStateKey(state).flat();

  const hasKey = reducerStateKeys.some((key) =>
    stateKeys.some(
      (statekey) =>
        key &&
        statekey &&
        (statekey.startsWith(key) || key.startsWith(statekey))
    )
  );
  return !hasKey;
}

/**
 * 递归变量state对象，获取所有可访问的最深层路径
 * @param state
 * @param initialKey
 */
function getDeepStateKey(
  state: object,
  initialKey?: string
): Array<Array<string> | string> {
  if (isEmptyObject(state)) {
    return [initialKey as string];
  }

  const initialKeys = Object.keys(state).map((key) => getKey(key, initialKey));
  return initialKeys.map((initKey) => {
    const cur = initKey.split('.').pop();
    const deepKeys = getDeepStateKey(state[cur as string], initKey);
    return deepKeys.flat();
  });
}

function getKey(key: string, initialKey?: string): string {
  return initialKey ? `${initialKey}.${key}` : key;
}
