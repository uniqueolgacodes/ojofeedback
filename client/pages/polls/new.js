import { useState, useEffect, useRef, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navigation from '../../components/Navigation/Navigation'
import Footer from '../../components/Other/Footer'
import ChoicesCreate from '../../components/Poll/ChoicesCreate'
import { createPoll, successBar, errorBar, getProfile } from '../../utils/utils'
import '../../styles/Polls.module.css'
import { useSelector } from 'react-redux'

export default function NewPoll() {
  const auth = useSelector((state) => state.auth);
  const router = useRouter();
  const [limitNum, setLimitNum] = useState(-1);
  const [answers, setAnswers] = useState([{
    id: 1,
    text: ''
  }]);
  const inputRef = useRef([]);
  const titleRef = useRef("");
  const shortDescRef = useRef("");
  const descriptionRef = useRef("");
  const checksRef = useRef([]);
  const [author, setAuthor] = useState("");

  const removeItem = async(index) => {
    if(index == 0 && answers.length == 1) return errorBar("You can't remove the only option.");
    let inputArr = inputRef.current.map((x, ind) => {
      return {
        id: ind,
        text: x?.value
      }
    }).filter(val => val.text != undefined);
    inputArr.splice(index, 1);
    setAnswers([...inputArr])
  }

const [userRole, setUserRole] = useState(0); // default to 0

async function getUserProfile() {
  if (auth.id) {
    await getProfile(auth.id).then((res) => {
      if (res?.id) {
        setAuthor(auth.id);
        setUserRole(res.role); // Save role from backend
      }
    });
  } else {
    setAuthor("-1");
  }
}

  useEffect(() => {
    getUserProfile();
  }, []);

  const submitNewPoll = async(e) => {
    e.preventDefault();

      if (userRole === 0) {
    return errorBar("Only ADMINS can create polls."); // role check
  }


    if(titleRef.current.value == "") return errorBar("You didn't enter Poll Title");
    if(shortDescRef.current.value == "") return errorBar("You didn't enter Short Description");
    if(descriptionRef.current.value == "") return errorBar("You didn't enter Poll Description");
    if(inputRef.current.map((v) => v.value)[0] == "") return errorBar("You need to provide at least 1 option");
    if(limitNum < 1 || limitNum == "") setLimitNum(-1);

    let details = {
      user: author,
      title: titleRef.current.value,
      shortDescription: shortDescRef.current.value,
      question: descriptionRef.current.value,
      options: inputRef.current.map((v) => v.value),
      limit: limitNum,
      needAuth: checksRef.current.auth.checked,
      publicResults: checksRef.current.results.checked,
      publicList: checksRef.current.explore.checked,
      date: new Date().toLocaleDateString()
    }

    await createPoll(details).then((result) => {
      if(result.code == 201) {
        successBar("Poll have been created, redirecting.");
        setTimeout(() => router.push(`/polls/${result.response.id}`), 3000);
        return;
      }
    });
  }

  return (
    <div className='hideOverflow'>
      <Navigation active='polls' />
      <Head>
        <title>Feedback - Create Poll</title>
      </Head>
      <div>
        <div className="bg-maindark">
          <form className="container py-6" onSubmit={(async(e) => await submitNewPoll(e))}>
            <div className="row d-flex justify-content-center">
              <div className="bg-bluedark shadow w-100 w-md-75 rounded-1">
                {/* FORMS */}
                <div className='px-md-5'>
                  <div className='mb-3'>
                    <div className="titleSection pt-4">
                      <p className='text-light fs-3 fw-bold mb-0'>Details</p>
                      <p className='text-gray600'>Set general Poll details like Title, Description and similar.</p>
                    </div>
                    <div className="mb-2">
                      <label htmlFor="pollTitle" className="form-label text-light">Poll Title</label>
                      <input type="text" ref={titleRef} className="form-control border-secdark bg-secdark text-light" placeholder="Title of Poll" id="pollTitle" />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="pollShortDesc" className="form-label text-light">Short Poll Description</label>
                      <input type="text" ref={shortDescRef} minLength={6} maxLength={256} className="form-control border-secdark bg-secdark text-light" placeholder="Short description of this Poll." id="pollShortDesc" />
                    </div>
                    <div className="mb-2">
                      <label htmlFor="pollQuestion" className="form-label text-light">Poll Question</label>
                      <textarea className="form-control border-secdark bg-secdark text-light" placeholder="Question for your Poll" ref={descriptionRef} id="pollQuestion" style={{ height: "8rem", resize: "none" }} />
                    </div>
                    <div className="mt-3">
                      <p className='text-light mb-2'>List of Choices</p>
                      <ChoicesCreate removeItem={removeItem} answers={answers} inputRef={inputRef} className="mb-4" />
                      <div className='border-secdark bg-secdark text-light py-1 mt-4 text-center rounded-1 hoverEffect cursor' onClick={(() => setAnswers([...answers, '']))}>➕</div>
                    </div>
                  </div>
                </div>
                {/* OPTIONS */}
                <div className="px-5 mb-3 pt-3">
                  <div>
                    <p className='fs-3 text-light fw-bold mb-0'>Options</p>
                    <p className='text-gray600'>Set advanced poll details.</p>
                  </div>
                  {/* CHECKMARKS */}
                  <div className='mb-5'>
                    <div className="form-check">
                      <input className="form-check-input" ref={((el) => (checksRef.current["results"] = el))} defaultChecked={true} type="checkbox" value="" id="checkResults" />
                      <label className="form-check-label text-light" htmlFor="checkResults">Allow everyone to see results?</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" ref={((el) => (checksRef.current["auth"] = el))} type="checkbox" value="" id="checkAuth" />
                      <label className="form-check-label text-light" htmlFor="checkAuth">Does Voters need to be Registered?</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" ref={((el) => (checksRef.current["explore"] = el))} defaultChecked={true} type="checkbox" value="" id="explorePoll" />
                      <label className="form-check-label text-light" htmlFor="explorePoll">Is this Poll Listed in 'Explore Polls' section?</label>
                    </div>
                    <div className="">
                      <input className="m-0 p-0 bg-secdark limitNumber text-light rounded-1 border-0" onChange={((e) => setLimitNum(e.target.value))} style={{ "width": "50px", "outline": "none" }} type="number" id="limitNumber" />
                      <label className="form-check-label text-light ps-2" htmlFor="limitNumber">How much users can Vote?</label>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-center pb-3">
                  <div className='bg-gray700' style={{ width: "30rem", height: "1px" }} />
                </div>
                <div className='px-5 py-3 pb-4 text-center'>
                  <button type='submit' className="btn btn-primary btn-lg me-2">Finish</button>
                  <button type='button' onClick={(() => router.push("/polls"))} className="btn btn-danger btn-lg ms-2">Cancel</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  )
}
