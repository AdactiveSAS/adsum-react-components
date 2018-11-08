/* eslint-disable func-names */

module.exports = function (api) {
    // set cache to true
    api.cache(true);

    return {
        presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-flow',
        ],
        plugins: ['@babel/plugin-proposal-class-properties'],
    };
};
