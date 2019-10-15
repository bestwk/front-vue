<style>
  .modal-form-item{display: inline-block;width: 48%}
  .modal-form-input{width: 60%}
</style>

<template>
  <div style="margin: 25px;position: relative">
    <i-button type="primary" @click="modal1 = true">添加商户</i-button>
    <Modal v-model="modal1" title="新增商户" @on-ok="ok" @on-cancel="cancel">
      <Form>
        <FormItem label="商户名称" class="modal-form-item">
          <Input placeholder="请输入商户名称" class="modal-form-input"></Input>
        </FormItem>
        <FormItem label="商户编码" class="modal-form-item">
          <Input placeholder="请输入商户编码" class="modal-form-input"></Input>
        </FormItem>
        <Upload multiple type="drag" action="//jsonplaceholder.typicode.com/posts/">
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击此处上传文件信息</p>
          </div>
        </Upload>
      </Form>
    </Modal>
    <i-table border :columns="columns" :data="data1" style="margin-top: 15px;text-align: center"></i-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      modal1: false,
      columns: [
        {
          title: '商户编码',
          key: 'Id',
          align: 'center'
        },
        {
          title: '商户名称',
          key: 'name',
          align: 'center'
        },
        {
          title: '新增时间',
          key: 'newAddTime',
          align: 'center'
        },
        {
          title: '状态',
          key: 'status',
          align: 'center'
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
      data1: [
        {
          Id: '0251',
          name: '和平路1店',
          newAddTime: '2019-08-22 11:40:20',
          status: '已添加'
        },
        {
          Id: '0136',
          name: '和平路2店',
          newAddTime: '2019-08-26 11:45:20',
          status: '待审核'
        },
        {
          Id: '013',
          name: '和平路3店',
          newAddTime: '2019-08-26 11:50:10',
          status: '待审核'
        }
      ]
    }
  }
}
</script>
