import {useState, useEffect} from 'react';

function HomePage() {
  const [name, setName] = useState('lee');
  useEffect(() => {
    return () => {};
  }, []);
  useEffect(() => {
    console.log(name);
  }, [name]);

  return (
    <div
      onClick={() => {
        setName(name + '1');
      }}
    >
      {name}
    </div>
  );
}

export default HomePage;
