import {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Action from '@/action';

function HomePage(props: any) {
  console.log('HomePage', props);
  const {bondThree} = props;

  useEffect(() => {
    console.log(bondThree.bondName);
  }, [bondThree.bondName]);

  const setName = (value: string) => {
    Action.emit('scatter.curve.bondThree', {
      bondName: bondThree.bondName + value,
    });
  };

  useEffect(() => {
    Action.emit('history.balance', {
      url: '12131313',
      bondName: bondThree.bondName,
    });
  }, [bondThree]);

  return <Component name={bondThree.bondName} setName={setName}></Component>;
}

interface ComponentProps {
  name: string;
  setName: (name: string) => void;
}

function Component(props: ComponentProps) {
  return (
    <div
      onClick={() => {
        props.setName('1');
      }}
    >
      {props.name}
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    bondThree: state.scatter.curve.bondThree,
  };
}

export default connect(mapStateToProps)(HomePage);
