
<style>
    [v-cloak]{
        display: none;
    }
    .clear{clear: both;}
    #invoice{width: 800px; margin: 0 auto; padding: 10px 0;}
    #invoice *{color: #b37a46;}
    .in_daima{font-size: 16px; color: #b37a46; text-align: center; margin:30px auto 0; line-height: 28px; font-weight: 500;}
    .in_title{width:80%; font-size: 20px; font-weight: 500; letter-spacing: 2px; text-align: center; margin:0 auto;  line-height: 40px; border-bottom: 3px double #b37a46; }
    .in_note{width: 70%; font-size: 12px; line-height: 24px; text-align: center; margin: 10px auto;}
    .in_piaohao{font-size: 16px; color: #b37a46; margin:30px auto; line-height: 28px;}
    .in_piaohao img{float: left; margin-right: 10px;}
    .in_piaohao span{float: left; font-weight: 500;}
    .in_time{margin-top: 20px;}
    .in_bor{border-top: 1px solid #b37a46; border-left: 1px solid #b37a46;}
    .in_bor .ivu-col{border-right: 1px solid #b37a46; padding: 5px 0; height: 100px;}
    .in_shu{width: 20px; margin: 5px auto; font-size: 14px; line-height: 20px;}
    .in_cont{clear: both; line-height: 18px; font-size: 12px;}
    .in_ct_left{width: 100px; float: left; text-align: right;}
    .in_thead{border-top: 1px solid #b37a46; border-left: 1px solid #b37a46;}
    .in_thead h5{font-size: 12px; font-weight: 600; line-height: 24px; letter-spacing: 2px; text-align: center;}
    .in_thead .ivu-col{height: 30px; line-height: 30px; border-right: 1px solid #b37a46;}
    .in_tbody{border-left: 1px solid #b37a46;}
    .in_tbody .ivu-col{height: 20px; line-height: 20px; font-size: 12px; border-right: 1px solid #b37a46;}
    .in_bor2{border-top: 1px solid #b37a46; border-left: 1px solid #b37a46; border-right: 1px solid #b37a46; text-align: center; line-height: 30px;}
    .in_bor3{border-top: 1px solid #b37a46; text-align: center; line-height: 30px;}
</style>

<template>
    <div id="invoice" v-cloak>
        <Row>
            <Col span="6">
                <p class="in_daima">{{invoiceInfo.oldBillCode}}</p>
            </Col>
            <Col span="12">
                <h3 class="in_title">增值税电子普通发票</h3>
                <p class="in_note">此页仅作为信息展示，与打印预览无关</p>
            </Col>
            <Col span="6">
                <p class="in_piaohao"><img src="../../../assets/images/20135404.png" width="24"><span>{{invoiceInfo.oldBillNum}}</span></p>
                <div class="clear"></div>
                <p class="in_time">开票日期：{{invoiceInfo.creatDate}}</p>
            </Col>
        </Row>
        <Row class="in_bor" type="flex" justify="center" align="middle">
            <Col span="1">
                <p class="in_shu">购买方</p></Col>
            <Col span="23">
                <p class="in_cont"><span class="in_ct_left">名称：</span><span class="in_ct_right">{{invoiceInfo.buyCompanyName}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">纳税人识别号：</span><span class="in_ct_right">{{invoiceInfo.buyCompanyCode}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">地址、电话：</span><span class="in_ct_right">{{invoiceInfo.buyCompanyAdrTel}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">开户行及账号：</span><span class="in_ct_right">{{invoiceInfo.buyCompanyBankCode}}</span> </p>
            </Col>
        </Row>
        <div class="biaoge">
            <Row class="in_thead">
                <Col span="5">
                    <h5>货物或应税劳务名称</h5>
                </Col>
                <Col span="3">
                    <h5>规格型号</h5>
                </Col>
                <Col span="2">
                    <h5>单位</h5>
                </Col>
                <Col span="2">
                    <h5>数量</h5>
                </Col>
                <Col span="3">
                    <h5>单价</h5>
                </Col>
                <Col span="3">
                    <h5>金额</h5>
                </Col>
                <Col span="2">
                    <h5>税率</h5>
                </Col>
                <Col span="4">
                    <h5>税额</h5>
                </Col>
            </Row>
            <Row class="in_tbody" v-for="(billDetail,index) in invoiceInfo.billDetails" :key="index">
                <Col span="5">
                    <div class="in_cont1">{{billDetail.goodsName}}</div>
                </Col>
                <Col span="3">
                    <div class="in_cont1">{{billDetail.goodsModel}}</div>
                </Col>
                <Col span="2">
                    <div class="in_cont1">{{billDetail.goodsUnit}}</div>
                </Col>
                <Col span="2">
                    <div class="in_cont1">{{billDetail.goodsNum}}</div>
                </Col>
                <Col span="3">
                    <div class="in_cont1">{{billDetail.goodsPrice}}</div>
                </Col>
                <Col span="3">
                    <div class="in_cont1">{{billDetail.sumPrice}}</div>
                </Col>
                <Col span="2">
                    <div class="in_cont1">{{billDetail.taxRate}}</div>
                </Col>
                <Col span="4">
                    <div class="in_cont1">{{billDetail.taxPrice}}</div>
                </Col>
            </Row>
        </div>

        <Row class="in_bor2">
            <Col span="8"><p>合计金额 {{sumAllPrice}}</p></Col>
            <Col span="8"><p>合计税额 {{sumAllTax}}</p></Col>
            <Col span="8"><p>价税合计 {{sumAllPriceAndTax}}</p></Col>
        </Row>
        <Row class="in_bor" type="flex" justify="center" align="middle">
            <Col span="1">
                <div class="in_shu">销售方</div>
            </Col>
            <Col span="11">
                <p class="in_cont"><span class="in_ct_left">名称：</span><span class="in_ct_right">{{invoiceInfo.companyName}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">纳税人识别号：</span><span class="in_ct_right">{{invoiceInfo.companyTaxNum}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">地址、电话：</span><span class="in_ct_right">{{invoiceInfo.companyAdrTel}}</span> </p>
                <p class="in_cont"><span class="in_ct_left">开户行及账号：</span><span class="in_ct_right">{{invoiceInfo.companyBank}}</span></p>
            </Col>
            <Col span="1">
                <div class="in_shu">备注</div>
            </Col>
            <Col span="11">
                <p class="in_cont">{{invoiceInfo.billNote}}</p>
            </Col>
        </Row>
        <Row class="in_bor3">
            <Col span="5"><p>收款人：{{invoiceInfo.userSk}}</p></Col>
            <Col span="5"><p>复核人：{{invoiceInfo.userFh}}</p></Col>
            <Col span="14">开票人：{{invoiceInfo.userKp}}</Col>
        </Row>
    </div>
</template>
<script>
import {getParams} from '@/libs/util'
import axios from '@/libs/api.request'
/* eslint-disable */
    export default {
        name:'tobeinvoiceddetail',
        data () {
            return {
                item:1,
                invoiceInfo: {
                    billSerialNum:'',
                    buyCompanyName: '',
                    buyCompanyCode: '',
                    buyCompanyAdrTel: '',
                    buyCompanyBankCode: '',
                    billDetails: [
                        {
                            goodsName:'',
                            goodsModel:'',
                            goodsUnit:'',
                            goodsNum:'',
                            goodsPrice:'',
                            sumPrice:'',
                            taxRate:'',
                            taxPrice:'',
                            sort: 1,
                            status: 1
                        }
                    ],
                    companyName: '',
                    companyTaxNum: '',
                    companyBank: '',
                    companyAdrTel: '',
                    billNote:'',
                    userSk: '',
                    userFh: '',
                    userKp: '',
                    createDate:''
                },
                sumAllPrice:0,
                sumAllTax:0,
                sumAllPriceAndTax:0,
            }
        },
        mounted(){
            // let url = window.location.href;
            // if(url.indexOf('?') > 0){
            //     this.params = getParams(window.location.href);
            // }
          // this.invoiceInfo=this.$store.state.get()
          this.invoiceInfo=JSON.parse(sessionStorage.getItem('invoiced'))
          for(let i=0;i<this.invoiceInfo.billDetails.length;i++) {
            this.sumAllPriceAndTax += Number(this.invoiceInfo.billDetails[i].sumPrice)+Number(this.invoiceInfo.billDetails[i].taxPrice);
            this.sumAllPrice += Number(this.invoiceInfo.billDetails[i].sumPrice);
            this.sumAllTax += Number(this.invoiceInfo.billDetails[i].taxPrice);
          }
        },

    }


</script>
