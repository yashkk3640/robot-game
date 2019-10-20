// import React from 'react'

export const RandomCube = (cube) => {
    
    const mulX = Math.round(Math.random() * 2) - 1 ? 1 : -1
    const mulZ = Math.round(Math.random() * 2) - 1 ? 1 : -1
    const x = Math.round(Math.random() * 39) * 2 * mulX
    const z = Math.round(Math.random() * 39) * 2 * mulZ
    cube.position.x = x
    cube.position.z = z
    cube.position.y = 1
}

export const checkCollide = (model,obj,len) => {

    const diffX = model.x - obj.x
    const diffZ = model.z - obj.z
    // if(Math.round(model.x) == obj.x  && Math.round(model.z) == obj.z )
    if(Math.sqrt(diffX * diffX  + diffZ * diffZ) < len )
        return true
    return false
}

export const UP = 'w'
export const DOWN = 's'
export const RIGHT = 'd'
export const LEFT = 'a'
export const WALK_SPEED = 0.1
export const RUN_SPEED = 0.2