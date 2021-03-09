export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/hexa-tile-go/id1549617936',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.cloegames.hextilego',
    
    getUrl: function() {
        let userAgent = navigator.userAgent || navigator.vendor;
        if (/(iPhone|iPad|iPod|iOS|Mac OS X)/i.test(userAgent)) {
            userAgent = 'ios'
        } else {
            userAgent = 'android'
        }
        return userAgent === 'ios' ? this.iosUrl : this.androidUrl;
    }
}