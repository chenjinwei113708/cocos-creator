export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/cn/app/id1525846626',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.merge.banana',
    
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