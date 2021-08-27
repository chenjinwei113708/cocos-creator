# cocos-to-playable-ad
将 cocos creator 构建出来的 web-mobile 项目打包为 playable-ad 项目，即单 html 文件。
一些说明：
- 此项目改编自github的开源项目[cocos-to-playable-ad]:https://github.com/fkworld/cocos-to-playable-ad
- 参考资料：
    - https://github.com/chongshengzhujue/playableFBCompile
    - https://www.ifeelgame.net/cocoscreator/%E4%BD%BF%E7%94%A8cocoscreator%E5%88%B6%E4%BD%9Cfacebook%E7%9A%84playable-ad/
    - 其他网络资料
- 改进部分：
    - 支持 cocos creator 到 2.1.3
    - 完善了核心算法描述（请参考 README.md）
    - 精简了使用流程，并将游戏项目与打包项目完全分开，游戏项目只需要提供 web-mobile 文件夹即可
    - 使用 node.js 完成，完善了开发环境描述，代码注释
- 本项目不包括对图片，声音资源的压缩，需要自行压缩。
- 本项目不包括使用 cocos creator 打包时的模块选择，需要自行筛选。
- 如果使用过程中出现问题，请提交到项目下的 Issues，或者参与论坛讨论，https://forum.cocos.com/t/cocos-creator-web-mobile-playable-ad-html/84260

## 如何使用？
- 开发环境：
    - macOs Cataline 10.15
    - node.js 12.9.0
    - cocos creator 2.1.3
    - Chrome 77
- 输入：使用 cocos creator 构建出来的 web-mobile 项目文件夹。
- 输出：index.html。
- 使用方法：
    1. 用cocos构建出来的 web-mobile 文件夹替换 src 目录下的 web-mobile文件夹 ,不要删除其他脚本。此时目录为：src/web-mobile/...。
    2. （可以不做这一步,已自动化）修改 src/web-mobile/main.js，注释掉 154 到 163 行，目的是不在代码中载入 project.js，而是在流程中载入。
        ```javascript
        // 考虑不同版本下打出来的 main.js 代码位置可能会有差异，未必在相应的行，所以我把需要注释掉的代码补充进来。
        // var bundledScript = settings.debug ? 'src/project.dev.js' : 'src/project.js';
        // if (jsList) {
        //     jsList = jsList.map(function (x) {
        //         return 'src/' + x;
        //     });
        //     jsList.push(bundledScript);
        // }
        // else {
        //     jsList = [bundledScript];
        // }
        ```
    3. （可以不做这一步,已自动化）修改 src/web-mobile/index.html 的 title标签，例如： <title>Cocos Creator | project_name</title> 将project_name 替换成项目名称。
    4. 在cocos-package根目录下执行 npm run build，会显示流程执行过程以及相应的消耗时间。
    5. 点击输出文件 dist/index.html，检查在浏览器中是否显示正常。
    6. 如果打包第一次的文件太大了，可以再执行一次 npm run build ，第二次打包会比第一次的更小。

## 注意
 1.目前已通过测试，支持的文件格式有【mp3、jpg、png、webp】，已知不支持的文件格式有【wav】，其他格式的文件不确定能否压缩成功，如果打包完成之后无法运行，请考虑是否有不支持的格式。

 2.目前视频类的资源已支持MP4打包，但是MP4本身在各类浏览器和机器上的兼容性不是很好，不推荐优先使用。 视频如果不能正常播放，需要把视频的active设置为true之后再试一次。

## 核心算法
- 将项目所依赖的资源读取并写入到 window.res，保存为 res.js。
- 通过 cc.loader.addDownloadHandlers 修改资源载入方式，从 window.res 中载入资源，参考 new-res-loader.js。
- 将 index.html 中所依赖的 css 和 js 文件，包括一些新的 js 文件写入到 html 文件本身。
- （我们自己的方法）将MP4转成base64以及blob格式，修改video标签的source标签，以达到可以播放。

## 依赖模块：
- https://github.com/GoalSmashers/clean-css，压缩 css。
- https://github.com/mishoo/UglifyJS2，压缩 js。
- fs 模块，读写文件。
- path 模块，处理路径相关（其实在项目中只用来获取文件的后缀名）。
- typescript 相关，本项目使用 ts 编写，使用 ts-node 执行。
