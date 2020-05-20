<template>
  <div>
    <el-dialog title="注册" :visible.sync="dialogVisible" width="40%" @close="dialogVisible = false">
      <span>这是一条dialog</span>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            dialogVisible:false,
        }
    }
};
</script>

<style>
</style>