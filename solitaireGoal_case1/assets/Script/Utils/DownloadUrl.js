export const DownloadUrl = {
    iosUrl: 'https://play.google.com/store/apps/details?id=com.goal.solitaire.topcard',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.goal.solitaire.topcard',
    
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