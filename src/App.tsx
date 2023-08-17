import { useEffect, useState } from "react";
import axios from "axios";

import {login, authorization} from "./Auth/Login";

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
      <h1>Hello</h1>
      <button onClick={login}>Login</button>
      <button onClick={getTop}>Get Top Artists</button>
      <p>{artists.map(item => {
        return (
          <p>{item.name}</p>
        )
      })}</p>
    </>
  )
}

export default App
