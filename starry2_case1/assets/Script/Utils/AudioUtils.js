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

        // // Effect
        // bgClick: {
        //     type: cc.AudioClip,
        //     default: null
        // },

        // // Music
        // bgMusic: {
        //     type: cc.AudioClip,
        //     default: null
        // },

        // 点击按钮
        clickBtn: {
            type: cc.AudioClip,
            default: null
        },

        // 弹出金币卡
        moneyCard: {
            type: cc.AudioClip,
            default: null
        },

        // 弹出通知卡
        notification: {
            type: cc.AudioClip,
            default: null
        },

        // 消除
        eliminate: {
            type: [cc.AudioClip],
            default: []
        }

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
        // if(this.isAudioEnabled) {
        //     cc.audioEngine.playMusic(this.bgMusic, true);
        //     cc.audioEngine.setMusicVolume(0.8);
        // }
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
            let effectId = cc.audioEngine.playEffect(this[effectName], false);
            cc.audioEngine.setEffectsVolume(volumn);

            cc.audioEngine.setFinishCallback(effectId, function () {
                 // 恢复音量
                cc.audioEngine.setMusicVolume(0.8);
            });
        }
    },
    /**
     * 播放消除音效
     * @param {Number} num 第几个爆炸
     * @param {Number} volumn 音量大小
     */
    playBomb (num, volumn = 0.8) {
        if (this.isAudioEnabled) {
            num += 1; // num是从0开始的,所以要加1，才是正确的个数
            const length = this.eliminate.length;
            cc.audioEngine.playEffect(this.eliminate[num % length - 1], false, volumn);
        }
    }

});
