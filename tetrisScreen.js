class TetrisScreen {
	constructor() {
		createCanvas(windowWidth, windowHeight);
		this.currentScreen = STATE_MAIN_MENU;
		this.playButton = new ImgButton(
			createVector(width / 2 - tetris.scale, height / 2 - tetris.scale),
			playImg,
			createVector(tetris.scale * 2, tetris.scale * 2),
			null,
			STATE_MAIN_MENU
		);

		this.retryButton = new ImgButton(
			createVector(width / 2 - tetris.scale, height / 2 - tetris.scale),
			playImg,
			createVector(tetris.scale * 2, tetris.scale * 2),
			null,
			STATE_GAMEOVER
		);

		this.playButton.onClick = function () {
			frameRate(fps);
			loop();
			screen.currentScreen = STATE_IN_GAME;
			music.play();
			redraw();
		};

		this.retryButton.onClick = function () {
			frameRate(fps);
			loop();
			screen.currentScreen = STATE_IN_GAME;
			tetris.restart();
			redraw();
		};

		this.buttons = [this.retryButton, this.playButton];
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
		textAlign(CENTER);
		textSize(tetris.scale * 4);
		text("T E T R I S", width / 2, tetris.scale * 5);
		this.playButton.render();
		frameRate(0);
	}

	renderInGame() {
		push();
		translate(createVector(width / 2 - tetris.width / 2, 0));
		tetris.update(autoMoveDown);
		pop();
	}

	renderGameOver() {
		spreadCells(150);
		push();
		textSize(tetris.scale);
		textAlign(CENTER);
		translate(createVector(width / 2, 0));
		text(
			"G A M E O V E R\nScore: " + tetris.score + "\n\nRetry?",
			0,
			tetris.scale * 2
		);
		pop();
		this.retryButton.render();
		frameRate(0);
	}
}
