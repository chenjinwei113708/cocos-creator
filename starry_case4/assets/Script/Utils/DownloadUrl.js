export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/us/app/id1508075700',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.popstar.shinning.starry',
    
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