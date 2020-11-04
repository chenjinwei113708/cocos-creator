export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/id1513870284',
    androidUrl: 'https://apps.apple.com/app/id1513870284',
    
    getUrl: function() {
        let userAgent = navigator.userAgent || navigator.vendor;
        if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) {
            userAgent = 'ios'
        } else {
            userAgent = 'android'
        }
        return userAgent === 'ios' ? this.iosUrl : this.androidUrl;
    }
}