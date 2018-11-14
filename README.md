# gulp-postcol
This is gulp module to replace java script code in the postman collections. Postman provides hooks for ```pre-request``` and ```test``` so that some java script code can be executed. This code can become huge with time and not following proper coding guidelines will be problematic. Using this gulp plugin, we can replace the java script code from a java script file.


# Usage

```javascript
    var modifyJson = require("gulp-postcol");
```

Create a config object which has mapping for the api and hook.

```javascript
var config = {
    "GetRepoToken": {
        "test": "scripts/getTokenSetEnvironment.js"
    }
}
```

```javascript
gulp.task('json', function () {
    var args = checkArgs();
    gulp.src(['src/**/*.json'])
        .pipe(modifyJson(config))
        .pipe(gulp.dest('dist/'));
});

```

# For a working use case, have a look at [this](https://github.com/ashwanikumar04/postman-collections-scripts)

# Reference

[gulp-jsonminify](https://github.com/tcarlsen/gulp-jsonminify)