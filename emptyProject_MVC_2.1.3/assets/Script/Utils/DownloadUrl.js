export const DownloadUrl = {
    iosUrl: 'https://itunes.apple.com/app/id1468229094',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.bluembo.tritos&hl=en_GB',
    
    getUrl: function() {
        let userAgent = navigator.userAgent || navigator.vendor;
        if (/(iPhone|iPad|iPod|iOS|Mac|Safari)/i.test(userAgent)) {
            userAgent = 'ios'
        } else {
            userAgent = 'android'
        }
        return userAgent === 'ios' ? this.iosUrl : this.androidUrl;
    }
}