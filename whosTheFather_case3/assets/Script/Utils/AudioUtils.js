// var audioIds = {};

cc.Class({
    extends: cc.Component,
    properties: {
        // 开启声音
        isAudioEnabled: true,

        openVolunmIcon: {
            type: cc.SpriteFrame,
            default: null
        },

        closeVolumnIcon: {
            type: cc.SpriteFrame,
            default: null
        },
        // Music
        // bgMusic: {
        //     type: cc.AudioClip,
        //     default: null
        // },

        // Effect
        right: {
            type: cc.AudioClip,
            default: null
        },
        wrong: {
            type: cc.AudioClip,
            default: null
        },
        youAre: {
            type: cc.AudioClip,
            default: null
        },
        youAreNot: {
            type: cc.AudioClip,
            default: null
        },
        click: {
            type: cc.AudioClip,
            default: null
        },
        moneyCard: {
            type: cc.AudioClip,
            default: null
        },

    },

    onLoad() {

    },

    toggleVolumn() {
        this.isAudioEnabled ? this.closeVolumn() : this.openVolumn()
    },

    openVolumn() {
        this.isAudioEnabled = true;
        this.node.getChildByName('btn').getComponent(cc.Sprite).spriteFrame = this.openVolunmIcon;
        // Music
        this.playBgm();
    },

    closeVolumn() {
        this.isAudioEnabled = false;
        this.node.getChildByName('btn').getComponent(cc.Sprite).spriteFrame = this.closeVolumnIcon;
        cc.audioEngine.stopAll();
        // Music
        // cc.audioEngine.stopMusic();
        // Effect
        // cc.audioEngine.stopEffect();
        
    },
    playBgm() {
        if(this.isAudioEnabled) {
            cc.audioEngine.playMusic(this.bgMusic, true);
            cc.audioEngine.setMusicVolume(0.8);
        }
    },
    /**
     * 
     * @param {String} effectName 音频名
     * @param {Number} volumn 音量大小
     */
    playEffect(effectName, volumn) {
        if ( !this[effectName] ) {
            throw `No audioClip ${effectName}`
        }
        if (this.isAudioEnabled) {
            // 播放音效时bgm声音减低
            cc.audioEngine.setMusicVolume(0.5);
            let effectId = cc.audioEngine.play(this[effectName], false, volumn); // 新方法，调控音量更好
            // let effectId = cc.audioEngine.playEffect(this[effectName], false);
            // cc.audioEngine.setEffectsVolume(volumn);

            cc.audioEngine.setFinishCallback(effectId, function () {
                 // 恢复音量
                cc.audioEngine.setMusicVolume(0.8);
            });
        }
    },
    

});
