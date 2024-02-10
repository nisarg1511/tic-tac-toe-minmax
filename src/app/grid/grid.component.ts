import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss'
})
export class GridComponent implements OnInit {
  protected box: boolean[] | null[];
  protected grid: String[][] = [];
  protected isPlayerX: boolean;
  protected winner: string = '';
  protected isBoardDisabled: boolean;
  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 3; i++) {
      this.grid[i] = [];
      for (let j = 0; j < 3; j++) {
        this.grid[i].push('');
      }
    }
  }

  onClick(row: number, col: number) {
    if (this.grid[row][col] === '' && this.winner === '') {
      this.grid[row][col] = 'O';
      this.computerMove();
    }
  }

  minimax(depth: number, isMaximizingPlayer: boolean): number {
    let score = this.evaluate();

    if (score !== null) return score;

    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.grid[i][j] === '') {
            this.grid[i][j] = 'X';
            score = this.minimax(depth + 1, false);
            this.grid[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity; // Change from -Infinity to Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.grid[i][j] === '') {
            this.grid[i][j] = 'O';
            score = this.minimax(depth + 1, true);
            this.grid[i][j] = '';
            bestScore = Math.min(score, bestScore); // Change from Math.max to Math.min
          }
        }
      }
      return bestScore;
    }
  }

  computerMove() {
    let bestScore = -Infinity;
    let bestMove = { row: -1, col: -1 };
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j] === '') {
          let score;
          this.grid[i][j] = 'X';
          score = this.minimax(0, false);
          this.grid[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove.row = i;
            bestMove.col = j;
          }
        }
      }
    }
    this.grid[bestMove.row][bestMove.col] = 'X'; // Move this line outside the inner loop
    this.evaluate(); // Evaluate after making the move
  }

  evaluate(): number | any {
    if (this.isWinner('X')) return 10;
    if (this.isWinner('O')) return -10;
    if (this.isBoardFull()) return 0;
    return null;
  }

  isWinner(player: string): boolean {
    // Check rows, columns, and diagonals for a win
    for (let i = 0; i < 3; i++) {
      if (
        (this.grid[i][0] === player && this.grid[i][1] === player && this.grid[i][2] === player) ||
        (this.grid[0][i] === player && this.grid[1][i] === player && this.grid[2][i] === player)
      ) {
        return true;
      }
    }
    if (
      (this.grid[0][0] === player && this.grid[1][1] === player && this.grid[2][2] === player) ||
      (this.grid[0][2] === player && this.grid[1][1] === player && this.grid[2][0] === player)
    ) {
      return true;
    }
    return false;
  }

  isBoardFull(): boolean {
    // Check if all cells are occupied
    for (let row of this.grid) {
      for (let cell of row) {
        if (cell === '') {
          return false;
        }
      }
    }
    return true;
  }

}
