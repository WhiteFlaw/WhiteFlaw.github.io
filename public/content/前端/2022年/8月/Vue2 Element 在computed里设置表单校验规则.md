@[TOC](文章目录)

---

# 前言
需要用计算属性将表单校验规则返回, 但是刚开始就是不行, 即便返回完全一样的东西让`prop`属性完全相同, 校验并不生效, 我觉得应该是会对校验规则对象进行一个检验, 只会使用绑定在表单上的校验规则对象上的校验规则.

但是我就没想到, 我就不能直接把整个`rules`校验对象都放`computed`里吗? 我怎么就非要一条一条的放然后分别返回呢...

---


# 一、改动前
实测model和ref不需要相同, 我今天看到有人说要相同才行.
```html
<template>
  <div class="app-container">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col>
          <el-form-item label="活动形式" prop="region1">
            <el-input v-model="ruleForm.region1"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="需要餐具" prop="region2">
            <el-radio-group v-model="ruleForm.region2">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item prop="button">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >submit</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    xingshi: {{ rules.xingshi }}<br />
    rules.checkbox: {{ rules.checkbox }}
  </div>
</template>
```

```javascript
export default {
  name: "FormPra",
  data() {
    return {
      ruleForm: {
        region1: "",
        region2: "",
      },
      rules: {
        region1: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region2: [
          //{ required: true, validator: this.checkEmail(), trigger: "change" },
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
```

# 二、将校验规则放到computed
要点就是把整个rule校验规则对象放进去返回, 而不是一个一个的用校验项函数返回校验数组:

```javascript
export default {
  name: "FormPra",
  data() {
    return {
      ruleForm: {
        region1: "",
        region2: "",
      },
    };
  },
  computed: {
    rules() {
      //可能必须要一个函数返回一个完整的rules, 单单返回校验规则是不行的;
      let rules = {
        region1: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region2: [
          //{ required: true, validator: this.checkEmail(), trigger: "change" },
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
      };
      return rules;
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
```

---

# 总结
前天刚看见过, 我记得挺简单的, 今天突然想不起来了.
哎, 现在业务不熟练, 多记一下项目里的要点.