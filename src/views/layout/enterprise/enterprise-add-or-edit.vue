<template>
  <el-dialog
    class="addList"
    center
    :visible.sync="dialogVisible"
    width="600px"
    @close="dialogVisible = false"
  >
    <div slot="title" class="title">{{mode == "add"? '新增企业':'编辑企业'}}</div>
    <el-form :model="addForm" ref="addForm" label-width="80px" :rules="rules">
      <el-form-item label="企业编号" prop="eid">
        <el-input v-model.trim.number="addForm.eid"></el-input>
      </el-form-item>
      <el-form-item label="企业名称" prop="name">
        <el-input v-model.trim="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" prop="short_name">
        <el-input v-model.trim="addForm.short_name"></el-input>
      </el-form-item>
      <el-form-item label="企业简介" prop="intro">
        <el-input v-model.trim="addForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="企业备注" prop="remark">
        <el-input v-model.trim="addForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click=" dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "enterpriseAddOrEdit",
  data() {
    return {
      dialogVisible: false,
      mode: "add",
      addForm: {
        eid: "",
        name: "",
        short_name: "",
        intro: "",
        remark: ""
      },
      rules: {
        eid: [
          { required: true, message: "企业编号不能为空", trigger: "blur" },
          {
            type: "number",
            min: 1,
            max: 99,
            message: "企业编号必须为数字,最小为1,最大为99",
            trigger: "blur"
          }
        ],
        name: [
          { required: true, message: "企业名称不能为空", trigger: "blur" }
        ],
        short_name: [
          { required: true, message: "企业简称不能为空", trigger: "blur" }
        ],
        intro: [
          { required: true, message: "企业简介不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return;
        }
        let res = null;
        if (this.mode == "add") {
          //新增企业
          res = await this.$axios({
            method: "post",
            url: "/enterprise/add",
            data: this.addForm
          });
        } else {
          //修改企业
          res = await this.$axios({
            method: "post",
            url: "/enterprise/edit",
            data: this.addForm
          });
        }
        console.log(res);
        if (res.data.code == 200) {
          //提示成功
          this.$message.success(
            this.mode == "add" ? "新增企业成功" : "修改企业成功"
          );
          //关闭弹窗
          this.dialogVisible = false;
          //刷新父页面数据
          this.$parent.search();
        }
      });
    }
  }
};
</script>

<style lang="less">
.addList {
  .el-dialog__header {
    padding: 0;
    .title {
      text-align: center;
      background-color: #0e9cfa;
      color: #fff;
      height: 53px;
      line-height: 53px;
    }
    .el-dialog__close {
      color: #fff;
    }
  }
}
</style>