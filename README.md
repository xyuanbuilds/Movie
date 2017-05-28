### Node.js+MongoDB建站攻略（一期）参考源码

基于慕课网Scott老师的Node.js+MongoDB建站攻略（第一期）视频教程编写

使用前需要安装Node.JS, MongoDB，相关配置安装百度。

注释都有，视屏讲解也很完整

> 其中有一块地方会显示jade的错误 ，并且报错Cannot read property 'flash' of undefined，其实只是没有为emba传入能够使用的flash地址，控制台会报一个500错误。并且此时从首页进入详细页同样会报错且程序终止。相同的没有给正确的海报地址也会使加载首页时报一个404的错误。但并不会终止。这个错误容易产生混淆。其实jade并没有出错。