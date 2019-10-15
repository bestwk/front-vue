<template>
  <div>
    <card shadow>
      <Row :gutter="20">
        <Col span="12" v-for="(infor, i) in totalAgentCommissionData" :key="`infor-${i}`" style="height: 115px;margin-bottom: 10px">
          <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
            <count-to :decimalsType="i>1?2:0"  :end="infor.count" count-class="count-style" />
            <p>{{ infor.title }}</p>
          </infor-card>
        </Col>
      </Row>
    </card>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {queryTotalAgentCommission} from '../../api/agent-manage/agent-commission'

export default {
  components: {
    InforCard,
    CountTo
  },
  data () {
    return {
      totalAgentCommissionData: []
    }
  },
  created () {
    this.initPage()
  },
  methods: {
    initPage () {
      queryTotalAgentCommission().then(res => {
        console.log(res)
        let total = res.data.data
        this.totalAgentCommissionData = [
          { title: '客户数', icon: 'md-basket', count: total.sumServants, color: '#2d8cf0' },
          { title: '订单', icon: 'ios-paper-outline', count: total.sumOrder, color: '#19be6b' },
          { title: '订单金额', icon: 'md-paper', count: total.sumOrderMoney, color: '#ff6347' },
          { title: '佣金', icon: 'ios-paper', count: total.sumMoney, color: '#ff9900' }
        ]
      })
    }
  }
}
</script>

<style scoped>
  .count-style{
    font-size: 25px;
  }
</style>
