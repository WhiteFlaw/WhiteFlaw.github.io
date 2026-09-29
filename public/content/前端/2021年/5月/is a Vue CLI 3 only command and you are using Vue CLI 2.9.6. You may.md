---
title: is a Vue CLI 3 only command and you are using Vue CLI 2.9.6. You may
date: 2021-05-24
cover: /img/d1.webp
desc: is a Vue CLI 3 only command and you are using Vue CLI 2.9.6. You may
tags: [CSS, 前端]
sticky: false
---

# 项目场景：
Vue-cli3执行生成脚手架,这个bug已解决;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 问题描述：
vue-cli3安装完成,执行初始化vue create xxx,提示:
is a Vue CLI 3 only command and you are using Vue CLI 2.9.6. You may want to......;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 原因分析：
<strong>你可以忽略这部分直接看最下解决方案;</strong>

推测未成功安装,依据意见,以管理员权限运行cmd:

```javascript
C:\windows\system32>npm install -g @vue/cli
npm WARN deprecated @hapi/joi@15.1.1: Switch to 'npm install joi'
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated @hapi/address@2.1.4: This version has been deprecated and is no longer supported or maintained
npm WARN deprecated @hapi/bourne@1.3.2: This version has been deprecated and is no longer supported or maintained
npm WARN deprecated @hapi/hoek@8.5.1: This version has been deprecated and is no longer supported or maintained
npm WARN deprecated @hapi/topo@3.1.6: This version has been deprecated and is no longer supported or maintained
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm WARN deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
D:\toolkit\node_global\vue -> D:\toolkit\node_global\node_modules\@vue\cli\bin\vue.js
+ @vue/cli@4.5.13
updated 1 package in 56.355s
```



未报错;

再次执行vue create xxx,相同报错,未解决;

删除AppData的npm_cache文件,无效,删除后npm安装vuecli3开始报错npm ERR! code EPERM npm ERR! syscall unlink

已安装cnpm,推测为此导致的权限问题;
尝试cnpm安装vuecli3,安装时抛出报告有不同:

```javascript
C:\windows\system32>cnpm i @vue/cli -g
Downloading @vue/cli to D:\toolkit\node_global\node_modules\@vue\cli_tmp
Copying D:\toolkit\node_global\node_modules\@vue\cli_tmp\_@vue_cli@4.5.13@@vue\cli to D:\toolkit\node_global\node_modules\@vue\cli
Installing @vue/cli's dependencies to D:\toolkit\node_global\node_modules\@vue\cli/node_modules
[1/35] @types/ejs@^2.7.0 installed at node_modules\_@types_ejs@2.7.0@@types\ejs
[2/35] commander@^2.20.0 installed at node_modules\_commander@2.20.3@commander
[3/35] deepmerge@^4.2.2 installed at node_modules\_deepmerge@4.2.2@deepmerge
[4/35] @vue/cli-ui-addon-widgets@^4.5.13 installed at node_modules\_@vue_cli-ui-addon-widgets@4.5.13@@vue\cli-ui-addon-widgets
[5/35] debug@^4.1.0 installed at node_modules\_debug@4.3.1@debug
[6/35] @vue/cli-ui-addon-webpack@^4.5.13 installed at node_modules\_@vue_cli-ui-addon-webpack@4.5.13@@vue\cli-ui-addon-webpack
[7/35] ejs@^2.7.1 installed at node_modules\_ejs@2.7.4@ejs
[8/35] envinfo@^7.5.1 installed at node_modules\_envinfo@7.8.1@envinfo
[9/35] cmd-shim@^3.0.3 installed at node_modules\_cmd-shim@3.0.3@cmd-shim
[10/35] ini@^1.3.5 installed at node_modules\_ini@1.3.8@ini
[11/35] boxen@^4.1.0 installed at node_modules\_boxen@4.2.0@boxen
[12/35] isbinaryfile@^4.0.6 installed at node_modules\_isbinaryfile@4.0.8@isbinaryfile
[13/35] fs-extra@^7.0.1 installed at node_modules\_fs-extra@7.0.1@fs-extra
[14/35] javascript-stringify@^1.6.0 installed at node_modules\_javascript-stringify@1.6.0@javascript-stringify
[15/35] import-global@^0.1.0 installed at node_modules\_import-global@0.1.0@import-global
//余部略;
```

未报错;

重启VSCode,尝试执行vue create xxx;
不再报错npm ERR! code EPERM npm ERR! syscall unlink;

失败,相同报错s a Vue CLI 3 only command and you are using Vue CLI 2.9.6......;

检查vue -V,返回2.9.6,卸载无效,新版本安装未报错,推测覆盖失败;
删除C:/用户/hp/.npmrc文件
执行寻找:
C:\Users\hp>where vue
C:\Users\hp\AppData\Roaming\npm\vue
C:\Users\hp\AppData\Roaming\npm\vue.cmd
删除上二文件;

再次执行全局卸载npm uninstall vue-cli -g,出现长时卡顿,等待from21:58;
卡顿;
等待to22:05:蚌埠住了,取消执行;

再执行from22:07;
till22:10:fetchMetadata: sill resolveWithNewModule mime-db@1.47.0 checking installable status;
尝试还原npm-cache文件夹至原位置,还原开始10s+后卸载执行完成,还原未完成,取消还原;
推测checking installable status检索花费长时,非因缺失npm-cache内部文件;

卸载执行完毕,vue -V检查版本号;
vue -V未检索到版本号,推测成功卸载;

开始尝试第5次执行全局安装vue-cli3.0;
执行npm install -g @vue/cli from22:16;
till22:20,等待长时卡顿中:
fetchMetadata: sill resolveWithNewModule ansi-regex@5.0.0 checking installable status;
to22:28 卡顿,取消执行;

再执行cnpm install @vue/cli -g;
完成at22:30;
执行vue -V:@vue/cli 4.5.13;
终止;

VSCode重启执行vue create testvuecli3;
生成配置文件;
🎉  Successfully created project testvuecli3. At 22:35;

完毕 at 22:35;
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 解决方案：
删除C:/用户/hp/.npmrc文件
执行寻找:
C:\Users\hp>where vue
抛出:
C:\Users\hp\AppData\Roaming\npm\vue
C:\Users\hp\AppData\Roaming\npm\vue.cmd
删除上二;

再次执行全局卸载npm uninstall vue-cli -g

(中途尝试还原npm-cache文件夹至原位置,还原开始10s+后卸载执行完成,还原完成小部分,取消还原)

全局卸载执行完毕,vue -V检查版本号;
vue -V未检索到版本号,推测成功卸载;

执行cnpm install @vue/cli -g;

执行vue -V:@vue/cli 4.5.13;

终止;

VSCode重启执行vue create testvuecli3;
🎉  Successfully created project testvuecli3.

完毕.


