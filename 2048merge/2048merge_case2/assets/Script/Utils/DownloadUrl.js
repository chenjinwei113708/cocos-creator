export const DownloadUrl = {
    // iosUrl: 'https://apps.apple.com/app/id1547566715',
    iosUrl: 'https://play.google.com/store/apps/details?id=com.eyeah.merge2048',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.eyeah.merge2048',
    
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