<template>
  <div>
    <Card>
      <span style="font-size: large;font-weight: bolder">外卖设置</span>
      <Divider></Divider>
      <Row>
        <Col span="2">
          商家电话:
        </Col>
        <Col span="22" >
          <Input v-model="takeout.phone"  style="width: 300px"></Input>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">店铺状态:</Col>
        <Col span="22">
          <Row>
            <Col span="2">
              是否接单:
            </Col>
            <Col span="18">
              <RadioGroup v-model="takeout.enabledOrder" :value="takeout.enabledOrder"  >
                <Radio :label="0">接单中</Radio>
                <Radio :label="1">已打烊</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span="2">
              自动接单:
            </Col>
            <Col span="18" >
              <RadioGroup v-model="takeout.enabledAutoOrder" :value="takeout.enabledAutoOrder"  >
                <Radio :label="0">启用</Radio>
                <Radio :label="1">不启用</Radio>
              </RadioGroup>
            </Col>
          </Row>

        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">接单时段:</Col>
        <Col span="22">
          <Form  :label-width="80" style="width: 300px" label-position="left">
            <FormItem
              v-for="(item, index) in takeout.timeArray"
              :key="index"
              :label="'时段:'"
            >
              <Row style="width: 500px">
                <Col span="18" style="width: 250px">
                  <TimePicker v-model="item.timeStart" format="HH:mm" placeholder="开始时间" style="width: 100px"></TimePicker>
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;至</span>
                  <TimePicker v-model="item.timeFinish" format="HH:mm" placeholder="结束时间" style="width: 100px;margin-left: 15px"></TimePicker>
                </Col>
                <Col span="4" offset="1">
                  <Button v-show="takeout.timeArray.length > 1" @click="handleRemove(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="12">
                  <Button type="dashed" long @click="handleAdd" icon="md-add">添加时段</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2">
          配送费:
        </Col>
        <Col span="22" >
          <Row>
            <Col span="2">
              起送金额:
            </Col>
            <Col span="22" >
              <Input v-model="takeout.initialDeliveryAmount" @on-keyup="changeinitialDeliveryAmount()" style="width: 100px"></Input>
              <span  style="color:rgb(6,12,4);font-size: 14px;margin-left: 20px">(元)</span>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span="2">
              满额配送:
            </Col>
            <Col span="22" >
              <Input v-model="takeout.fullAmount" @on-keyup="changefullAmount()" style="width: 100px"></Input>
              <span  style="color:rgb(6,12,4);font-size: 14px;margin-left: 20px">(元)</span>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col span="2">
              配送距离:
            </Col>
            <Col span="22" >
              <Input v-model="takeout.distance" @on-keyup="changedistance()" style="width: 100px"></Input>
              <span  style="color:rgb(6,12,4);font-size: 14px;margin-left: 20px">(公里)</span>
            </Col>
          </Row>
          <br/>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col span="2" style="line-height: 32px">分段计价:</Col>
        <Col span="20" style="line-height: 32px">
          <span  style="color:rgb(196, 196, 202);font-size: 14px;margin-left: 20px">若设置多个配送距离，则配送距离之间不能有间隙，不然会出现部分区域无配送费的情况；</span>
        </Col>
      </Row>
      <Row>
        <Col span="2" style="line-height: 32px">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </Col>
        <Col span="22">
          <Form  :label-width="80" style="width: 300px" label-position="left">
            <FormItem
              v-for="(item, index) in takeout.valuationArray"
              :key="index"
              :label="'配送距离:'"
            >
              <Row>
                <Col style="width: 600px">
                  <Input v-model="item.distanceStart" confirm   style="width: 50px" @on-keyup="show(item.index)"  ></Input> &nbsp;至 &nbsp;<Input v-model="item.distanceFinish" confirm style="width: 50px" @on-keyup="show(item.index)" ></Input>
                  <span  style="color:rgb(6,12,4);font-size: 14px;margin-left: 20px">(公里)</span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;配送费:&nbsp;<Input v-model="item.deliveryAmount" confirm style="width: 80px"></Input>
                  <span  style="color:rgb(6,12,4);font-size: 14px;margin-left: 20px">(元/单)</span>
                  &nbsp;&nbsp;<Button v-show="takeout.valuationArray.length > 1" @click="handleRemoveValuation(index)">删除</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Row>
                <Col span="13">
                  <Button type="dashed" long @click="handleAddvaluation" icon="md-add">新增分段计价</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <Button type="warning" style="margin-left: 80px" @click="cancelSave">取消</Button>
          <Button type="primary" style="margin-left: 50px" @click="surelSave">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import {updateTakeOut, getTakeout} from '../../api/system/takeout-settings'
