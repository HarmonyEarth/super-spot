import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import Player from './Player';
import TrackSearchResult from './TrackSearchResult';
import useAuth from './useAuth'

const spotifyAPI = new SpotifyWebApi({
    // Add your client ID
    clientId:'',

})

export default function Dashboard({code}) {
    
    const accessToken = useAuth(code);
    // const [accessToken, setAccessToken] = useState(useAuth(code))
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    // console.log(searchResults);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState('');
    

    function chooseTrack(track){
        setPlayingTrack(track)
        setSearch('')
        setLyrics('')
    }

    useEffect(() => {
        if(!playingTrack) return
        
        // Add your redirect URI
        axios.get('Redirect URI/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist,
            },
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if(!accessToken) return
        spotifyAPI.setAccessToken(accessToken)
        }, [accessToken])

    useEffect(() => {
        if(!search) return setSearchResults([]);
        if(!accessToken) return

        let cancel = false
        spotifyAPI.searchTracks(search).then(res => {
            // console.log("View all retrieved data for tracks", res.body.tracks);
            if(cancel) return
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce(
                    (smallest, image) => { 
                        if(image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])

                return{
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url,
                    albumName: track.album.name,
                    albumRelease: track.album.release_date

                }
                
            }))
        })
        return () => (cancel = true)
    }, [search, accessToken])
    
    
    console.log("Dashboard",accessToken)

    return (
        <Container className="d-flex flex-column py-3" style={{ height: "100vh"}}>
            <Form.Control 
            type='search' 
            placeholder='Search Songs and Artists'
            value={search}
            onChange={e => setSearch(e.target.value)}/>
            <div className="flex-grow-1 my-2" style={{overflowY:"auto"}}>
                {searchResults.map(track => {
                   return (
                   <TrackSearchResult 
                   track={track} 
                   key={track.uri}
                   chooseTrack={chooseTrack}  />)
                })}

                {searchResults.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre"}}>
                    {lyrics}
                    </div>
                )}
            </div>
            <div>
                <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            </div>
        </Container>
        
    )
}
