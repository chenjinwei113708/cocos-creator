export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/numbers-2048/id1566703312',
    androidUrl: 'https://apps.apple.com/us/app/numbers-2048/id1566703312',
    
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