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
            action="/api/file/uploadimg"
            name="img"
            :data="{
              name: this.template.name,
              type: 'logo'
            }"
            :on-success="img_success"
            :headers="headers"
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
            action="/api/file/uploadimg"
            name="img"
            :data="{
              name: this.template.name,
              type: 'banner'
            }"
            :on-success="img_success"
            :headers="headers"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="正则替换图片" name="4">
          <el-alert
            title="使用正则表达式全局匹配图片路径，实现替换，上传图片之前请先输入原网页中的图片src。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入原网页中图片路径"
            v-model="imgurl_regex"
            clearable>
          </el-input>
          <el-upload v-if="this.imgurl_regex"
            class="upload-demo"
            drag
            action="/api/file/uploadimg"
            name="img"
            :data="{
              name: this.template.name,
              imgurl_regex: this.imgurl_regex,
              type: 'regex'
            }"
            :headers="headers"
            :on-success="img_success"
            list-type="picture">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-collapse-item>
        <el-collapse-item title="正则全局替换文字" name="5">
          <el-alert
            title="输入页面要替换的内容，可以是文字、数字、代码，修改代码内容请慎重。"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请填写要替换的内容"
            v-model="regexp_text.text_before"
            clearable>
          </el-input>
          <el-alert
            title="输入新的内容进行替换"
            type="info"
            :closable="false">
          </el-alert>
          <el-input
            placeholder="请输入新的内容"
            v-model="regexp_text.text_after"
            clearable>
          </el-input>
          <el-alert
            title="提交内容并预览效果"
            type="info"
            :closable="false">
          </el-alert>
          <el-button type="primary" @click="revise_text">提交</el-button>
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'enctype': 'multipart/form-data'
      },
      activeName: '1',
      template_url: '',
      imgurl_regex: '',
      template: {
        name: '',
        type: '',
        value: {
          title: '',
          url: '',
          btn: ''
        }
      },
      regexp_text: {
        text_before: '',
        text_after: ''
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
    },
    img_success () {
      this.$refs.iframe.contentWindow.location.reload(true)
    },
    revise_text () {
      let data = this.regexp_text
      data.name = this.template.name
      this.$http.post('/api/file/revise_text', data).then((response) => {
        if (response.data.status === 0) {
          this.img_success()
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
  .edit-container button{
    margin-top: 20px;
    width: 70%;
  }
  .upload-demo{
    padding-top: 20px;
  }
</style>
