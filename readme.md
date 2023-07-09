# Tarsus-Loader

## use

需要在Webpack里面添加规则配置

````js
{
    test: /\.taro$/,
    use: {
        loader: 'tarsus-loader'
    }
}
````

然后会导出对应的类型，和接口等模块;
