import React from 'react'

const VideoPlayer = ({ socket }) => {

  // useEffect(() => {
  //   if (socket) {
  //     socket.on('videoFrameToWebsite', ({ alias, videoFrame }) => {
  //       // Update the video stream for the user with the received video frame
  //       setVideoStreams((prevStreams) => ({
  //         ...prevStreams,
  //         [alias]: videoFrame,
  //       }));
  //     });

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }
  // }, [socket]);

  return (
    <div className='video-player'>
      <h4>Live Video Streaming</h4>
      <div className='video-card-header'>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
        <div className='video-card'>
          alis - xyz
          <video />
        </div>
      </div>

    </div>
  )
}

export default VideoPlayer