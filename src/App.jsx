import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import ProductCard from './components/productCard'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import AdminPage from './pages/adminPage'
import TestPage from './pages/testPage'
import { Toaster } from 'sonner'
import RegisterPage from './pages/register'
import ForgetPasswordPage from './pages/forgetPassword'
import CartPage from './pages/client/cart'
import CheckoutPage from './pages/client/checkOut'
import OrderSuccessPage from './pages/client/orderSuccess'
import { GoogleOAuthProvider } from '@react-oauth/google'

function App() {
 

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <div >
        <Toaster 
          position="top-center" 
          richColors 
          theme="light"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              padding: '16px 20px',
              fontSize: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              minHeight: '60px',
              minWidth: '350px',
            },
            duration: 4000,
          }}
        />
        {/* <Header/> */}
        <Routes path="/*">
          <Route path='/*' element={<HomePage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<RegisterPage/>}/>
          <Route path="/testing" element={<TestPage/>}/>
          <Route path='/admin/*' element={<AdminPage/>}/>
          <Route path='/forget-password' element={<ForgetPasswordPage/>}/>
          <Route path='/cart' element={<CartPage/>}/>
          <Route path='/checkout' element={<CheckoutPage/>}/>
          <Route path='/order-success' element={<OrderSuccessPage/>}/>
          
          
        </Routes>
      </div>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}

export default App
//https://kfkwemmdbjfftxlntlcy.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3dlbW1kYmpmZnR4bG50bGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMDMwNTUsImV4cCI6MjA2MjY3OTA1NX0._BR5wCdFzGNcziOzr__v01HRymIENyl28BoDaqyaOvw