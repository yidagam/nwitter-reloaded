import { useState, useEffect } from 'react'
// import { setTimeout } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import reset from "styled-reset";
import {styled} from "styled-components"


import Layout from "./components/layout";
import Home from "./routes/home";
import Profile from "./routes/profile";
import Login from "./routes/login";
import CreateAccount from "./routes/create-account";
import LoadingScreen from "./components/loading-screen";
import { auth } from "./firebase";
import ProtectedRoute from './components/protected-route';
import FindPassword from './components/find-password';


const router = createBrowserRouter([
  {
    path:"/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path:"/",
        element: <Home />,
      },
      {
        path:"profile",
        element: <Profile />,
      },
    ]
  },
  {
    path:"login",
    element: <Login />
  },
  {
    path:"create-account",
    element: <CreateAccount />
  },
  {
    path:"find-password",
    element: <FindPassword />
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  * {
    box-sizing: border-box;
  }
  body {
    background-color: black;
    color: white;
    font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'S egoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;

function App() {

  const [isLoading, setLoading] = useState(true);
  const init = async() => {
    await auth.authStateReady();
    setLoading(false);
    // window.setTimeout(() => {setIsLoading(false);}, 2000);
  };

  useEffect(()=>{
    init()
  }, []);

  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} /> }
    </Wrapper>
  )
}

export default App
