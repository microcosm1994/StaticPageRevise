<template>
  <div class="edit">
    <div class="edit-container">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item name="1">
          <template slot="title">
            普通修改<i class="header-icon el-icon-info"></i>
          </template>
          <el-alert
            title="标题即为页面大标题，内容为空则不修改。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请编辑标题"
            v-model="template.value.title"
            clearable>
          </el-input>
          <el-alert
            title="URL链接，默认全局替换，为空则不修改。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入URL链接"
            v-model="template.value.url"
            clearable>
          </el-input>
          <el-alert
            title="按钮，如果页面有俩个或俩个以上按钮，请使用正则全局替换，为空则不修改。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请填写按钮文字"
            v-model="template.value.btn"
            clearable>
          </el-input>
          <el-alert
            title="确认无误后提交修改内容并预览效果"
            type="info"
            :closable="false">
          </el-alert>
          <el-button @click="revise_view(template)" type="primary">提交</el-button>
        </el-collapse-item>
        <el-collapse-item title="logo替换" name="2">
          <el-alert
            title="logo为landingPage标志性图片，为空则不替换。"
            type="info"
            :closable="false">
          </el-alert>
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :file-list="fileList3"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="banner替换" name="3">
          <el-alert
            title="banner为landingPage商品图片，为空则不替换。"
            type="info"
            :closable="false">
          </el-alert>
          <el-upload
            class="upload-demo"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :file-list="fileList3"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="正则全局替换" name="4">
          <el-alert
            title="输入页面要替换的内容，可以是文字、数字、代码，修改代码内容请慎重"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请填写要替换的内容"
            clearable>
          </el-input>
          <el-alert
            title="输入新的内容进行替换"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入新的内容"
            clearable>
          </el-input>
          <el-alert
            title="提交内容并预览效果"
            type="info"
            :closable="false">
          </el-alert>
          <el-button type="primary">提交</el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="show-container">
      <div class="iframe-box">
        <iframe :src="this.template_url" frameborder="0" ref="iframe"></iframe>
      </div>
      <el-button @click="deletedir()" type="primary">删除模板</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'edit',
  data () {
    return {
      fileList3: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        status: 'finished'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        status: 'finished'
      }],
      activeName: '1',
      template_url: '',
      template: {
        name: '',
        type: '',
        value: {
          title: '',
          url: '',
          btn: ''
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.template.name = this.$route.query.filename
      this.template_url = this.$route.query.url
      this.template_url = 'http://' + this.template_url.slice(this.template_url.indexOf('demo.eago.world'), this.template_url.length)
      console.log(this.template_url)
    },
    revise_view (template) {
      this.$http.post('/api/file/revise_view', template).then((response) => {
        if (response.data.status === 0) {
          console.log(response.data)
          this.$refs.iframe.contentWindow.location.reload(true)
          console.log(this.$refs.iframe)
        }
      })
    },
    deletedir () {
      this.$http.get('/api/file/deletedir?name=' + this.template.name).then((response) => {
        if (response.data.status === 0) {
          console.log(response.data.message)
          this.$router.push({path: '/'})
        }
      })
    }
  }
}
</script>
<style>
  html, body{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: #f5f5f5;
  }
  .edit{
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    padding-top: 100px;
    box-sizing: border-box;
  }
  .show-container{
    display: inline-block;
    vertical-align: top;
    width: 350px;
    height: 750px;
    margin-left: 50px;
  }
  .show-container .iframe-box{
    border:2px solid #e2e2e2;
    width: 100%;
    height: 690px;
    overflow: hidden;
  }
  .show-container .iframe-box iframe{
    width: 104%;
    height: 100%;
  }
  .show-container button{
    width: 80%;
    margin-top: 10px;
  }
  .edit-container{
    display: inline-block;
    vertical-align: top;
    width: 400px;
    height: 750px;
    background: rgba(0,0,0,0.3);
  }
</style>
