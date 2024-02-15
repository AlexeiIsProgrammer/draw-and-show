import Brush from './Brush';

export default class Eraser extends Brush {
  draw(x: number, y: number) {
    if (this.ctx) {
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 30;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    }
  }
}
