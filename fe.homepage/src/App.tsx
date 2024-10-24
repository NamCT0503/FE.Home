import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Culmn from './Culmn'
import PreLoader from './Preloader'
import BreakingNews from './Blog/breaking.new'
import Footer from './Footer'
import BlogContent from './Blog/blog.content'
import SigninLayout from './Sign'
import SignupLayout from './Signup'
import AdminIndex from './Admin/admin.index'

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={
        <>
        <PreLoader></PreLoader>
        <Culmn></Culmn>
        </>
      }></Route>
      <Route path='/blogs/*' element={
        <>
        <BreakingNews></BreakingNews>
        <Footer></Footer>
        </>
      }></Route>
      <Route path='blogs/post/*' element={
        <>
        <BlogContent></BlogContent>
        <Footer></Footer>
        </>
      }></Route>
      <Route path='/auth/signin' element={<SigninLayout></SigninLayout>}></Route>
      <Route path='/auth/signup' element={<SignupLayout></SignupLayout>}></Route>
      <Route path='/admin/*' element={<AdminIndex></AdminIndex>}></Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
