import React from 'react'

export default function TrackSearchResult({track, chooseTrack}) {
    function handlePlay() {
        chooseTrack(track)
    }
    let getAlbumYear = track.albumRelease.slice(0,4);
    return (
        <div className="d-flex m-2 align-items-center" 
        style={{ cursor: 'pointer' }}
        onClick={handlePlay}>
            <img src={track.albumUrl} style={{ height: "64px", width: "64px"}} alt="" />
            <div className="" style={{marginLeft:'1em'}}>
                <div style={{fontWeight:'600'}}> {track.title} </div>
                <div className='d-flex flex-row'>
                <div > {track.artist} &nbsp;</div> 
                <div style={{fontStyle:'italic'}}>{track.albumName},&nbsp;</div>
                <div> {getAlbumYear} </div>
                </div>
            </div>
        </div>
    )
}
