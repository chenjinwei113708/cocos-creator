export const DownloadUrl = {
    iosUrl: 'https://apps.apple.com/us/app/stump-me/id1483295074',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.brainpuzzles.roperescue.physicsgames',
    
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