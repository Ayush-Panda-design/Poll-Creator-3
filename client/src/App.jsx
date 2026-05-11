import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from './features/auth/authSlice';

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  return <AppRoutes />;
};

export default App;
