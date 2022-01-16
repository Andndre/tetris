class TetrisScreen {
	constructor() {
		this.currentScreen = STATE_MAIN_MENU;
		this.playButton = new ImgButton(
			() => [
				createVector(
					width / 2 - tetris.scale * 2,
					height / 2 - tetris.scale * 2
				),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			playArrImg,
			null,
			STATE_MAIN_MENU
		);

		this.retryButton = new ImgButton(
			() => [
				createVector(
					width / 2 - tetris.scale * 2,
					height / 2 - tetris.scale * 2
				),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			playArrImg,
			null,
			STATE_GAMEOVER
		);

		this.downButton = new ImgButton(
			() => [
				createVector(tetris.scale * 3, height - tetris.scale * 5),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			downArrImg,
			null,
			STATE_IN_GAME
		);

		this.rightButton = new ImgButton(
			() => [
				createVector(
					width - tetris.scale * 8,
					height - tetris.scale * 5
				),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			rightArrImg,
			null,
			STATE_IN_GAME
		);

		this.hardDropButton = new ImgButton(
			() => [
				createVector(tetris.scale * 8, height - tetris.scale * 5),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			hardDropImg,
			null,
			STATE_IN_GAME
		);

		this.leftButton = new ImgButton(
			() => [
				createVector(
					width - tetris.scale * 13,
					height - tetris.scale * 5
				),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			leftArrImg,
			null,
			STATE_IN_GAME
		);

		this.rotateButton = new ImgButton(
			() => [
				createVector(
					width - tetris.scale * 10.5,
					height - tetris.scale * 10
				),
				createVector(tetris.scale * 4, tetris.scale * 4),
			],
			rotateImg,
			null,
			STATE_IN_GAME
		);

		this.toggleFullScreenButton = new ImgButton(
			() => [
				createVector(width - tetris.scale * 4, tetris.scale),
				createVector(tetris.scale * 3, tetris.scale * 3),
			],
			fullScreenImg,
			() => {
				toggleFullscreen();
			},
			STATE_GLOBAL
		);

		this.downButton.onClick = function () {
			tetris.move(DOWN);
			autoMoveDown = false;
			redraw();
		};

		this.hardDropButton.onClick = function () {
			tetris.hardDrop();
			autoMoveDown = false;
			redraw();
		};

		this.playButton.onClick = function () {
			fps = PAL_FPS[0];
			frameRate(fps);
			tetrisScreen.currentScreen = STATE_IN_GAME;
			music.play();
			redraw();
		};

		this.retryButton.onClick = function () {
			fps = PAL_FPS[0];
			frameRate(fps);
			tetrisScreen.currentScreen = STATE_IN_GAME;
			tetris.restart();
			redraw();
		};

		this.rotateButton.onClick = function () {
			tetris.rotate(LEFT);
			autoMoveDown = false;
			redraw();
		};

		this.leftButton.onClick = function () {
			tetris.move(LEFT);
			autoMoveDown = false;
			redraw();
		};

		this.rightButton.onClick = function () {
			tetris.move(RIGHT);
			autoMoveDown = false;
			redraw();
		};

		this.buttons = [
			this.retryButton,
			this.playButton,
			this.downButton,
			this.rotateButton,
			this.leftButton,
			this.rightButton,
			this.hardDropButton,
			this.toggleFullScreenButton,
		];
	}

	onResized() {
		for (let button of this.buttons) {
			button.refresh();
		}
	}

	mouseClicked() {
		for (let button of this.buttons) {
			if (button.click()) return;
		}
	}

	render() {
		switch (this.currentScreen) {
			case STATE_MAIN_MENU:
				this.renderMainMenu();
				break;
			case STATE_IN_GAME:
				this.renderInGame();
				break;
			case STATE_GAMEOVER:
				this.renderGameOver();
				break;
		}
	}

	renderMainMenu() {
		spreadCells(150);
		push();
		fill(255);
		textAlign(CENTER);
		textSize(tetris.scale * 4);
		text("T E T R I S", width / 2, tetris.scale * 5);
		textSize(tetris.scale);
		text("High Score: " + tetris.highScore, width / 2, tetris.scale * 7);
		pop();
		this.playButton.render();
		this.toggleFullScreenButton.render();
		frameRate(0);
	}

	renderInGame() {
		push();
		translate(createVector(width / 2 - tetris.width / 2, 0));
		tetris.update(autoMoveDown);
		pop();
		this.leftButton.render();
		this.rightButton.render();
		this.downButton.render();
		this.rotateButton.render();
		this.hardDropButton.render();
		this.toggleFullScreenButton.render();
	}

	renderGameOver() {
		spreadCells(150);
		push();
		textAlign(CENTER);
		fill(255);
		textSize(tetris.scale);
		textAlign(CENTER);
		translate(createVector(width / 2, 0));
		text(
			"G A M E  O V E R\n\nScore: " +
				tetris.score +
				"\nHigh score: " +
				tetris.highScore +
				"\n\nRetry?",
			0,
			tetris.scale * 2
		);
		pop();
		this.retryButton.render();
		this.toggleFullScreenButton.render();
		frameRate(0);
	}
}
