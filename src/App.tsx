import { useEffect, useState } from "react";
import axios from "axios";

import {login, authorization} from "./Auth/Login";
import { Link } from "react-router-dom";

function App() {
  const [artists, setArtists] = useState([])
  useEffect(() => {
    if (localStorage.getItem('code_verifier') && !(localStorage.getItem('access_token'))) {
      authorization()
    }
  }, [])

  const getTop = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      time_range: "medium_term"
    })

    const response = axios.get('https://api.spotify.com/v1/me/top/artists?',
      {
        params: params,
        headers: {
          Authorization: "Bearer " + localStorage.getItem('access_token'),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(res => {
        console.log(res)
        setArtists(res.data.items)
        console.log(artists)
      }).catch(error => console.log(error))

    console.log(response)
  }

  return (
    <>
      <div className="background">
        <div className="container">
          <h1>Hello</h1>
          <button onClick={login}>Login</button>
          <button onClick={getTop}>Get Top Artists</button>
          <Link to={"/about"}>About Page</Link>
        </div>
      </div>

      <div className="custom-shape-divider-bottom-1692302595">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            className="shape-fill"></path>
        </svg>
      </div>
    </>
  )
}

export default App
