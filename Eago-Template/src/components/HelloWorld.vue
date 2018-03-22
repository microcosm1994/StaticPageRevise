<template>
  <div class="container">
    <div id='stars'></div>
    <div id='stars2'></div>
    <div id='stars3'></div>
    <h1>Template List</h1>
    <div class="card-container">
      <el-carousel :interval="4000" type="card" height="700px">
        <el-carousel-item v-for="item in this.template_list" :key="item.filename">
          <h3>{{item.filename}}</h3>
          <div class="views_box">
            <iframe :src="item.fileurl"  frameborder="0"></iframe>
          </div>
          <el-button type="primary" @click="read_file(item.filename)">创建模板</el-button>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      template_list: []
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
        if (response.data.status === 0) {
          this.$router.push({
            name: 'edit',
            path: '/edit',
            query: {
              filename: filename,
              url: response.data.data.url
            }
          })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../static/css/stars.css";
  .container{
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;
  }
  h1{
    width: 100%;
    text-align: center;
    font-size:50px;
    font-weight: 700;
    color:#fff;
  }
  .card-container{
    width: 80%;
    margin: 0 auto;
  }
  .views_box{
    width: 350px;
    height: 550px;
    overflow: hidden;
    margin: 0 auto;
  }
  .views_box iframe{
    display: block;
    width: 104%;
    height: 550px;
  }
  .el-carousel__item h3 {
    color: #fff;
    font-size: 14px;
    opacity: 0.75;
    line-height: 50px;
    margin: 0;
    background: #333333;
  }
  .el-button{
    width: 350px;
    margin-top: 20px;
    font-size:20px;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: rgba(0,0,0,0.7);
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: rgba(0,0,0,0.7);
  }
</style>
