
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
    },

    runChunks(runSingleChunkFunction, maxChunkSize, data, onSuccess)
    {
        let chunkRunFunctions = [];
        for (let dataNumStart = 0; dataNumStart < data.length; dataNumStart += maxChunkSize) {
            let dataChunk = data.slice(dataNumStart, dataNumStart + maxChunkSize);
            chunkRunFunctions.push(
                (onSuccess) => runSingleChunkFunction(dataChunk, onSuccess)
            );
        }
        this.runSequence(
            chunkRunFunctions,
            (chunkResults) => {
                let result = chunkResults.reduce((current, total) => total.concat(current), []);
                onSuccess(result);
            }
        );
    }
};

module.exports = AsyncUtils;