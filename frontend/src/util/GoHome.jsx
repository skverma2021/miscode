import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const GoHome = ({ secs, msg }) => {
  const navigate = useNavigate();

  // The primary goal is to ensure timeoutId is tracked for correct cleanup, 
  // even if it’s not directly used outside the useEffect. 
  // This approach adheres to best practices for managing side effects and cleanup in React components.
  // Using useState to store the timeoutId is a way to ensure that React's 
  // state management system properly tracks the timeout ID, even if it’s not used directly elsewhere. 
  // It aligns with React's reactivity principles and helps maintain the integrity of the timeout reference across re-renders.

  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const goHome = () => navigate('/');
    const id = setTimeout(goHome, secs);
    setTimeoutId(id);

    // The cleanup function within useEffect ensures the timeout is cleared when the component unmounts 
    // or if secs or navigate change, preventing potential memory leaks. 
    // The timeoutId value is not directly used elsewhere, but storing it in state is crucial for the cleanup function.
    return () => clearTimeout(id);

    // dependency array  includes secs to properly handle the timer setup and cleanup
    // Code Safety: Prevents potential bugs related to stale references within the effect.
    // Without including secs in the dependency array, the closure created by useEffect might 
    // hold on to stale values. React will not automatically re-run the effect with the 
    // updated secs unless it is explicitly listed in the dependencies.

    // The navigate function from react-router-dom is included in the dependency array 
    // to ensure the useEffect hook is aware of any changes to the navigate function reference.
    // It guarantees that  effect always uses the most up-to-date version of the function
    // Reactivity: Ensures the effect reacts correctly if navigate ever changes

  }, [secs, navigate]);

  return <h1 style={{ color: 'red' }}>{msg}</h1>;
};


// Adding prop types can ensure that the passed props are of the expected type, enhancing the component's reliability.
// Key Points About PropTypes:

  // Validation: PropTypes help validate the types of props passed to a component. 
  // For example, you can specify that a prop should be a string, a number, an array, an object, etc.

  // Debugging: It aids in debugging by providing warnings in the console if the props do not match the specified types. 
  // This can help catch errors early in development.

  // Documentation: It serves as a form of documentation by clearly defining the expected prop types, 
  // making it easier for other developers to understand how to use the component.

GoHome.propTypes = {
  secs: PropTypes.number.isRequired,
  msg: PropTypes.string.isRequired,
};

export default GoHome;


