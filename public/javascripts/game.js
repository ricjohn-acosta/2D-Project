// Config object used to configure the game.
// Lots of options can be placed in this object.
var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%',
        height: '100%',
    },
    physics: {

        default: 'arcade',
        arcade: {
            gravity: {y: 700},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Instantiate game with the given configurations.
var game = new Phaser.Game(config);

// Load assets.
function preload() {
    this.load.image('sky', 'images/assets/sky.png')
    this.load.image('ground', 'images/assets/platform.png');
    this.load.image('star', 'images/assets/star.png');
    this.load.image('bomb', 'images/assets/bomb.png');
    this.load.spritesheet('bunny', 'images/assets/bunny_left_right.png', {
        frameWidth: 52.05
        , frameHeight: 45
    });
}

// Create assets.
var platforms;
var character;

function create() {


    /** ADD SKY **/
    this.bg = this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'sky'); // x & y coordinates are based on the center of the image.
    this.bg.setDisplaySize(5000, window.innerHeight);

    /** ADD PLATFORMS **/
    // Create a group of static platform objects.
    platforms = this.physics.add.staticGroup();
    this.ground = platforms.create(950, 950, 'ground').setScale(2).refreshBody(); // Double the scale and refresh to apply changes.
    // Create the rest of the platforms.
    platforms.create(500, 600, 'ground');
    platforms.create(680, 760, 'ground');
    platforms.create(1500, 760, 'ground');

    /** ADD PLAYER **/
    // Create character.
    character = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'bunny'); // Create character.
    character.setBounce(0.2); // Add bounce when character falls.
    character.setCollideWorldBounds(true); // Prevents character from falling past the canvas size.
    this.cameras.main.setBounds(0, 0, window.innerWidth * 2, 0);
    this.cameras.main.startFollow(character, 0.08);


    // Create character animations.
    // Walking to the left animation.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('bunny', {start: 0, end: 4}), // Use frames 0,1,2,3 of sprite sheet
        frameRate: 10, // run above frames at 10 frames per second.
        repeat: -1 // Loop animation
    });

    // Turning animation.
    this.anims.create({
        key: 'turn',
        frames: [{key: 'bunny', frame: 0}], // Use frame 4 of sprite sheet.
        frameRate: 20
    });

    // Walking to the right animation.
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('bunny', {start: 0, end: 4}), // Use frames 5,6,7,8 of sprite sheet.
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('bunny', {start: 1, end: 1}),
        frameRate: 1,
        repeat: 0
    })
    /** ADD COLLISION BETWEEN PLAYER AND PLATFORMS **/
    this.physics.add.collider(character, platforms);
}

// Update assets/Animate assets.
var cursors;

function update() {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) { // Go left.
        character.setVelocityX(-300).setFlipX(false);
        if (character.body.touching.down) {
            character.anims.play('left', true);
        }
    } else if (cursors.right.isDown) { // Go right.
        character.setVelocityX(300).setFlipX(true);
        if (character.body.touching.down) {
            character.anims.play('right', true);
        }
    } else if (cursors.down.isDown) {
        if (!character.body.touching.down) {
            character.y += 2.5;
        }
        character.setVelocityY(350)
        character.anims.play('down', true);
    } else { // Stand still.
        character.setVelocityX(0);
        character.anims.play('turn', true);
    }

    // Jump
    if (cursors.up.isDown && character.body.touching.down) {
        character.setVelocityY(-500);
        character.anims.play('down', true);
    }
}