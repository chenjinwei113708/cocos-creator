export const DownloadUrl = {
    iosUrl: 'https://play.google.com/store/apps/details?id=com.idle.bowling.baoling',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.idle.bowling.baoling',
    
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