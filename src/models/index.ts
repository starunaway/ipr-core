const history = [
  {
    key: 'history.curve',
    method: 'post',
  },
  {
    key: 'history.bonds',
    method: 'post',
  },

  {
    key: 'history.spread',
    method: 'post',
  },
  {
    key: 'history.liquidity',
    method: 'post',
  },
  {
    key: 'history.balance',
    method: 'post',
    url: (payload: any) => {
      return payload.url;
    },
  },
];

const scatter = [
  {
    key: 'scatter.issuers.filter.curve',
    method: 'get',
  },
  {
    key: 'scatter.bondOne',
    method: 'get',
  },
  {
    key: 'scatter.bondTwo',
    method: 'get',
  },
  {
    key: 'scatter.curve.bondThree',
    method: 'get',
    initialState: {
      bondName: '999999999',
    },
    reducer: (state: any, action: any) => {
      return {
        bondName: `${state.curve.bondThree.bondName},${action.payload.bondName}`,
      };
    },
  },
  //   {
  //     key: 'scatter.curve',
  //     method: 'post',
  //   },
];

const scatter1 = [
  {
    key: 'scatter.issuers',
    method: 'get',
  },
  //   {
  //     key: 'scatter.curve.bondTwo',
  //     method: 'get',
  //   },
];
const history1 = {
  key: 'history.bonds.spread',
  method: 'post',
};

const models = [history, ...scatter];

export default models;
