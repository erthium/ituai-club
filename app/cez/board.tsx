/*
Create a chess board wth only knight and pawns located in the initial position.
The board should be represented as a 2D array.
The board should be 8x8.
*/

import { useRef, useState, useEffect } from "react";

import { Grid } from "@/interfaces/cez/grid";
import { Move } from "@/interfaces/cez/move";
import { Tile } from "@/interfaces/cez/tile";

interface Props {
  board_size?: number;
}

export const CezBoard: React.FC<Props> = ({ board_size = 720 }) => {
  // canvas hooks
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<Grid>(new Grid());
  
  // mouse event hooks
  let selectedPiece: Tile | null = null;

  // contants
  const tile_size = board_size / 8;

  // theme/colors
  const light_tile_color = '#f0d9b5';
  const dark_tile_color = '#b58863';
  
  const drawBoard = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    // clear the canvas
    ctx.clearRect(0, 0, board_size, board_size);

    // draw the tiles
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? light_tile_color : dark_tile_color;
        ctx.fillRect(i * tile_size, j * tile_size, tile_size, tile_size);
      }
    }

    // draw the pieces
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = grid.grid[i][j];
        if (piece) {
          const img = new Image();
          img.src = `/cez/${piece}.png`;
          img.onload = () => {
            // To Check Later: Make sure tiles are correct
            ctx.drawImage(img, i * tile_size, j * tile_size, tile_size, tile_size);
          }
        }
      }
    }

    // draw the legal moves
    if (selectedPiece !== null) {
      ctx.fillStyle = '#00ff00';
      // draw all the legal moves of the selected piece
      const legalMoves = grid.legalMoves.filter((move: Move) => selectedPiece !== null && move.from.x === selectedPiece.x && move.from.y === selectedPiece.y);
      legalMoves.forEach((move: Move) => {
        ctx.fillRect(move.to.x * tile_size, move.to.y * tile_size, tile_size, tile_size);
      });
    }
  }
  
  useEffect(() => {
    drawBoard();
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // get the square/tile the mouse is in
    const x = Math.floor(e.nativeEvent.offsetX / tile_size);
    const y = Math.floor(e.nativeEvent.offsetY / tile_size);
    const hitTile = grid.grid[x][y];
    console.log('hit tile:', hitTile);
    if (selectedPiece) {
      const move = grid.legalMoves.find((move: Move) => selectedPiece !== null && move.to.x === x && move.to.y === y && move.from.x === selectedPiece.x && move.from.y === selectedPiece.y);
      if (move) {
        grid.movePiece(move);
        console.log('moved piece:', hitTile);
        selectedPiece = null;
      }
      else {
        selectedPiece = null;
        console.log('invalid move');
      }
    }
    else {
      if (hitTile !== '') {
        if (grid.isWhitesTurn === (hitTile === hitTile.toUpperCase())) {
          selectedPiece = { x, y };
          console.log('selected piece:', hitTile);
        }
      }
      else {
        selectedPiece = null;
      }
    }
    drawBoard();
  }

  return (
    <canvas 
      id="cez-board"
      width={board_size}
      height={board_size}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
    />
  );
};

