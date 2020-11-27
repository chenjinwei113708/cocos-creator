export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/id1535896478',
    androidUrl: 'https://apps.apple.com/app/id1535896478',
    
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