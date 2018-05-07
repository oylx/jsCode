window.Model = function(options){
    let resourceName = options.resourceName
    return {
        init: function () {
            var APP_ID = 'MPdVob3eDCDDPi0m6LcYvkEr-gzGzoHsz';
            var APP_KEY = 'FTInetMAy7Xq9mJ94ipTLP2k';
            AV.init({
                appId: APP_ID,
                appKey: APP_KEY
            });
        },
        fetch: function () {
            let query = new AV.Query(resourceName)//闭包
            return query.find()//promise对象
        },
        save: function (Object) {
            var X = AV.Object.extend(resourceName);
            var x = new X();
            // return message
            return x.save({  // Promise 对象
                Object
            })
        }
    }
}