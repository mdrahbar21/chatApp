import { useEffect, useState } from 'react';
import './App.css';
import { CssBaseline, GeistProvider, useTheme } from '@geist-ui/core';
import AuthScreen from './components/Auth';
import GeneralScreen from './components/main';


function App() {
  const theme = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (sessionStorage.getItem("token") != null) {
      setIsAuthenticated(true);
    }
  }, []);

  const useDomClean = (): void => {
    useEffect(() => {
      document.documentElement.removeAttribute('style')
      document.body.removeAttribute('style')
    }, [])
  }
  useDomClean()
  return (
    <>
      <GeistProvider themes={[theme]}>
        <CssBaseline />
        {isAuthenticated ? (
          <GeneralScreen setIsAuthenticated={setIsAuthenticated} />
        ) : (
          <AuthScreen setIsAuthenticated={setIsAuthenticated} />
        )
        }
      </GeistProvider>
    </>
  );
}

export default App;
