<template>
  <div>
    {{this.userId }}
  </div>
</template>
<script>
import store from "../../../store";

export default {
  data:{
    userId:''
  },
  created() {
    this.userId = store.getters.userId
  }
}
</script>
<style></style>


