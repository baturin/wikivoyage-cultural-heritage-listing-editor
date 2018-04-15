
let AsyncUtils = {
    runSequence(functions, onSuccess, results) {
        if (!results) {
            results = [];
        }

        if (functions.length > 0) {
            let firstFunction = functions[0];
            firstFunction(function (result) {
                results.push(result);
                setTimeout( // hack to break recursion chain
                    function () {
                        AsyncUtils.runSequence(functions.slice(1), onSuccess, results)
                    },
                    0
                );
            });
        } else {
            onSuccess(results);
        }
    }
};

module.exports = AsyncUtils;