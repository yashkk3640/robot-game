// import React from 'react'
// let inttX = -102.5;
// let initZ = -97.5;
export const RandomPoint = () => {
  const mulX = Math.random() > 0.5 ? 1 : -1;
  const mulZ = Math.random() > 0.5 ? 1 : -1;
  const x = Math.round(Math.random() * 50) * 2 * mulX;
  const z = Math.round(Math.random() * 50) * 2 * mulZ;

  const nx = mulX > 0 ? x - (x % 25) - 2.5 : x - (x % 25) + 2.5;
  const nz = mulZ > 0 ? z - (z % 25) - 2.5 : z - (z % 25) + 2.5;
  return [nx, nz];
};
export const RandomPointModel = obj => {
  const [x, z] = [obj.x, obj.z];
  return Math.random() > 0.5
    ? x > 0
      ? [x - 50, z]
      : [x + 50, z]
    : z > 0
    ? [x, z - 50]
    : [x, z + 50];
};

export const RandomCube = (cube, pointCube, cubes, model) => {
  //   const [nx, nz] = RandomPoint();
  const mulX = Math.random() > 0.5 ? 1 : -1;
  const mulZ = Math.random() > 0.5 ? 1 : -1;
  const x = Math.round(Math.random() * 50) * 2 * mulX;
  const z = Math.round(Math.random() * 50) * 2 * mulZ;

  const nx = mulX > 0 ? x - (x % 25) - 2.5 : x - (x % 25) + 2.5;
  const nz = mulZ > 0 ? z - (z % 25) - 2.5 : z - (z % 25) + 2.5;
  //   if (model && model.x === nx && model.z === nz) {
  if (model && checkCollide(model, { x: nx, z: nz }, 8)) {
    console.log("model colide");
    RandomCube(cube, pointCube, cubes, model);
    return;
  }
  if (pointCube && pointCube.x === nx && pointCube.z === nz) {
    RandomCube(cube, pointCube, cubes, model);
    return;
  }
  if (
    cubes &&
    cubes.lenght > 0 &&
    cubes.filter(cube => cube.position.x === nx && cube.position.z === nz) > 0
  ) {
    console.log("Danger colide");
    RandomCube(cube, pointCube, cubes, model);
    return;
  }
  cube.position.x = nx;
  cube.position.z = nz;
  cube.position.y = 2.6;
};

export const checkCollide = (model, obj, len) => {
  const diffX = model.x - obj.x;
  const diffZ = model.z - obj.z;
  // if(Math.round(model.x) == obj.x  && Math.round(model.z) == obj.z )
  if (Math.sqrt(diffX * diffX + diffZ * diffZ) < len) return true;
  return false;
};

export const angleToPoint = (x, y, bearing, targetX, targetY) => {
  let angleToTarget = Math.atan2(-targetY + y, targetX - x);
  //   let diff = bearing - angleToTarget;
  return (angleToTarget + Math.PI * 2) % (Math.PI * 2);
};
export const normaliseInput = (roidX, roidY, roidA, shipA) => {
  // normalise the values to between 0 and 1
  let input = [];
  input[0] = (roidX + 50 / 2) / (100 + 50);
  input[1] = (roidY + 50 / 2) / (100 + 50);
  input[2] = roidA;
  //   input[3] = shipA / (Math.PI * 2);
  return input;
};

export const UP = "w";
export const DOWN = "s";
export const RIGHT = "d";
export const LEFT = "a";
export const WALK_SPEED = 0.1;
export const RUN_SPEED = 0.2;
export const FAR_FROM_PI = 0.0058;
/*
UP 0
DOWN 1
RIGHT 0
LEFT 1
*/
