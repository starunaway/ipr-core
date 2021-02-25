import IprCore from '@/app';

class Action {
  public static dispatch: any;

  constructor(app: IprCore) {
    Action.dispatch = app.store.dispatch;
  }

  static emit(type: string, payload: object) {
    this.dispatch({
      type,
      payload,
    });
  }

  static loading(type: string, payload: object) {
    this.dispatch({
      type: `${type}__LOADING`,
      payload,
    });
  }

  static success(type: string, payload: object) {
    this.dispatch({
      type: `${type}__SUCCESS`,
      payload,
    });
  }

  static failure(type: string, payload: object) {
    this.dispatch({
      type: `${type}__FAILURE`,
      payload,
    });
  }
}

export default Action;
