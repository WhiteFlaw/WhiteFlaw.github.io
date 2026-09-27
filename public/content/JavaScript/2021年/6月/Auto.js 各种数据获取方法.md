# Auto.js 命令&作用(一) 信息获取专题

@[TOC](目录)
<strong>先获取,才能操控.</strong>
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 应用信息获取
| 命令 | 目的 |
|--|--|
| app.versionCode | 获取当前所在应用的版本号. |
| app.versionName | 获取当前所在应用的版本名. |
| app.getAppName(包名) | 获取包名对应的应用名. |
| app.getPackageName(应用名) | 获取应用名对应的包名. |
| currentPackage() | 返回最近一次/当前运行的应用的包名. |
| currentActivity() | 返回最近一次/当前运行的应用名(Activity名). |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 系统信息获取
| 命令 | 目的 |
|--|--|
| getClip() | 获取当前系统剪贴板的内容. |
| runtime.requestPermissions(权限名) | 动态申请安卓权限. |
| device.getMusicVolume() | 返回当前媒体音量. |
| device.getNotificationVolume() | 返回当前通知音量. |
| device.getAlarmVolume() | 返回当前闹钟音量. |
| device.getMusicMaxVolume() | 返回媒体音量最大值. |
| device.getNotificationMaxVolume() | 返回通知音量最大值. |
| device.getAlarmMaxVolume() | 返回闹钟音量最大值. |
| device.getBrightness() | 返回当前手动设置的亮度(范围0-255).
 |
| device.getBrightnessMode() | 返回当前亮度模式,0为手动亮度,1为自动亮度 |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 设备信息获取
| 命令 | 目的 |
|--|--|
| device.getIMEI() | 返回设备IMEI国际移动设备识别码. |
| device.getAndroidId() | 返回设备的安卓ID,一个用16进制字符串表示的64位整数. |
| device.getMacAddress() | 返回设备的MAC地址. |
| device.getBattery() | 返回当前设备电量百分比. |
| device.isCharging() | 设备在充电返回true,否则返回false. |
| device.getTotalMem() | 返回当前设备内存总量,单位B(字节). |
| device.getAvailMem() | 返回当前设备可用内存. |
| device.isScreenOn() | 当前设备亮屏返回true,不亮返回false. |
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 文件信息获取
| 命令 | 目的 |
|--|--|
| files.isFile(path) | 返回这个路径对应的目标是否是一个文件,返回布尔值. |
| files.isDir(path) | 返回这个路径对应的目标是否是一个文件夹,返回布尔值. |
| files.isEmptyDir(path) | 返回目标是否为空文件夹, 返回布尔值,如果连文件夹都不是那直接返回false. |
| files.exists(path) | 返回该路径对应的目标文件是否存在. |
| files.read(path, [ encoding = "utf-8"]) | 返回以utf-8编码(你可以自己换)格式读取到的该路径对应的文本文件的所有内容. |
| files.copy(起始路径, 目标路径) | 复制文件,返回布尔值. |
| files.move(起始路径, 目标路径) | 移动文件,返回布尔值. |
| files.rename(path, 新名字) | 重命名文件(请加上扩展名),返回布尔值. |
| files.renameWithoutExtension(path, newName) | 重命名文件(不要加扩展名),返回是否重命名成功. |
| files.getName(path) | 获取该路径对应文件的文件名,包含扩展名. |
| files.getNameWithoutExtension(path) | 返回该路径对应文件的文件名,不含拓展名. |
| files.getExtension(path) | 只返回路径对应文件的拓展名. |
| ReadableTextFile.readline() | 读取并返回仅一行文本. |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 色彩信息获取
| 命令 | 目的 |
|--|--|
| colors.toString(color) | 返回RGB颜色值字符串("#000"格式). |
| colors.red(color) | 返回RGB色彩模式R通道值数字. |
| colors.green(color) | 返回RGB色彩模式G通道值数字. |
| colors.blue(color) | 返回RGB色彩模式B通道值数字. |
| colors.alpha(color) | 返回Alpha通道值(透明度),范围0-255. |
| colors.parseColor(colorStr) | 返回色彩整数值字符串(#000格式). |
| colors.isSimilar(color1, color2,[ 相似度临界值, 色彩匹配算法]) | 相似度临界值:数值越小匹配越苛刻,要求的相似度要更高才能返回true; 色彩匹配算法:默认为diff,即两色彩RGB数值差的绝对值小于相似度临界值才能算成功;还有"rgb","rgb+","hs"三种其他方法. |
| colors.equals(color1, color2) | 比较传入的两个色彩值是否相等,返回布尔值. |

<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 随机数获取
| 命令 | 目的 |
|--|--|
| random() | 返回[0, 1)之间的随机浮点数 |
| random(min, max) | 返回区间内的随机整数 |
 
<hr style=" border:solid; width:100px; height:1px;" color=#000000 size=1">

# 末
这个系列也开始连更了...目前规划出到第5章,把所有指令的说明提高一下可读性,然后分类整理出来,这样写的时候查起来会方便一些.
话说Auto.js到底算是哪个类别的文章啊喂!