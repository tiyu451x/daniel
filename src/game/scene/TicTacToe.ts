import Phaser from 'phaser';

/**
 * ============================================================
 * TicTacToe.ts
 * ============================================================
 * WHAT THIS FILE DOES:
 * A simple 2-player, same-screen Tic Tac Toe game:
 *   - 3x3 grid, players tap alternating cells.
 *   - Player 1 = X, Player 2 = O.
 *   - Detects wins (row/column/diagonal) and draws.
 *   - Shows a result banner with a "Back to Table" button.
 *
 * ============================================================
 * WHAT YOU CAN CUSTOMIZE:
 * ============================================================
 *   - Colors for X / O / grid lines: see the constants at the top
 *     of the class (X_COLOR, O_COLOR, GRID_COLOR).
 *   - Grid size/spacing: CELL_SIZE, BOARD_PADDING.
 *   - "Back to Table" behavior: see `returnToTable()` — currently
 *     goes back to 'CardTable'. Change the scene key if you rename it.
 *   - Turn indicator text / win message wording: see
 *     `updateTurnLabel()` and `showResult()`.
 * ============================================================
 */
export class TicTacToe extends Phaser.Scene {
  private readonly CELL_SIZE = 100; // <-- size of each grid cell, tweak here
  private readonly X_COLOR = 0xe63946;
  private readonly O_COLOR = 0x4cc9f0;
  private readonly GRID_COLOR = 0xffffff;

  private board: (0 | 1 | 2)[] = Array(9).fill(0); // 0 = empty, 1 = X, 2 = O
  private currentPlayer: 1 | 2 = 1;
  private gameOver = false;
  private turnLabel!: Phaser.GameObjects.Text;
  private cellGraphics: Phaser.GameObjects.Container[] = [];

  private readonly WIN_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  constructor() {
    super('TicTacToe');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d3557);

    this.turnLabel = this.add
      .text(width / 2, 60, '', {
        fontFamily: 'Arial',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this.updateTurnLabel();

    this.drawBoard();

    // Back button, always available
    this.createBackButton();
  }

  private drawBoard(): void {
    const { width, height } = this.scale;
    const boardSize = this.CELL_SIZE * 3;
    const startX = width / 2 - boardSize / 2;
    const startY = height / 2 - boardSize / 2 + 20;

    // Grid lines
    const gfx = this.add.graphics();
    gfx.lineStyle(3, this.GRID_COLOR, 1);
    for (let i = 1; i < 3; i++) {
      gfx.lineBetween(startX + i * this.CELL_SIZE, startY, startX + i * this.CELL_SIZE, startY + boardSize);
      gfx.lineBetween(startX, startY + i * this.CELL_SIZE, startX + boardSize, startY + i * this.CELL_SIZE);
    }
    gfx.strokeRect(startX, startY, boardSize, boardSize);

    // 9 interactive cells
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const index = row * 3 + col;
        const cx = startX + col * this.CELL_SIZE + this.CELL_SIZE / 2;
        const cy = startY + row * this.CELL_SIZE + this.CELL_SIZE / 2;

        const hitArea = this.add
          .rectangle(cx, cy, this.CELL_SIZE, this.CELL_SIZE, 0x000000, 0.001)
          .setInteractive({ useHandCursor: true });

        const markContainer = this.add.container(cx, cy);
        this.cellGraphics[index] = markContainer;

        hitArea.on('pointerdown', () => this.handleCellClick(index, cx, cy));
      }
    }
  }

  private handleCellClick(index: number, cx: number, cy: number): void {
    if (this.gameOver || this.board[index] !== 0) return;

    this.board[index] = this.currentPlayer;
    this.drawMark(index, cx, cy, this.currentPlayer);

    const winLine = this.checkWin();
    if (winLine) {
      this.gameOver = true;
      this.highlightWin(winLine);
      this.showResult(`Player ${this.currentPlayer} Wins!`);
      return;
    }

    if (this.board.every((cell) => cell !== 0)) {
      this.gameOver = true;
      this.showResult("It's a Draw!");
      return;
    }

    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.updateTurnLabel();
  }

  private drawMark(index: number, cx: number, cy: number, player: 1 | 2): void {
    const container = this.cellGraphics[index];
    const size = this.CELL_SIZE * 0.3;

    if (player === 1) {
      const gfx = this.add.graphics();
      gfx.lineStyle(6, this.X_COLOR, 1);
      gfx.lineBetween(-size, -size, size, size);
      gfx.lineBetween(size, -size, -size, size);
      container.add(gfx);
    } else {
      const gfx = this.add.graphics();
      gfx.lineStyle(6, this.O_COLOR, 1);
      gfx.strokeCircle(0, 0, size);
      container.add(gfx);
    }
  }

  private checkWin(): number[] | null {
    for (const line of this.WIN_LINES) {
      const [a, b, c] = line;
      if (this.board[a] !== 0 && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        return line;
      }
    }
    return null;
  }

  private highlightWin(line: number[]): void {
    line.forEach((index) => {
      const container = this.cellGraphics[index];
      this.tweens.add({
        targets: container,
        scale: 1.15,
        duration: 200,
        yoyo: true,
        repeat: 2,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private updateTurnLabel(): void {
    this.turnLabel.setText(`Player ${this.currentPlayer}'s Turn (${this.currentPlayer === 1 ? 'X' : 'O'})`);
  }

  private showResult(message: string): void {
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height - 90, width, 100, 0x000000, 0.7);
    this.add
      .text(width / 2, height - 90, message, {
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);
  }

  private createBackButton(): void {
    const btn = this.add
      .text(20, 20, '< Back to Table', {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: { x: 10, y: 6 },
      })
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.returnToTable());
  }

  private returnToTable(): void {
    this.scene.start('CardTable');
  }
}
