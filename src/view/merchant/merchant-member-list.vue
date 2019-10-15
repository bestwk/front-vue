<style>
  .ivu-col{display: inline-block;}
  .ml15{margin: 0 15px}
  .form-list{width: 14.3%;display: inline-block;}
  .ivu-form-item{margin: 12px 0 12px 2%}
  .modal-form-item{display: inline-block;width: 48%}
  .modal-form-input{width: 60%}
  .modal-form-select{display:inline-block;width: 48%}
</style>

<template>
  <div style="margin: 25px;position: relative" v-show="cont">
    <!--顶部-->
    <div v-show="btnArr">
      <i-button type="primary" @click="modal1 = true" style="margin-right: 15px">新增会员</i-button>
      <i-input  placeholder="请输入手机号" style="width: 200px;position: absolute;right: 55px;" class="ml15"></i-input>
      <i-button style="margin-right: 15px">复制会员外链</i-button>
      <div style="margin-left: 15px;display: inline-block;" @click="sxChange">
        <Icon type="ios-funnel" />筛选
      </div>
      <div style="margin-left: 15px;display: inline-block;" @click="showDel">已删除会员</div>
      <i-button type="primary" style="float: right"> 查询</i-button>
    </div>
    <!--默认隐藏的筛选表单-->
    <Form style="width: 100%;border:1px solid #b6b6b6;margin-top: 20px;" v-show="show" name="formList">
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="店铺查询">
          <Option value="">全部</Option>
          <Option value="">中餐厅</Option>
          <Option value="">西餐厅</Option>
        </Select>
      </FormItem>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="员工查询">
          <Option value="">全部</Option>
          <Option value="">艾迪</Option>
          <Option value="">汤姆</Option>
        </Select>
      </FormItem>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="注册来源">
          <Option value="">全部</Option>
          <Option value="">支付宝扫码</Option>
          <Option value="">微信扫码</Option>
        </Select>
      </FormItem>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="会员星级">
          <Option value="">全部</Option>
          <Option value="">1星级</Option>
          <Option value="">2星级</Option>
        </Select>
      </FormItem>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="性别">
          <Option value="">全部</Option>
          <Option value="">男</Option>
          <Option value="">女</Option>
        </Select>
      </FormItem>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="标签">
          <Option value="">全部</Option>
          <Option value="">1959</Option>
          <Option value="">1999</Option>
        </Select>
      </FormItem>
      <i-col style="margin: 12px 0 12px 2%;width: 47%">
        <label>开卡日期:</label>
        <Date-picker  format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 30%" class="ml15"></Date-picker>
        —<Date-picker  format="yyyy/MM/dd" type="date" placement="bottom-end" placeholder="选择日期" style="width: 30%" class="ml15"></Date-picker>
      </i-col>
      <FormItem label="" class="form-list">
        <Select v-model="formItem.select" placeholder="会员状态">
          <Option value="">全部</Option>
          <Option value="">激活会员</Option>
          <Option value="">非激活会员</Option>
        </Select>
      </FormItem>
      <FormItem label="客户流失:" style="margin-left: 2%">
        <RadioGroup type="button">
          <Radio label="all">全部</Radio>
          <Radio label="day">7天未购买</Radio>
          <Radio label="month">30天未购买</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="" class="form-list">
        <Input placeholder="距今天数"></Input>
      </FormItem>
      <FormItem label="" class="form-list">
        <Button type="primary">确认</Button>
        <Button style="margin-left: 20px;" @click="reback">取消</Button>
      </FormItem>
    </Form>
    <!--新增按钮modal-->
    <Modal v-model="modal1" title="新增会员" @on-ok="ok" @on-cancel="cancel">
      <Form>
        <FormItem label="手机号码" class="modal-form-item">
          <Input placeholder="请输入手机号" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="会员名称" class="modal-form-item">
          <Input placeholder="请输入会员名" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡金额" class="modal-form-item">
          <Input placeholder="请输入金额" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="开卡积分" class="modal-form-item">
          <Input placeholder="请输入积分" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="会员等级" class="modal-form-select">
          <Select class="modal-form-input">
            <Option>1星级</Option>
            <Option>2星级</Option>
            <Option>3星级</Option>
          </Select>
        </FormItem>
        <FormItem label="会员称谓" class="modal-form-select">
          <Select class="modal-form-input">
            <Option>男士</Option>
            <Option>女士</Option>
          </Select>
        </FormItem>
        <FormItem label="支付方式" class="modal-form-select">
          <Select class="modal-form-input">
            <Option>现金</Option>
            <Option>支付宝</Option>
            <Option>微信</Option>
          </Select>
        </FormItem>
        <FormItem label="开卡员工" class="modal-form-select">
          <Select class="modal-form-input">
            <Option>张三</Option>
            <Option>李四</Option>
            <Option>王五</Option>
          </Select>
        </FormItem>
        <FormItem label="标签选择" class="modal-form-select">
          <Select class="modal-form-input">
            <Option>1566</Option>
            <Option>21</Option>
            <Option>136</Option>
          </Select>
        </FormItem>
        <FormItem label="日期选择" class="modal-form-item">
          <DatePicker type="date" placeholder="选择日期" v-model="formItem.date" style="width: 60%;"></DatePicker>
        </FormItem>
        <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传文件信息</p>
          </div>
        </Upload>
      </Form>
    </Modal>
    <!--表格数据-->
    <i-table border :content="self" :columns="columns" :data="data" style="margin-top: 15px;text-align: center" v-show="myTable"></i-table>
    <!--已删除会员-->
    <div v-show="delMember">
      <RadioGroup type="button">
        <Radio label="all">全部</Radio>
        <Radio label="day">最近7天</Radio>
        <Radio label="month">最近30天</Radio>
        <Radio label="months">最近90天</Radio>
      </RadioGroup>
      <i-table border :content="self" :columns="column2" :data="data2" style="margin-top: 15px;text-align: center"></i-table>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      self: this,
      show: false,
      btnArr: true,
      cardArr: true,
      myTable: true,
      modal1: false,
      delMember: false,
      cont: true,
      formItem: {
        input: '',
        select: '',
        date: ''
      },
      columns: [
        {
          title: '会员卡号',
          key: 'cardId',
          align: 'center'
        },
        {
          title: '会员名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '标签',
          key: 'tag',
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          align: 'center',
          width: 150
        },
        {
          title: '会员等级',
          key: 'level',
          align: 'center'
        },
        {
          title: '当前积分',
          key: 'orderStatus',
          align: 'center'
        },
        {
          title: '储值余额',
          key: 'balance',
          align: 'center'
        }, {
          title: '所属门店',
          key: 'store',
          align: 'center'
        },
        {
          title: '注册来源',
          key: 'from',
          align: 'center'
        },
        {
          title: '开卡时间',
          key: 'openCardTime',
          align: 'center',
          width: 150
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', { // 数据库1是已处理，0是未处理
                props: {
                  type: 'primary',
                  size: 'large',
                  value: params.row.treatment === 0 // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                scopedSlots: {
                  open: () => h('span', '启用'),
                  close: () => h('span', '禁用')
                },
                on: {
                  'on-change': (status) => {
                    if (status == 0) {
                      // 关闭时
                      this.$Message.error('已禁用')
                    } else if (status == 1) {
                      // 开启时
                      this.$Message.success('已启用')
                    }
                  }
                }
              })
            ])
          }
        }
      ],
      column2: [
        {
          title: '会员名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '会员卡号',
          key: 'cardId',
          align: 'center'
        },
        {
          title: '电话号码',
          key: 'phone',
          align: 'center',
          width: 150
        },
        {
          title: '储值余额',
          key: 'balance',
          align: 'center'
        },
        {
          title: '开卡时间',
          key: 'openCardTime',
          align: 'center',
          width: 150
        },
        {
          title: '删除时间',
          key: 'delTime',
          align: 'center',
          width: 150
        },
        {
          title: '操作员工',
          key: 'person',
          align: 'center'
        },
        {
          title: '删除原因',
          key: 'delReason',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'text'
                }
              }, '明细'),
              h('a', {
                props: {
                  type: 'text'
                }
              }, '审核')
            ])
          }
        }
      ],
      data: [
        {
          cardId: '0251',
          level: '3星级',
          tag: '2号桌',
          name: '李铭',
          openCardTime: '2019-08-22 11:40:20',
          orderStatus: '已完成',
          from: '网站注册',
          phone: '13558521565'
        },
        {
          cardId: '0136',
          level: '1星级',
          tag: '3号桌',
          name: '小明',
          openCardTime: '2019-08-26 11:45:20',
          orderStatus: '已完成',
          from: '手机注册',
          phone: '13589135478'
        },
        {
          cardId: '013',
          level: '2星级',
          tag: '6号桌',
          name: '李力',
          openCardTime: '2019-08-26 11:50:10',
          orderStatus: '已完成',
          from: '手机注册',
          phone: '13856942643'
        }
      ],
      data2: [
        {
          cardId: '0251',
          person: '刘某',
          name: '李铭',
          openCardTime: '2019-08-22 11:40:20',
          delReason: '未支付订单',
          delTime: '2019-09-01 10:20:26',
          phone: '13558521565'
        },
        {
          cardId: '0136',
          person: '刘某',
          name: '小明',
          openCardTime: '2019-08-26 11:45:20',
          delReason: '未支付订单',
          delTime: '2019-09-01 10:20:26',
          phone: '13589135478'
        },
        {
          cardId: '013',
          person: '刘某',
          name: '李力',
          openCardTime: '2019-08-26 11:50:10',
          delReason: '未支付订单',
          phone: '13856942643'
        }
      ]

    }
  },
  methods: {

    remove (index) {
      this.data.splice(index, 1)
    },
    reback () {
      this.show = false
    },
    sxChange () {
      this.show = !this.show
    },
    showDel () {
      this.btnArr = false
      this.cardArr = false
      this.myTable = false
      this.delMember = true
      this.show = false
    },
    ok () {},
    cancel () {}
  }
}
</script>
