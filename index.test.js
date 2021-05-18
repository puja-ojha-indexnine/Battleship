let { Ship, Gameboard, Player } = require("./scripts");

test('correctly creates a hit array', () => {
  let ship = new Ship(5);
  expect(ship.hitArray).toStrictEqual([
    false, false, false, false, false
  ]);
  ship = new Ship(3);
  expect(ship.hitArray).toStrictEqual([
    false, false, false
  ]);
});

test('correctly hits the right spots in a ship', () => {
  let ship = new Ship(5);
  ship.hit(3);
  expect(ship.hitArray).toStrictEqual([
    false, false, false, true, false
  ]);
  ship.hit(0);
  expect(ship.hitArray).toStrictEqual([
    true, false, false, true, false
  ])
});

test('correctly calculates whether or not a ship has been sunk', () => {
  let ship = new Ship(5);
  ship.isSunk();
  expect(ship.sunk).toBe(false);
  for (let i = 0; i < ship.length; i++) {
    ship.hit(i);
  }
  expect(ship.sunk).toBe(true);
});

test.skip('correctly adds ships to the ship array', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip(5, 4, "v", 5);
  expect(gameboard.ships[0]).toEqual({
    ship: new Ship(5),
    x: 5,
    y: [4, 5, 6, 7, 8],
    or: "v"
  });
  gameboard.placeShip(2, 3, "h", 3);
  expect(gameboard.ships[1]).toEqual({
    ship: new Ship(3),
    x: [2, 3, 4],
    y: 3,
    or: "h"
  });
});

test('correctly handles an attack that hits a ship', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip(5, 4, "v", 5);
  gameboard.receiveAttack(5, 5);
  expect(gameboard.ships[0].ship.hitArray).toEqual([
    false, true, false, false, false
  ])
  gameboard.placeShip(3, 3, "h", 3);
  gameboard.receiveAttack(4, 3);
  expect(gameboard.ships[1].ship.hitArray).toEqual([
    false, true, false
  ]);
});

test('correctly registers missed attacks', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip(5, 4, "v", 5);
  gameboard.receiveAttack(6, 4);
  expect(gameboard.missedAttacks).toStrictEqual([
    {
      x: 6,
      y: 4
    }
  ]);
});

test('correctly checks if ships have been sunk or not', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip(5, 4, "h", 3);
  expect(gameboard.allSunk()).toBe(false);
  for (let i = 5; i < 8; i++) {
    gameboard.receiveAttack(i, 4);
  }
  expect(gameboard.allSunk()).toBe(true);
})

test('correctly registers an attack', () => {
  let computerBoard = new Gameboard();
  computerBoard.placeShip(0, 0, "v", 5);
  let computer = new Player(true, computerBoard);
  computer.attack(5, 6);
  expect(computerBoard.missedAttacks).toStrictEqual([
    {
      x: 5, 
      y: 6
    }
  ]);
  expect(computer.alreadyHit).toStrictEqual([
    {
      x: 5,
      y: 6
    }
  ]);
});

test('correctly checks if coordinates have already been hit', () => {
  let computerBoard = new Gameboard();
  computerBoard.placeShip(0, 0, "v", 5);
  let computer = new Player(true, computerBoard);
  computer.attack(5, 6);
  computer.attack(6, 6);
  expect(computer.checkHit(5, 6)).toBe(true);
  expect(computer.checkHit(6, 6)).toBe(true);
  expect(computer.checkHit(0, 0)).toBe(false);
  expect(computer.checkHit(1, 0)).toBe(false);
});

test('correctly checks if there is no overlap', () => {
  let gameboard = new Gameboard();
  gameboard.placeShip(0, 2, "h", 5);
  expect(gameboard.checkBoard(3, [0, 1, 2, 3, 4], "v", 5)).toBe(true);
  expect(gameboard.checkBoard(9, [0, 1, 2, 3, 4], "v", 5)).toBe(false);
  expect(gameboard.checkBoard([0, 1, 2, 3, 4], 5, "h", 5)).toBe(false);
})