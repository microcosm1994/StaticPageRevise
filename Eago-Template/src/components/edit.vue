<template>
  <div>
    <div>
      <h2>模板列表</h2>
      <button v-for="item in this.template_list" @click="read_file(item)">{{item}}</button>
    </div>
    <div class="show-container">
      <h1>{{template.title}}</h1>
      <p>{{template.sub_title}}</p>
      <img src="../assets/logo.png" alt="">
      <p>{{template.content}}</p>
    </div>
    <div class="edit-container">
      <div class="edit-title">
        <span>编辑标题</span>
        <input type="text" v-model="template.title">
      </div>
      <div class="edit-sub_title">
        <span>编辑小标题</span>
        <input type="text" v-model="template.sub_title">
      </div>
      <div class="edit-content">
        <span>编辑内容</span>
        <input type="text" v-model="template.content">
      </div>
      <button @click="">提交</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'edit',
  data () {
    return {
      template_list: [],
      template: {
        title: '',
        sub_title: '',
        content: ''
      }
    }
  },
  mounted () {
    this.get_filesList()
  },
  methods: {
    get_filesList () {
      this.$http.get('/api/file/template_list').then((response) => {
        if (response.data.status === 0) {
          let data = response.data.data
          this.template_list = data
        }
      })
    },
    read_file (filename) {
      this.$http.get('/api/file/template_read?filename=' + filename).then((response) => {
        console.log(response)
      })
    }
  }
}
</script>