export default {
  name: 'takeout-settings',
  data () {
    return {
      index: 0,
      takeout: {
        id: '',
        enabledOrder: 0, // 是否开启接单
        enabledAutoOrder: 0, // 是否开启自动接单
        phone: '',
        initialDeliveryAmount: 20, // 起送金额
        fullAmount: '', // 满额免配
        distance: 5, // 配送距离
        timeArray: [
          {
            index: 0,
            timeStart: '',
            timeFinish: ''
          }
        ],
        valuationArray: [{
          index: 0,
          distanceStart: 0,
          distanceFinish: '',
          deliveryAmount: ''
        }]
      }
    }
  },
  created: function () {
    this.inittakeout()
  },
  methods: {
    // 初始化方法
    inittakeout: function () {
      getTakeout().then(res => {
        if (res.data.success) {
          this.takeout.timeArray = []
          this.takeout.valuationArray = []
          this.takeout = res.data.data
          for (let i = 0; i < this.takeout.timeArray.length; i++) {
            this.takeout.timeArray[i].index = i
          }
          for (let i = 0; i < this.takeout.valuationArray.length; i++) {
            this.takeout.valuationArray[i].index = i
          }
        } else {
          this.$Message.success('请进行设置')
        }
        // this.takeout.storeType = formatDate(new Date(this.takeout.storeType), 'yyyy-MM-dd')
        // this.takeout.city = formatDate(new Date(this.takeout.city), 'yyyy-MM-dd')
      }).catch(err => {
        console.log(err)
      })
      this.takeout.valuationArray[this.takeout.valuationArray.length - 1].distanceFinish = this.takeout.distance
    },
    changeinitialDeliveryAmount () {
      this.takeout.initialDeliveryAmount = this.takeout.initialDeliveryAmount.replace(/[^\d]/g, '')
    },
    changefullAmount () {
      this.takeout.fullAmount = this.takeout.fullAmount.replace(/[^\d]/g, '')
    },
    changedistance () {
      this.takeout.distance = this.takeout.distance.replace(/[^\d]/g, '')
      this.takeout.valuationArray[this.takeout.valuationArray.length - 1].distanceFinish = this.takeout.distance
    },
    show (index) {
      console.log(this.takeout.valuationArray.length - 1, index)
      if (index == 0) {
        if (this.takeout.valuationArray[0].distanceStart != 0) {
          this.$Message.error('起始距离必须为0')
          this.takeout.valuationArray[0].distanceStart = 0
          return
        }
        if (index == this.takeout.valuationArray.length - 1) {
          if (this.takeout.valuationArray[index].distanceFinish != this.takeout.distance) {
            this.$Message.error('最远距离必须等于配送距离')
            this.takeout.valuationArray[index].distanceFinish = this.takeout.distance
          }
        }
      } else if (index == this.takeout.valuationArray.length - 1) {
        if (this.takeout.valuationArray[index].distanceStart >= this.takeout.distance) {
          this.$Message.error('当前距离必须小于配送距离')
          this.takeout.valuationArray[index].distanceStart = ''
          return
        }

        if (this.takeout.valuationArray[index].distanceFinish != this.takeout.distance) {
          this.$Message.error('最远距离和配送距离一致')
          this.takeout.valuationArray[index].distanceFinish = this.takeout.distance
        }
      } else {
        if (this.takeout.valuationArray[index].distanceStart >= this.takeout.distance) {
          this.$Message.error('当前距离必须小于配送距离')
          this.takeout.valuationArray[index].distanceStart = ''
          return
        }
        if (this.takeout.valuationArray[index].distanceFinish > this.takeout.distance) {
          this.$Message.error('当前距离必须小于配送距离')
          this.takeout.valuationArray[index].distanceFinish = ''
        }
      }
    },
    handleAdd () {
      this.index = this.takeout.timeArray.length
      this.takeout.timeArray.push({
        timeStart: '',
        timeFinish: '',
        index: this.index
      })
    },
    handleAddvaluation () {
      this.index = this.takeout.valuationArray.length
      this.takeout.valuationArray[this.index - 1].distanceFinish = ''
      this.takeout.valuationArray.push({
        distanceStart: '',
        distanceFinish: this.takeout.distance,
        deliveryAmount: '',
        index: this.index
      })
    },
    handleRemove (index) {
      this.takeout.timeArray.splice(index, 1)
    },
    handleRemoveValuation (index) {
      console.log(index)
      this.takeout.valuationArray.splice(index, 1)
      this.takeout.valuationArray[this.takeout.valuationArray.length - 1].distanceFinish = this.takeout.distance
      this.takeout.valuationArray[0].distanceStart = 0
    },
    cancelSave: function () {
      this.inittakeout()
    },
    surelSave: function () {
      // 判断手机号是否正确
      if (!(/^1[34578]\d{9}$/.test(this.takeout.phone))) {
        this.$Message.error('请填写正确手机号')
        return
      }
      if (this.takeout.distance == '') {
        this.$Message.error('请填写满额配送')
        return
      }
      updateTakeOut(this.takeout).then(res => {
        if (res.data.success) {
          this.$Message.info('操作成功')
          this.inittakeout()
        } else {
          this.$Message.warning('操作失败')
        }
      }).catch(err => {
        console.log(err)
      })
    }

  }
}
</script>

<style scoped>

</style>
