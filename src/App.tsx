import './App.css'
import { useEffect, useState } from "react";
import axios from "axios";

// interface tokenRes {
//   access_token: string,
//   expires_in: number,
// }
function App() {
  /*
    This will get us an access token to make request
   */
  const [token, setToken] = useState({access_token: "", expires_in: 0})

  useEffect(() => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
    // console.log(params)
    axios.post('https://accounts.spotify.com/api/token', params).then(res => {
      setToken(res.data);
    })
      .catch(err => console.log("Error: ", err))
  }, [])

  const artistSearch = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {headers: {
        Authorization: `Bearer ${token.access_token}`
        }});
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <h1>Hello</h1>
      <p>{token.access_token}</p>
      <button onClick={artistSearch}>search</button>
    </>
  )
}

export default App
