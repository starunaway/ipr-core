import {useState, useEffect} from 'react';

function HomePage() {
  const [name, setName] = useState('home');
  useEffect(() => {
    return () => {};
  }, []);
  useEffect(() => {
    console.log(name);
  }, [name]);

  return <Component name={name} setName={setName}></Component>;
}

interface ComponentProps {
  name: string;
  setName: (name: string) => void;
}

function Component(props: ComponentProps) {
  return (
    <div
      onClick={() => {
        props.setName(props.name + '1');
      }}
    >
      {props.name}
    </div>
  );
}

export default HomePage;
