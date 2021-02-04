export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/app/id1550892474',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.dicegames.zdice',
    
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