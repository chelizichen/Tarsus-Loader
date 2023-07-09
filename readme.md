# Tarsus-Loader

## Use

需要在tarsus.config.js里的clinetChain函数中添加对应的规则配置
[示例的规则配置如下](https://github.com/chelizichen/Tarsus-GateWay/blob/main/tarsus.config.js)

````js
    clientChain: function (chain) {
      chain.module
      .rule('taro')
      .test(/\.taro$/)
      .use('tarsus-loader')
      .loader('tarsus-loader')
      .options({
        http: '@/utils/axios',
      });

    },
````

然后会导出对应的类型，和接口等模块;
其中 options.http 需要指定配置好的axios 默认导出的路径;

## Example

首先需要定义taro协议接口
````java
interface TaroInterFace  {
    int getUserById(Request : GetUserByIdReq, Response : GetUserByIdRes);
    int getUserList(Request : GetUserListReq, Response : GetUserListRes);
};
````

然后在文件中导出对应的接口

````js
<script setup lang="ts">
import TaroUser,{getUserById} from './taro/TaroUser';
import { onMounted } from 'vue';

onMounted(async () => {
  console.log(TaroUser);
  await getUserById({a:1})
})
</script>
````

分别请求的URL路径为

````JS
TaroInterFace/getUserById
TaroInterFace/getUserList
````
