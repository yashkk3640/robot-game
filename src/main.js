import React, { useState } from 'react'
import Robot from './Robot'

const Main = () => {
    const [point, setPoint] = useState(1)

    return (
        <div>
            <div className='score' style={{ top: '10px', right: '10px', }}>Score {point * 1000}</div>
            <Robot setPoint={setPoint} point={point} />
        </div>
    )
}

export default Main;