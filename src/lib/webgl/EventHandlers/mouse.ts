interface DragEventListener {
	ondrag: (dx: number, dy: number) => unknown;
}

interface WheelEventListener {
	onwheel: (e: WheelEvent) => unknown;
}

export class MouseListener {
	canvas: HTMLCanvasElement;
	onWheelListeners: WheelEventListener[];
	onDragListeners: DragEventListener[];

	x:number;
	y:number;
	dragging:boolean;


	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.onWheelListeners = [];
		this.onDragListeners = [];
		this.x = 0;
		this.y = 0;
		this.dragging = false;

		this.canvas.onwheel = (e: WheelEvent) => {
			this.onWheelListeners.forEach((listener) => {
				listener.onwheel(e);
			});
		};

		this.canvas.onmousedown = (e: MouseEvent) => {
			this.x = e.clientX;
			this.y = e.clientY;
			this.dragging = true;
		};

		this.canvas.onmouseup = () => {
			this.dragging = false;
		};

		this.canvas.onmousemove = (e: MouseEvent) => {
			if (this.dragging) {
				const dx = this.x - e.clientX;
				const dy = this.y - e.clientY;
				this.x = e.clientX;
				this.y = e.clientY;
				this.onDragListeners.forEach((listener) => {
					listener.ondrag(dx, dy);
				});
			}
		};

		this.canvas.ontouchstart = (e: TouchEvent) => {
			e.preventDefault();
			if (e.changedTouches) {
				this.x = e.changedTouches[0].clientX;
				this.y = e.changedTouches[0].clientY;
				this.dragging = true;
			}
		};

		this.canvas.ontouchmove = (e: TouchEvent) => {
			e.preventDefault();
			if (e.changedTouches) {
				const dx = this.x - e.changedTouches[0].clientX;
				const dy = this.y - e.changedTouches[0].clientY;
				this.x = e.changedTouches[0].clientX;
				this.y = e.changedTouches[0].clientY;
				this.onDragListeners.forEach((listener) => {
					listener.ondrag(dx, dy);
				});
				this.dragging = true;
			}
		};

		this.canvas.ontouchend = (e: TouchEvent) => {
			e.preventDefault();
			this.dragging = false;
		};
	}

	subscribeToDrag = (listener: DragEventListener) => {
		this.onDragListeners.push(listener);
	};

	subscribeToWheel = (listener: WheelEventListener) => {
		this.onWheelListeners.push(listener);
	};
}