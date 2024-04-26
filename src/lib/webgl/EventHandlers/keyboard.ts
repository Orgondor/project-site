interface KeyEventListener {
	onkeydown: (e: KeyboardEvent) => unknown;
	onkeyup: (e: KeyboardEvent) => unknown;
}

export class KeyListener {
	canvas: HTMLCanvasElement;
	onKeyListeners: KeyEventListener[];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.onKeyListeners = [];

		this.canvas.onkeydown = (e: KeyboardEvent) => {
			this.onKeyListeners.forEach((listener) => {
				listener.onkeydown(e);
			});
		};

		this.canvas.onkeyup = (e: KeyboardEvent) => {
			this.onKeyListeners.forEach((listener) => {
				listener.onkeyup(e);
			});
		};
	}

	subscribeToKey = (listener: KeyEventListener) => {
		this.onKeyListeners.push(listener);
	};
}
