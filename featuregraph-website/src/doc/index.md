# Feature Graph

How to instrument your app:

```
<head>

    ...

    <script>
        var config = {
            acc: '<Your Account ID>',
            aid: '<Your Application ID>',
            prod_hostname: '<Your Prod Environment Hostname (optional)>'
        };

        (function (accid, appid, version, isRelease) {
            window['featuregraph.net'] = { config };
            var js = document.createElement('script');
            var fjs = document.getElementsByTagName('script')[0];
            js.src = "http://agent.featuregraph.net/featuregraph.bundle.min.js";
            js.async = 1;
            fjs.parentNode.insertBefore(js, fjs);
        })(config);
    </script>
</head>
```