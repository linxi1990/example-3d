import { _decorator, Component, math, systemEvent, SystemEvent, game, macro, director } from "cc";
const { ccclass, property, menu } = _decorator;

const v2_1 = new math.Vec2();
const v2_2 = new math.Vec2();
const v3_1 = new math.Vec3();
const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    SHIFT: macro.KEY.shift,
};

@ccclass("SIMPLE-HOLE.MotionCtr")
@menu("demo/simple-hole/MotionCtr")
export class MotionCtr extends Component {

    @property
    moveSpeed = 1;

    @property
    moveSpeedShiftScale = 5;

    @property({ slide: true, range: [0.05, 0.5, 0.01] })
    damp = 0.2;

    _euler = new math.Vec3();
    _velocity = new math.Vec3();
    _position = new math.Vec3();
    _speedScale = 1;

    start () {
        math.Vec3.copy(this._euler, this.node.eulerAngles);
        math.Vec3.copy(this._position, this.node.position);
    }

    update (dt) {
        // position
        math.Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        math.Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        math.Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);

        v3_1.x = math.clamp(v3_1.x, -45, 45);
        v3_1.z = math.clamp(v3_1.z, -45, 45);
        this.node.setPosition(v3_1);
    }

    onDestroy () {
        this._removeEvents();
    }

    onEnable () {
        this._addEvents();
    }

    onDisable () {
        this._removeEvents();
    }

    private _addEvents () {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    private _removeEvents () {
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onKeyDown (e) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (e.keyCode === KEYCODE.W) { if (v.z === 0) { v.z = -1; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z === 0) { v.z = 1; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x === 0) { v.x = -1; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x === 0) { v.x = 1; } }
    }

    onKeyUp (e) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (e.keyCode === KEYCODE.W) { if (v.z < 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z > 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x < 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x > 0) { v.x = 0; } }
    }

    onTouchStart (e) {
        if (game.canvas.requestPointerLock) game.canvas.requestPointerLock();
    }

    onTouchMove (e) {
        e.getStartLocation(v2_1);

        e.getLocation(v2_2);
        math.Vec2.subtract(v2_2, v2_2, v2_1);
        this._velocity.x = v2_2.x * 0.01;
        this._velocity.z = -v2_2.y * 0.01;
        this._velocity.x = this._velocity.x < 0 ? this._velocity.x - 0.75 : this._velocity.x + 0.75;
        this._velocity.z = this._velocity.z < 0 ? this._velocity.z - 0.75 : this._velocity.z + 0.75;
    }

    onTouchEnd (e) {
        if (document.exitPointerLock) document.exitPointerLock();
        e.getStartLocation(v2_1);
        this._velocity.x = 0;
        this._velocity.z = 0;
    }

    changeEnable () {
        this.enabled = !this.enabled;
    }
}
