import { useEffect, useRef, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { errorBar } from '../../utils/utils';
import { signIn } from '../../store/actions/authActions';

export default function Login() {
  const userData = useRef([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if(router.isReady == false) return;
    if(auth?.id && auth?.username) router.push("/");
  }, [router.isReady]);

  const handleLogin = async(e) => {
    e.preventDefault();
    if(userData.current.mail.value == "") return errorBar("You need to provide Email of your Account.");
    if(userData.current.pw.value == "") return errorBar("You didn't to provide Password of your Account.");

    let details = {
      mail: userData.current.mail.value,
      password: userData.current.pw.value,
    }

    dispatch(signIn(details));
  }

  return (
    <div className='hideOverflow'>
      <Head>
        <title>Feedback App - Login</title>
      </Head>
      <div className='vh-100 bg-maindark'>
        <div>
          <div className="d-none d-md-inline position-absolute opacity-25 w-50 end-50">
            <svg viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
              <g transform="translate(320, -44)">
                <path className="blob" d="M412.5,331Q344,412,235.5,437.5Q127,463,85,356.5Q43,250,98.5,166.5Q154,83,241,99Q328,115,404.5,182.5Q481,250,412.5,331Z" fill="#24314d"></path>
              </g>
            </svg>
          </div>
          <form className="container py-5 needs-validation" noValidate onSubmit={(async(e) => await handleLogin(e))}>
            <div className="row d-flex justify-content-center position-relative">
              <div className='w-100 w-md-50'>
                <p className='text-light fw-bolder fs-1 pt-2 mb-1'>Sign In</p>
                <div className='bg-gray700 mb-4' style={{ width: "10rem", height: "1px" }} />
                <div className='form-floating mb-3'>
                  <input type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" ref={((el) => (userData.current["mail"] = el))} className="form-control border-secdark bg-bluedark h-25 text-light" id="pollTitle" />
                  <label htmlFor="pollTitle" className="form-label text-light">Email Address</label>
                </div>
                <div className='form-floating'>
                  <input type="password" minLength={6} maxLength={21} ref={((el) => (userData.current["pw"] = el))} className="form-control border-secdark bg-bluedark h-25 text-light" id="pollTitle" />
                  <label htmlFor="pollTitle" className="form-label text-light">Password</label>
                  <p className='text-gray600 pt-1' style={{ fontSize: "13px" }}>Forgot password? Click to reset it.</p>
                </div>
                <div className='d-flex justify-content-center mt-5'>
                  <div className='bg-gray700 rounded-1 w-75' style={{ height: "1px" }} />
                </div>
                {/* BUTTONS */}
                <div className='mt-4'>
                  <div className='d-flex justify-content-center w-100 mb-1'>
                    <button type='submit' className="btn btn-primary w-50">Sign In</button>
                  </div>
                  {/* ADD LINK */}
                  <div className='text-center'>
                    <a className='text-light text-decoration-none' href='/register'>Don't have account? Sign Up</a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
