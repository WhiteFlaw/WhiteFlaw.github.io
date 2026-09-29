@[TOC](文章目录)

---

# 前言
参考去年参与的大型ERP项目, 我主要负责财务模块的前端部分.
这个项目有几百个前端页面(具体多少没算过), 状态管理结构应该是具有参考价值的.

---


# 一、总体结构
项目标准中约定仅含有报表(或页面即报表)的页面能够使用Vuex. 使用时需要先创建该以该页面名称命名的目录, 目录下应当具备`index.vue`页面主体, `report`报表目录, 如果主页面需要组件那么还应当有`components`目录用于存放组件, 对于该页面中报表所需的组件, 需要在`report`内建立`components`目录存放.

对于页面的状态, 依据所处功能模块进行分类存放, 并在该模块目录同级设置入口文件引入并集中导出该模块状态. 
模块之间依旧据此, 同一大模块下的小模块存放在一起, 同级设立入口文件, 将每个小模块的导出逐个导入集中后再次导出, 得到该大模块的状态.

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/1.png)
当然, 在`所有index.js`入口文件同级, 可以描述对该模块的其他配置.
如果反映到视图, 大概是这样:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/2.png)
下面我会分层说明.

---

# 二、代码结构
## 1. 文件层
激活`namespace`后仅对应管理该页面状态的`JavaScript`文件.
其内部结构也就是`Vuex`代码的基本结构, 包括`state`, `mutations`, `actions`:
即上图`EBEB201R.js`及其并列文件的结构.

```javascript
/**
 * @Description %$%&*((*
 * @Author ??
 * @Date 2022-09-20
 */

import { xxxSearch } from '@/api/xxx/xxxx'

const state = {
  reportId: 'xxxx',
  reportTitle: 'xxxxxx月度表（一）',
  dataTotal: 0,
  reportDataNoPag: [],
  reportDataPag: [],
  rawReportDataPag: [],
  reportTableData: [],
  columnTotal: []
}

const mutations = {
  SET_RAW_ROW (state, data) {},
  
  SET_TABLE_LOADING(state, data) {},
  
  SET_TABLE_DATE(state, data) {},
  
  SET_TABLE_EVENT (state, event) {},
  
  SET_SON_EVENT(state, data) {},
  
  SET_COLUMN_TOTAL(state, data) {}
}

const actions = {
  generateTableEvent ({ commit }, headerArr) {},

  async initTableData ({ commit, dispatch }, queryParams) {},

  updateTableData ({ commit, state }, pageIndex) {},

  initActions ({ commit, state }) {},

  resetData ({ commit }, params) {}
}

export default {
  namespaced: true,
  mutations,
  actions,
  state
}
```
另外为了防止混淆, `mutations`方法名统一使用大写.

然后所有的该模块下页面文件用`modules`目录包裹, 这些页面状态不应当与 对该功能模块的状态配置和入口文件 混杂在一起, 参考`EBE_1/E_C_ZZZ/modules`.

有关`namespace`:
store对象会因为过多的状态变得臃肿, 而`namespace`启用后, 允许`store`内的状态模块化, 一个单独的模块将拥有自己的`state, mutation, actions`, 相当于每个页面的状态独立但是集中的存储在了store里, 而非一体化的存储于store中, 在页面中以下方式调用:

```javascript
import {mapActions, mapMutations, mapState} from 'vuex'
```

```javascript
// computed
...mapState('模块名', [ // 模块名和导出时的名称有关
  'reportId',
  'beforeOutData',
  'reportTableData'
])
```

```javascript
// methods
...mapMutations('模块名', [
  'SET_PRINT_FLAG',
  'SET_TABLE_DATE',
  'SET_TABLE_LOADING',
  'SET_EXCEL_OUT_FLAG',
  'SET_REPORT_PRINT_DATA'
]),
...mapActions('模块名', ['initTableData', 'initActions', 'resetData']),

this['SET_TABLE_DATE'](this.effcDate)
```


---

## 2. 一级功能模块
即文件直属的功能模块目录, 内部应当具备`index.js`入口文件来导出该模块下所有页面的状态, 和一些仅针对该模块的配置:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/3.png)

```javascript
/**
 * @Description %&*^*(&^*%$%&
 * @Author ??
 * @Date 2022-09-20
 */

import EBEB201R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB201R'
import EBEB202R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB202R'
import EBEB203R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB203R'
import EBEB204R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB204R'
import EBEB205R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB205R'
import EBEB206R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB206R'
import EBEB207R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB207R'
import EBEB208R from '@/store/modules/report/EBE_1/E_C_ZZZ/modules/EBEB208R'

export const E_C_ZZZReportModule = {
  EBEB201R,
  EBEB202R,
  EBEB203R,
  EBEB204R,
  EBEB205R,
  EBEB206R,
  EBEB207R,
  EBEB208R
}
```

---

## 3. 二级功能模块
逻辑同二级功能模块, 逐个导入然后集中导出:

![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/4.png)

```javascript
/**
* @author ??
* @date 2022-7-4
* @description index
*/

import { EBECCReportModules } from '@/store/modules/report/EBE_1/xxx'
import { EBECReportModule } from '@/store/modules/report/EBE_1/xxx'
import { EBEBReportModule } from '@/store/modules/report/EBE_1/xx'
import { EBEBBReportModule } from '@/store/modules/report/EBE_1/xx'
import { EBEWReportModule } from '@/store/modules/report/EBE_1/xxx'
import { EBEYReportModule } from '@/store/modules/report/EBE_1/xxxx'
import { E_C_ZZZReportModule } from '@/store/modules/report/EBE_1/E_C_ZZZ'

export const EBE1ReportModules = {
  ...EBECReportModule,
  ...EBEBReportModule,
  ...EBECCReportModules,
  ...EBEWReportModule,
  ...EBEYReportModule,
  ...EBEBBReportModule,
  ...E_C_ZZZReportModule
}
```

---

## 4. 总状态
得到最终传入Vuex类中, 去实例化挂载到Vue的状态:
![在这里插入图片描述](../../../../img/前端/2022年/10月/读Vue%202源码一/5.png)
将`report`内所有一级功能模块的导出在`report/index.js`再次集中后导出:

```javascript
// report/index.js
/*
 * @author ??
 * @date 2022-7-4
 * @description index
 */

import { EBEReportModules } from '@/store/modules/report/EBE'
import { EBE_1ReportModule } from '@/store/modules/report/EBE_1'
import { EBFReportModule } from '@/store/modules/report/EBF'

export const ReportModules = {
  ...EBEReportModules,
  ...EBE_1ReportModule,
  ...EBFReportModule
}
```
然后随着其他诸如`permission.js`和`user.js`配置一起引入到上图的`index.js`, 进行Vuex实例的生成和挂载.

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import { reportModule } from '@/store/modules/report'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    tagsView,
    user
  }
})

export default store
```

---

# 总结
好吧, 希望这能帮得上忙.