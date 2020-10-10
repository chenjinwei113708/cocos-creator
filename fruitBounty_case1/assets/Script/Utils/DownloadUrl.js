export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/id1532199313',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.fruit.knife.juice',
    
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