import React, { useEffect, useContext, useState } from 'react'
import { CartContext } from '../CartContext';
import AreaSnap from '../components/Live/AreaSnap'
import LineSnap from '../components/Live/LineSnap'
import AudioPlayer from '../components/Live/AudioPlayer'
import VideoPlayer from '../components/Live/VideoPlayer'
import io from 'socket.io-client';

const LiveStreaming = () => {
    const [socket, setSocket] = useState(null);
    const { auth } = useContext(CartContext);
    useEffect(() => {
        if (auth.isAdmin) {
            // Create a socket connection only if the user is an admin
            const newSocket = io('https://stchrom.tgb.software', {
                query: { userType: 'web', alias: 'admin' }, // Specify the user type as 'web'
            });
            setSocket(newSocket);

            return () => {
                // Disconnect the socket when the component unmounts
                newSocket.disconnect();
            };
        }
        // No socket connection if the user is not an admin
        setSocket(null);
    }, []);
    return (
        <div className='live-stream'>
            <div className='live-sec2'>
                <section className='live-inner-sec'>
                <LineSnap socket={socket} />
                </section>
                {/* <section className='live-inner-sec'>
                    <AreaSnap socket={socket} />
                </section> */}
            </div>
            <div className='live-sec'>
                <section className='live-inner-sec'>
                    <VideoPlayer socket={socket} />
                </section>
                <section className='live-inner-sec'>
                    <AudioPlayer socket={socket} />
                </section>
            </div>
        </div>
    )
}

export default LiveStreaming