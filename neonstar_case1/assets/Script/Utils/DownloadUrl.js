export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/id1551624759',
    androidUrl: 'https://apps.apple.com/app/id1551624759',
    
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