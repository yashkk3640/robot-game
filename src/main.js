import React, { useState, useRef } from 'react'
import Robot from './Robot'

const Main = () => {

    let point = useRef(1)
    const [alive, setAlive] = useState(true)

    const getGame = () => {
        point.current = 1
        return <Robot point={point} setAlive={setAlive} />
    }

    return (
        <div>
            {!alive && <div style={{ display: 'flex', justifyContent: 'space-around', alignContent: 'center', backgroundColor: 'black', opacity: 0.8, filter: 'alpha(opacity=80)' }}>
                <div className='score' style={{ display: 'flex', flexFlow: 'column', justifyContent: 'space-between', alignItems: 'center', width: '400px', height: '300px' }}>
                    Score {point.current * 1000}
                    <br />
                    Greate Job
                    <button style={{ width: '25vw', position: 'relative' }} onClick={() => setAlive(true)}>Continue</button>
                </div>
            </div>}
            {alive && getGame()}
            {alive && <div className='score' style={{ top: '10px', right: '10px', }}>Score {point.current * 1000}</div>}
        </div>
    )
}

export default Main;