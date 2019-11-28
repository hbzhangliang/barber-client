<template>
  <el-card :body-style="{ padding: '10px' }" style="padding: 0px;margin: 2px;">
      this is customer
  </el-card>
</template>
<script>

</script>
<style lang="scss">

  .sf-kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }

  .box-card{
    width: 650px;
    min-width: 600px;
    margin: 5px 2px;
  }
</style>
