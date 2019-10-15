<style lang="less">
  .count-style{font-size: 25px;}
  .infor{display: flex;flex-flow: column;flex: 0 0 25%;justify-content: space-between;height: 42px;line-height:42px;}
  .cont-card{color:#fff;width: 45%;height: 80%;display: inline-block;position:relative}
  .cont-title{font-size: 14px;font-weight: bold}
  .cont-box{width: 34%;height: 200px;background: white;display: inline-block;margin: 15px 2% 15px 0;padding:15px;}
  .cont-box img{top:30%;left:5px; height:20%}
  .cont-text{position: absolute;top:30%;right: 5px;font-size: 14px}
  .cont-num{position: absolute;top:45%;right:5px;font-size: 16px}
  .cont-right-sr{height: 30%;line-height: 40px;padding-left: 15px;color: white}
  .cont-right-dd{height: 50%;line-height: 64px;padding-left: 15px;color: white}
</style>

<template>
  <div style="margin: 25px;">
    <div style="width: 50%;display: inline-block;background: white;padding-left: 10%">
      <div style="font-size: 16px;font-weight: bold">测试中餐厅</div>
      <div>
        <Badge status="error" />营业时间8:00-22:00
      </div>
    </div>
    <div style="display: flex;flex:1 1 0%;height:42px;width:50%;background: white;float: right">
      <span class="infor">
            <span>未读消息0条</span>
          </span>
      <span class="infor">
            <span>菜品数量5条</span>
          </span>
      <span class="infor">
            <span>激活会员1条</span>
          </span>
      <span class="infor">
            <span>员工数量1条</span>
          </span>
    </div>
    <!--收入-->
    <div class="cont-box">
      <div class="cont-title">今日实收</div>
      <div class="cont-card" style="background: linear-gradient(-90deg, #2989ce 0%, #29bdd9 100%);">
        <img src="">
        <div class="cont-text">今日订单数(笔)</div>
        <div class="cont-num">25</div>
      </div>
      <div style="width: 50%;float: right">
        <div class="cont-right-sr" style="margin-bottom: 5%;background: linear-gradient(-90deg, #48ce85 0%, #19d971 100%)">营业收入0元</div>
        <div class="cont-right-sr" style="margin-bottom: 5%;background: linear-gradient(-90deg, #cece3c 0%, #d0d971 100%)">充值收入12元</div>
        <div class="cont-right-sr" style="background: linear-gradient(-90deg, #d94f4f 0%, #ce857e 100%)">快捷收入1元</div>
      </div>
    </div>
    <!--订单-->
    <div class="cont-box">
      <div class="cont-title">今日订单</div>
      <div class="cont-card" style="background: linear-gradient(-90deg, #d982c7 0%, #c49dce 100%);">
        <img src="">
        <div class="cont-text">今日订单数(笔)</div>
        <div class="cont-num">25</div>
      </div>
      <div style="width: 50%;float: right">
        <div class="cont-right-dd" style="margin-bottom: 5%;background: linear-gradient(-90deg, #48ce85 0%, #19d971 100%)">堂食订单0(笔)</div>
        <div class="cont-right-dd" style="background: linear-gradient(-90deg, #cece3c 0%, #d0d971 100%)">外卖/预约订单1(笔)</div>
      </div>
    </div>
    <!--消息-->
    <div class="cont-box" style="width: 28%;margin: 15px 0">
      <div class="cont-title">消息通知</div>
      <div style="height: 80%">
        <div>1.消息通知1消息通知1消息通知1</div>
      </div>

    </div>
    <div>
      店铺概况&nbsp;
      <RadioGroup type="button">
        <Radio label="now">今日</Radio>
        <Radio label="week">最近7天</Radio>
        <Radio label="month">最近30天</Radio>
      </RadioGroup>
    </div>
    <div style="width: 75%;height: 200px;display: inline-block" id="chart-div"></div>
    <div style="width: 20%;height: 200px;display: inline-block;float: right" id="circle-chart"></div>
    <div style="width: 35%;margin-right: 2%;display: inline-block">
      <div>热销菜品top10(根据销量排行)</div>
      <i-table border :columns="column1" :data="data1" style="margin-top: 15px;text-align: center"></i-table>
    </div>
    <div style="width: 35%;display: inline-block">
      <div>热销菜品top10(根据销量排行)</div>
      <i-table border :columns="column1" :data="data1" style="margin-top: 15px;text-align: center"></i-table>
    </div>
  </div>
</template>

<script>

import echarts from 'echarts'

export default {
  name: 'home',
  lineChart: null,
  circleChart: null,

  data () {
    return {
      column1: [
        {
          title: '排名',
          key: 'rank',
          align: 'center'
        },
        {
          title: '菜名',
          key: 'name',
          align: 'center'
        },
        {
          title: '销量',
          key: 'num',
          align: 'center'
        },
        {
          title: '销售额',
          key: 'money',
          align: 'center'
        }
      ],
      data1: [
        {
          rank: '0251',
          num: '3星级',
          money: '111',
          name: '鲁菜'
        },
        {
          rank: '0136',
          num: '1星级',
          money: '101',
          name: '川菜'
        },
        {
          rank: '013',
          num: '2星级',
          money: '150',
          name: '湘菜'
        }
      ]
    }
  },
  created: function () {

  },
  computed: {
    exampleChartOption () {
      // let xAxisData = []
      // let seriesData = []
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['列子']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [10, 20, 30, 40, 50, 60, 70]
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'line',
            data: [15, 56, 15, 56, 68, 48, 31]
          }
        ]
      }

      return option
    },
    circleChartOption () {
      // let xAxisData = []
      // let seriesData = []
      let option2 = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
            ]
          }
        ]
      }

      return option2
    }
  },

  methods: {
    drawExampleChart: function () {
      this.lineChart = echarts.init(document.getElementById('chart-div'))
      this.circleChart = echarts.init(document.getElementById('circle-chart'))
      this.lineChart.setOption(this.exampleChartOption)
      this.circleChart.setOption(this.circleChartOption)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawExampleChart()

      let _self = this
      window.addEventListener('resize', function () {
        _self.lineChart.resize()
        _self.circleChart.resize()
      })
    })
  },
  watch: {
    exampleChartOption: {
      handler: function (newVal, oldVal) {
        if (this.lineChart) {
          if (newVal) {
            this.lineChart.setOption(newVal)
          } else {
            this.lineChart.setOption(oldVal)
          }
        } else {
          this.drawExampleChart()
        }
      },
      deep: true
    }
  }

}
</script>
