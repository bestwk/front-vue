<template>
  <div>
    <Card shadow>
      <Row type="flex" justify="end" class="code-row-bg">
        <Col span="8">
          <Row :gutter="15">
            <Col span="5">
              <Button type="primary"  icon="ios-add"  @click="addMenu" >新增菜品</Button>
            </Col>
            <!--<Col span="6">-->
              <!--<Button type="primary"  icon="ios-add"  @click="add" >批量导入菜品</Button>-->
            <!--</Col>-->
            <!--<Col span="6">-->
              <!--<Button type="primary"  icon="ios-add"  @click="addToSubShop" >同步菜品到子店</Button>-->
            <!--</Col>-->

          </Row>
        </Col>
        <Col span="16">
          <Row :gutter="4" type="flex" justify="end" class="code-row-bg">
            <Col span="5">
              <Select v-model="tableParams.dishesCatalog" placeholder="请选择菜品分类" style="width:200px">
                <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
            <Col span="5">
              <Input v-model="tableParams.dishesName" placeholder="请输入菜品名"></Input>
            </Col>

            <Col span="3">
              <Button type="primary" icon="ios-search" @click="search">搜索</Button>
            </Col>
            <Col span="3">
              <Button type="primary" icon="md-refresh" @click="reload">刷新</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider/>
      <Row>
        <Alert show-icon>共{{gqNumber}}个估清菜品</Alert>
        <Table
          :border="true"
          ref="tables"
          :columns="tableColumns"
          :data="dishesList"
          @on-selection-change="onSelectionChange">
          <div slot="loading">
            <Spin fix>
              <Icon type="ios-loading" size=54 class="admin-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
          <div slot="footer">
            <Row style="padding-left:20px;">
              <Col span="6">
              </Col>
              <Col span="18">
                <Row type="flex" justify="end">
                  <Col span="13">
                    <Page :current="tableParams.pageNum" :total="total" :page-size="tableParams.pageSize" show-elevator show-total @on-change="onPageChange"/>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Table>
      </Row>
    </Card>

    <!--添加菜品-->
    <Modal v-model="addMenuWin" fullscreen footer-hide>
      <p slot="header">
        新增菜品
      </p>
      <Tabs ref="tabs" value="name1" @on-click="tabClick">
        <TabPane label="简易模式" name="name1">
          <div class="center">
            <Form :model="dishes" :rules="jyRuleValidate" :label-width="150" class="add_form">
              <FormItem prop="nameCn" label="菜品名称（中文名称）">
                <Input v-model="dishes.nameCn" style="width: 300px">
                </Input>
              </FormItem>
              <FormItem label="菜品名称（英文名称）">
                <Input v-model="dishes.nameEn" style="width: 300px">
                </Input>
              </FormItem>
              <FormItem  label="助记码">
                <Input v-model="dishes.mnemonicCode" style="width: 300px">
                </Input>
              </FormItem>
              <FormItem  label="排序">
                <InputNumber v-model="dishes.sort" style="width: 300px">
                </InputNumber>
              </FormItem>
              <FormItem label="菜品图片">
                <div style="position: relative;">
                  <div class="demo-upload-list" v-for="(item,index) in jySelfUploadList" :key="index" style="position: absolute; top: 0; z-index: 2; overflow:hidden;float: left" @click="jyUploadImg">
                    <img :src="item.url" style="width: 100px;height: 100px">
                    <!--<div class="demo-upload-list-cover">-->
                    <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                    <!--</div>-->
                  </div>
                  <Upload ref="s_upload"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png']"
                          :max-size="2048"
                          :on-success="jyHandleSuccess"
                          :before-upload="jyHandleBeforeUpload"
                          :on-format-error="jyHandleFormatError"
                          :on-exceeded-size="jyHandleMaxSize"
                          type="drag"
                          :action="uploadUrl"
                          style="display: inline-block;width:100px; float: left">
                    <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                      <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
                    </div>
                  </Upload>
                </div>
              </FormItem>
              <FormItem prop="catalogCode" label="菜品分类">
                <Select v-model="dishes.catalogCode" style="width:200px" @on-change="catalogChange">
                  <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="catalogCode" label="菜品单位">
                <Select v-model="dishes.unitCode" style="width:200px" @on-change="unitChange">
                  <Option v-for="item in unitList" :value="item.code" :key="item.id">{{ item.value }}</Option>
                </Select>
              </FormItem>
              <FormItem  prop="specification.salesPrice" label="销售单价">
                <InputNumber v-model="dishes.specificationList[0].salesPrice" style="width: 300px">
                </InputNumber>
              </FormItem>
              <FormItem>
                <Button  @click="closeWin" style="margin-right: 20px">取消</Button>
                <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit=='1'" @click="saveAndAdd" style="margin-right: 20px">保存并继续新增</Button>
                <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit=='1'" @click="saveData">保存</Button>
                <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit=='2'" @click="editSaveData">修改</Button>
              </FormItem>
            </Form>
          </div>
        </TabPane>
        <TabPane label="高级模式" name="name2">
          <div class="center">
            <Form  :rules="gjRuleValidate" :label-width="80" class="add_form">
              <Divider orientation="left">基本信息</Divider>
              <FormItem label="菜品图片">
                <div style="position: relative;">
                  <div class="demo-upload-list" v-for="(item,index) in jySelfUploadList" :key="index" style="position: absolute; top: 0; z-index: 2; overflow:hidden;float: left" @click="jyUploadImg">
                    <img :src="item.url" style="width: 100px;height: 100px">
                    <!--<div class="demo-upload-list-cover">-->
                    <!--<Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                    <!--</div>-->
                  </div>
                  <Upload ref="s_upload"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png']"
                          :max-size="2048"
                          :on-success="jyHandleSuccess"
                          :before-upload="jyHandleBeforeUpload"
                          :on-format-error="jyHandleFormatError"
                          :on-exceeded-size="jyHandleMaxSize"
                          type="drag"
                          :action="uploadUrl"
                          style="display: inline-block;width:100px; float: left">
                    <div style="width: 100px;height:100px;line-height: 100px;float: left" >
                      <Icon type="md-camera" size="100" ref="uploadIcon"></Icon>
                    </div>
                  </Upload>
                </div>
              </FormItem>

              <FormItem label="菜品名称">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">中文名称</Col>
                      <Col span="10">
                        <FormItem prop="priceCurrent">
                          <Input v-model="dishes.nameCn" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">英文名称</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.nameEn" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">菜品分类</Col>
                      <Col span="8">
                        <FormItem>
                          <Select v-model="dishes.catalogCode" style="width:300px" @on-change="catalogChange">
                            <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="菜品单位">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem>
                          <Select v-model="dishes.unitCode" style="width:300px" @on-change="unitChange">
                            <Option v-for="item in unitList" :value="item.code" :key="item.id">{{ item.value }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">菜品类型</Col>
                      <Col span="8">
                        <FormItem>
                          <Select v-model="dishes.typeCode" style="width:300px" @on-change="typeChange">
                            <Option v-for="item in typeList" :value="item.code" :key="item.id">{{ item.value }}</Option>
                          </Select>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">助记码</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.mnemonicCode" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>

              <FormItem label="制作时间">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.makeTime" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">排序</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <InputNumber v-model="dishes.sort" style="width: 300px">
                          </InputNumber>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>
              <Divider orientation="left">菜品价格</Divider>
              <FormItem>
                <RadioGroup ref="radioSelect" v-model="dishes.enabledSpecifications">
                  <Radio label="0" >
                    <span>单一价格</span>
                  </Radio>
                  <Radio label="1" >
                    <span>启用规格</span>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="销售价格" v-show="dishes.enabledSpecifications=='0'">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <InputNumber v-model="dishes.specification.salesPrice" style="width: 300px">
                          </InputNumber>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">原价</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <InputNumber v-model="dishes.specification.originalPrice" style="width: 300px">
                          </InputNumber>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">成本价</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <InputNumber v-model="dishes.specification.costPrice" style="width: 300px">
                          </InputNumber>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>
              <FormItem  v-show="dishes.enabledSpecifications=='1'" style="width: 65%;background-color:#CCCCCC;margin-left: 100px;margin-bottom: 20px;border-radius:10px">
                <Row style="margin-top: 10px">
                  <Col span="5">
                    <Row>
                      <Col span="8">规格名称</Col>
                    </Row>
                  </Col>
                  <Col span="5">
                    <Row>
                      <Col span="8">销售价</Col>
                    </Row>
                  </Col>
                  <Col span="5">
                    <Row>
                      <Col span="8">原价</Col>
                    </Row>
                  </Col>
                  <Col span="5">
                    <Row>
                      <Col span="8">成本价</Col>
                    </Row>
                  </Col>
                  <Col span="2">
                    <Row>
                      <Col span="8">删除</Col>
                    </Row>
                  </Col>
                </Row>
                <Row v-for="(item,index) in dishes.specificationList" :key="index">
                  <Col span="5">
                    <FormItem prop="price">
                      <Input v-model="item.name" style="width: 150px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem prop="price">
                      <InputNumber v-model="item.salesPrice" style="width: 150px">
                      </InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem prop="price">
                      <InputNumber v-model="item.originalPrice" style="width: 150px">
                      </InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="5">
                    <FormItem prop="price">
                      <InputNumber v-model="item.costPrice" style="width: 150px">
                      </InputNumber>
                    </FormItem>
                  </Col>
                  <Col span="2">
                    <Button icon="ios-trash-outline" @click="deleteSpecification(index)" style="margin-right: 50px" type="error" size="default"></Button>
                  </Col>

                </Row>
                <Button icon="md-add" style="margin-top: 30px;margin-bottom: 10px" type="primary" @click="addSpecification">新增规格</Button>
              </FormItem>
              <FormItem label="餐盒费">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.boxAmount" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">是否打折</Col>
                      <Col span="8">
                        <FormItem prop="priceCost">
                          <RadioGroup ref="radioSelect" v-model="dishes.enabledDiscount">
                            <Radio label="1" >
                              <span>参与打折</span>
                            </Radio>
                            <Radio label="0" >
                              <span>不参与打折</span>
                            </Radio>
                          </RadioGroup>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>

              <Divider orientation="left">菜品加料<label style="font-size: 10px">(请新增与价格有关的且不含规格的加料项目，如煎饼果子加蛋、火腿、里脊肉，客户可以多选)</label></Divider>
              <FormItem   style="width: 55%;background-color:#CCCCCC;margin-left: 100px;margin-bottom: 20px;border-radius:10px">
                <Row style="margin-top: 10px">
                  <Col span="6">
                    <Row>
                      <Col span="8">加料名称</Col>
                    </Row>
                  </Col>
                  <Col span="6">
                    <Row>
                      <Col span="8">价格</Col>
                    </Row>
                  </Col>
                  <Col span="6">
                    <Row>
                      <Col span="8">成本价</Col>
                    </Row>
                  </Col>
                  <Col span="3">
                    <Row>
                      <Col span="8">删除</Col>
                    </Row>
                  </Col>
                </Row>
                <Row v-for="(item,index) in dishes.additiveList" :key="index">
                  <Col span="6">
                    <FormItem prop="price">
                      <Input v-model="item.name" style="width: 150px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem prop="price">
                      <Input v-model="item.salesPrice" style="width: 150px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="6">
                    <FormItem prop="price">
                      <Input v-model="item.costPrice" style="width: 150px">
                      </Input>
                    </FormItem>
                  </Col>
                  <Col span="3">
                    <Button icon="ios-trash-outline" @click="deleteAdditive(index)" style="margin-right: 50px" type="error" size="default"></Button>
                  </Col>

                </Row>
                <Button icon="md-add" style="margin-top: 30px;margin-bottom: 10px" type="primary" @click="addAdditive">新增加料项</Button>
              </FormItem>
              <Divider orientation="left">库存与销量</Divider>
              <FormItem label="总库存">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.totalStock" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">单日库存</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.dayStock" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">单笔限购</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.orderRestriction" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>
              <FormItem label="单人限购">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.personRestriction" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">初始销量</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <Input v-model="dishes.sales" style="width: 300px">
                          </Input>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </FormItem>

              <Divider orientation="left">可点端设置</Divider>

              <FormItem label="堂食可点" prop="isShowStock">
                <Row>
                  <Col span="8">
                    <Row>
                      <Col span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <i-switch v-model="dishes.enabledDineIn" size="large">
                            <span slot="open">显示</span>
                            <span slot="close">关闭</span>
                          </i-switch>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="8">
                    <Row>
                      <Col span="3">外卖可点</Col>
                      <Col span="8">
                        <FormItem prop="price">
                          <i-switch v-model="dishes.enabledTakeOut" size="large">
                            <span slot="open">显示</span>
                            <span slot="close">关闭</span>
                          </i-switch>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                </Row>

              </FormItem>
              <Divider orientation="left">菜品详情</Divider>
              <FormItem prop="price">
                <label style="font-size: 15px">菜品口味</label>
                <label >(请新增与价格无关的标签，如饮料加冰、常温；菜品的微辣、中辣等；该项目为单选)</label>
              </FormItem>
              <FormItem prop="price">
                <Button icon="md-add"  type="primary" @click="addTaps">标签</Button>
                <label style="margin-left: 100px;font-size: 16px">菜品标签：{{dishes.dishesTag}}</label>
              </FormItem>
              <FormItem prop="price" label="菜品描述">
                <Input type="textarea" v-model="dishes.description"> </Input>
              </FormItem>
              <FormItem prop="priceCurrent">
                <Button  @click="closeWin" style="margin-right: 20px">取消</Button>
                <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit=='1'" @click="saveData">保存</Button>
                <Button type="primary" :loading="selfModalLoading" v-show="saveOrEdit=='2'" @click="editSaveData">修改</Button>
              </FormItem>
            </Form>

          </div>
        </TabPane>
      </Tabs>

    </Modal>
    <!--标签-->
    <Modal v-model="tagWin">
      <Form :model="dishes"  >
        <FormItem  label="分组名称">
          <Input v-model="groupName" style="width: 300px" @on-blur="searchTag">
          </Input>
        </FormItem>
        <FormItem label="选择标签">
          <Select v-model="dishes.dishesTag" style="width:300px" @on-change="tagChange">
            <Option v-for="item in tagList" :value="item.taste" :key="item.id">{{ item.taste }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!--同步菜品到子店-->
    <Modal v-model="addSubWin" >
      <p slot="header">
        同步菜品到子店
      </p>
      <Form :model="dishes">
        <FormItem  label="选择门店">
          <Input style="width: 400px" v-model="selectStoreListName" type="text" icon="ios-arrow-down" @on-click="showSubShopWin"> </Input>
        </FormItem>
        <FormItem label="选择菜品">
          <Input style="width: 400px" type="text" icon="ios-arrow-down" @on-click="showSubDishesWin"> </Input>
        </FormItem>
      </Form>
    </Modal>

    <!--子店-->
    <Modal v-model="subShopWin" style="width:500px;height: 500px"  @on-ok="saveSubShop">
      <p slot="header">
        同步菜品到子店
      </p>
      <Form>
        <FormItem  label="选择门店">
          <Input style="width: 350px" v-model="shopName" search enter-button="搜索" placeholder="所有门店名称" @on-search="initStore"> </Input>
        </FormItem>
          <Table
            :border="true"
            ref="tables"
            :height="500"
            :columns="subShopColumns"
            @on-selection-change="storeSelect"
            :data="storeList">
            <div slot="loading">
              <Spin fix>
                <Icon type="ios-loading" size=54 class="admin-spin-icon-load"></Icon>
                <div>加载中...</div>
              </Spin>
            </div>
          </Table>
      </Form>
    </Modal>

    <!--菜品-->
    <Modal v-model="subDishesWin" style="width:500px;height: 500px"  @on-ok="saveSubDishes">
      <p slot="header">
        选择菜品
      </p>
      <Form>
        <FormItem  >
          <Select v-model="dishesCatalog" placeholder="请选择菜品分类" style="width:200px">
            <Option v-for="item in catalogList" :value="item.code" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Input style="width:200px" v-model="dishesName" placeholder="菜品名称"></Input>
          <Button type="primary" icon="ios-search" @click="allDishesAndMeal">搜索</Button>
        </FormItem>
        <Table
          :border="true"
          ref="tables"
          :height="500"
          :columns="subDishesColumns"
          @on-selection-change="dishesSelect"
          :data="dishesList">
          <div slot="loading">
            <Spin fix>
              <Icon type="ios-loading" size=54 class="admin-spin-icon-load"></Icon>
              <div>加载中...</div>
            </Spin>
          </div>
        </Table>
      </Form>
    </Modal>
  </div>
</template>

<script>
import Language from '../main/components/language/language'
import axios from '@/libs/api.request'
export default {
  components: {Language},
  data () {
    return {
      rangeTime: [],
      selection: [],
      total: 0,
      pageSize: 10,
      pageNum: 1,
      yanzhengma: '获取验证码',
      dishesList: [],
      modal1: false,
      modal2: false,
      mathCode: '',
      count: '',
      selfModalLoading: false,
      selfLoading: false,
      groupName: '',
      tableParams: {
        pageSize: 10,
        pageNum: 1,
        dishesCatalog: '',
        dishesName: '',
        physicalStoreId: 0
      },
      jyRuleValidate: {
        salesPrice: [
          { required: true, message: '请输入菜品价格', trigger: 'blur' }
        ]
      },
      gjRuleValidate: {
        nameCn: [
          { required: true, message: '请输入菜品名称', trigger: 'blur' }
        ],
        catalogCode: [
          { required: true, message: '请选择菜品分类', trigger: 'change' }
        ],
        unitCode: [
          { required: true, message: '请选择菜品单位', trigger: 'change' }
        ],
        salesPrice: [
          { required: true, message: '请输入菜品价格', trigger: 'blur' }
        ]
      },
      phone: '',

      tableColumns: [
        {title: '菜品', key: 'nameCn', align: 'center'},
        {title: '菜品分类', key: 'catalogName', align: 'center'},
        {title: '价格',
          key: '',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.specification.salesPrice + '/' + params.row.unitName)
            ])
          }},
        {title: '排序', key: 'sort', align: 'center'},
        {title: '总销量', key: 'sales', align: 'center'},
        {title: '库存', key: 'totalStock', align: 'center'},
        {title: '参与打折',
          key: 'enabledDiscount',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.enabledDiscount == 1,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '1', params.row)
                  }
                }
              })
            ])
          }},
        {title: '销售状态',
          key: 'dishesStatus',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.dishesStatus,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '是'),
                  close: () => h('span', '否')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '2', params.row)
                  }
                }
              })
            ])
          }},
        {title: '估清',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                props: {
                  value: params.row.status == 3,
                  size: 'large'
                },
                scopedSlots: {
                  open: () => h('span', '恢复'),
                  close: () => h('span', '估清')
                },
                on: {
                  'on-change': (value) => {
                    this.changeEnable(value, '3', params.row)
                  }
                }
              })
            ])
          }},
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteData(params.row.id)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.editData(params.row.id)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      subShopColumns: [
        {title: '菜品', type: 'selection', align: 'center', width: '150px'},
        {title: '所有门店', key: 'name', align: 'center', width: '350px'}
      ],
      subDishesColumns: [
        {title: '菜品', type: 'selection', align: 'center'},
        {title: '菜品', key: 'nameCn', align: 'center'},
        {title: '价格',
          key: '',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('div', params.row.specification.salesPrice)
            ])
          }}
      ],
      disabled: false,
      // my
      districtList: [],
      addMenuWin: false,
      jySelfUploadList: [],
      gjSelfUploadList: [],
      vipDaySettingVOS: [],
      vipDateSettingVOS: [],
      // 图片
      uploadList: [],
      uploadPic: '',
      defaultList: [],
      selfGoodsInfoBaseVO: [],
      dishesCatalog: '',
      dishesName: '',
      dishes: {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '0',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      },
      catalogList: [],
      unitList: [],
      typeList: [],
      saveOrEdit: '1',
      tagWin: false,
      tagList: [],
      gqNumber: 0,
      addSubWin: false,
      storeList: [],
      businessId: 1,
      physicalStoreId: 0,

      selectStoreListId: [],
      selectStoreListName: '',
      selectStoreListTemp: [],

      selectDishesList: [],

      subShopWin: false,
      subDishesWin: false,
      shopName: ''
    }
  },
  computed: {
    uploadUrl () {
      return this.$config.baseUrl.upload + '/upload/image'
    }
  },
  created () {
    this.search()
    this.initFormatter()
    this.initCatalog()
    this.initUnit()
    this.initType()
    this.initStore()
  },
  methods: {
    // 菜品选择
    dishesSelect (e) {

    },
    // 全部菜品搜索
    allDishesAndMeal () {
      // 查询所有菜品和套餐
      // this.selfModalLoading = true
      // axios.request({
      //   method: 'GET',
      //   url: '/dishes/dishes-meal',
      //   params: {
      //     dishesCatalog: this.dishesCatalog,
      //     dishesName: this.dishesName
      //   },
      // }).then((res) => {
      //   if (res.data.success) {
      //     this.selfModalLoading = false
      //     this.dishesList = res.data.data.list
      //     this.total = res.data.data.total
      //   } else {
      //     this.warning(res.data.message)
      //     this.selfModalLoading = false
      //   }
      // })
    },
    // 打开菜品页面
    showSubDishesWin () {
      this.subDishesWin = true
      this.allDishesAndMeal()
    },
    // 保存菜品
    saveSubDishes () {

    },
    // 保存子店
    saveSubShop () {
      for (let i = 0; i < this.selectStoreListTemp.length; i++) {
        this.selectStoreListId.push(this.selectStoreListTemp[i].id)
        this.selectStoreListName += this.selectStoreListTemp[i].name + ','
      }
      this.selectStoreListName = this.selectStoreListName.substr(0, this.selectStoreListName.length - 1)
      console.log('id=', this.selectStoreListId)
      console.log('name=', this.selectStoreListName)
    },
    // 单选
    storeSelect (e) {
      console.log('单选=', e)
      this.selectStoreListTemp = e
    },
    // 打开子店页面
    showSubShopWin () {
      this.selectStoreListId = []
      this.selectStoreListName = ''
      this.selectStoreListTemp = []
      this.subShopWin = true
    },
    // 同步菜品到子店
    addToSubShop () {
      this.addSubWin = true
    },
    // 查询门店信息
    initStore () {
      axios.request({
        method: 'GET',
        url: '/employees/business/info',
        params: {
          businessId: this.businessId,
          shopName: this.shopName
        }
      }).then((res) => {
        if (res.data.success) {
          this.storeList = res.data.data
          console.log('storeList=', this.storeList)
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询估清菜品
    initGqList () {
      axios.request({
        method: 'GET',
        url: '/dishes/GQ',
        params: {
          physicalStoreId: this.tableParams.physicalStoreId
        }
      }).then((res) => {
        if (res.data.success) {
          this.gqNumber = res.data.data.length
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑保存
    editSaveData () {
      console.log('this.dises=', this.dishes.specificationList)
      if (this.dishes.nameCn == '') {
        this.warning('请填写菜品中文名')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.catalogCode == '') {
        this.warning('请选择菜品分类')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.unitCode == '') {
        this.warning('请选择菜品单位')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 0 && this.dishes.specification.salesPrice == 0) {
        this.warning('请填写菜品价格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList.length == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList[0].salesPrice == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      axios.request({
        method: 'PUT',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success('修改成功')
          this.addMenuWin = false
          this.reload()
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 编辑
    editData (id) {
      this.$refs.tabs.activeKey = 'name1'
      this.saveOrEdit = '2'
      this.dishes = {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '0',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      }
      // 查询by-id
      axios.request({
        method: 'GET',
        url: '/dishes/by-id',
        params: {
          id: id
        }
      }).then((res) => {
        if (res.data.success) {
          res.data.data.enabledDiscount += ''
          res.data.data.enabledSpecifications += ''
          let img = {
            url: this.$config.baseUrl.display + res.data.data.image,
            name: ''
          }
          this.jySelfUploadList.push(img)
          this.dishes = res.data.data
        } else {
          this.warning(res.data.message)
        }
        this.addMenuWin = true
      })
    },
    tagChange (e) {
      this.dishes.dishesTag = e
    },
    searchTag () {
      this.initTags()
    },
    // 查询标签
    initTags () {
      axios.request({
        method: 'GET',
        url: '/dishes/tag',
        params: {
          name: this.groupName
        }
      }).then((res) => {
        if (res.data.success) {
          this.tagList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询菜品下是否有套餐，否则无法删除
    checkDishes (id) {
      axios.request({
        method: 'GET',
        url: '/dishes/check',
        params: {
          id: id
        }
      }).then((res) => {
        if (res.data.success) {
          console.log('res=', res.data.data)
          if (res.data.data) {
            this.warning('菜品下包含套餐，不能删除！')
          } else {
            axios.request({
              method: 'DELETE',
              url: '/dishes/by-id',
              params: {
                id: id
              }
            }).then((res) => {
              if (res.data.success) {
                this.search()
                this.success(res.data.message)
              } else {
                this.warning(res.data.message)
              }
            })
          }
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 删除
    deleteData (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗',
        onOk: () => {
          // 查询菜品下是否有套餐，否则无法删除
          this.checkDishes(id)
        },
        onCancel: () => {
        }
      })
    },
    // 标签
    addTaps () {
      this.tagWin = true
    },
    // tab点击
    tabClick () {
      // 保存
      if (this.saveOrEdit == '1') {
        this.jySelfUploadList = []
        this.dishes = {
          id: 0,
          nameCn: '',
          nameEn: '',
          mnemonicCode: '',
          sort: 0,
          image: '',
          catalogCode: '',
          catalogName: '',
          unitCode: '',
          unitName: '',
          typeCode: '',
          typeName: '',
          makeTime: '',
          enabledSpecifications: '0',
          enabledDiscount: '1',
          boxAmount: 0,
          totalStock: 0,
          dayStock: 0,
          orderRestriction: 0,
          personRestriction: 0,
          sales: 0,
          enabledDineIn: false,
          enabledTakeOut: false,
          dishesTag: '',
          specification: {
            dishesId: 0,
            name: '',
            salesPrice: 0,
            originalPrice: 0,
            costPrice: 0
          },
          specificationList: [{
            dishesId: 0,
            name: '',
            salesPrice: 0,
            originalPrice: 0,
            costPrice: 0
          }],
          additiveList: [{
            dishesId: 0,
            name: '',
            salesPrice: 0,
            costPrice: 0
          }]
        }
      }
      // 编辑
      if (this.saveOrEdit == '2') {

      }
    },
    // 状态改变
    changeEnable (value, type, params) {
      // 参与打折
      if (value && type == '1') {
        params.enabledDiscount = 1
        this.dishes = params
      }
      if (!value && type == '1') {
        params.enabledDiscount = 0
        this.dishes = params
      }
      // 销售状态
      if (value && type == '2') {
        params.dishesStatus = true
        this.dishes = params
      }
      if (!value && type == '2') {
        params.dishesStatus = false
        this.dishes = params
      }
      // 估清
      if (value && type == '3') {
        params.status = 3
        this.dishes = params
      }
      if (!value && type == '3') {
        params.status = 1
        this.dishes = params
      }
      axios.request({
        method: 'PUT',
        url: '/dishes/part',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.search()
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 查询
    search () {
      this.selfModalLoading = true
      axios.request({
        method: 'GET',
        url: '/dishes/list',
        params: this.tableParams
      }).then((res) => {
        if (res.data.success) {
          this.selfModalLoading = false
          this.dishesList = res.data.data.list
          this.total = res.data.data.total
          this.initGqList()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    // 保存并添加
    saveAndAdd () {
      this.jySelfUploadList = []
      this.selfModalLoading = true
      if (this.dishes.nameCn == '') {
        this.warning('请填写菜品中文名')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.catalogCode == '') {
        this.warning('请选择菜品分类')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.unitCode == '') {
        this.warning('请选择菜品单位')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 0 && this.dishes.specification.salesPrice == 0) {
        this.warning('请填写菜品价格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList.length == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList[0].salesPrice == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      axios.request({
        method: 'POST',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.selfModalLoading = false
          this.dishes = {
            id: 0,
            nameCn: '',
            nameEn: '',
            mnemonicCode: '',
            sort: 0,
            image: '',
            catalogCode: '',
            catalogName: '',
            unitCode: '',
            unitName: '',
            typeCode: '',
            typeName: '',
            makeTime: '',
            enabledSpecifications: '0',
            enabledDiscount: '1',
            boxAmount: 0,
            totalStock: 0,
            dayStock: 0,
            orderRestriction: 0,
            personRestriction: 0,
            sales: 0,
            enabledDineIn: false,
            enabledTakeOut: false,
            dishesTag: '',
            specification: {
              dishesId: 0,
              name: '',
              salesPrice: 0,
              originalPrice: 0,
              costPrice: 0
            },
            specificationList: [{
              dishesId: 0,
              name: '',
              salesPrice: 0,
              originalPrice: 0,
              costPrice: 0
            }],
            additiveList: [{
              dishesId: 0,
              name: '',
              salesPrice: 0,
              costPrice: 0
            }]
          }
          this.search()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    // 关闭
    closeWin () {
      this.addMenuWin = false
      this.reload()
    },
    // 保存
    saveData () {
      this.selfModalLoading = true
      if (this.dishes.nameCn == '') {
        this.warning('请填写菜品中文名')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.catalogCode == '') {
        this.warning('请选择菜品分类')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.unitCode == '') {
        this.warning('请选择菜品单位')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 0 && this.dishes.specification.salesPrice == 0) {
        this.warning('请填写菜品价格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList.length == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      if (this.dishes.enabledSpecifications == 1 && this.dishes.specificationList[0].salesPrice == 0) {
        this.warning('请填写菜品规格')
        this.selfModalLoading = false
        return
      }
      console.log('dishes=', this.dishes)
      axios.request({
        method: 'POST',
        url: '/dishes',
        data: this.dishes
      }).then((res) => {
        if (res.data.success) {
          this.success(res.data.message)
          this.selfModalLoading = false
          this.addMenuWin = false
          this.reload()
        } else {
          this.warning(res.data.message)
          this.selfModalLoading = false
        }
      })
    },
    // 查询菜品分类
    initCatalog () {
      axios.request({
        method: 'GET',
        url: '/dishes/catalogs',
        params: {}
      }).then((res) => {
        if (res.data.success) {
          this.catalogList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    initUnit () {
      axios.request({
        method: 'GET',
        url: '/employees/roles',
        params: {
          type: 'cpdw'
        }
      }).then((res) => {
        if (res.data.success) {
          this.unitList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    initType () {
      axios.request({
        method: 'GET',
        url: '/employees/roles',
        params: {
          type: 'cplx'
        }
      }).then((res) => {
        if (res.data.success) {
          this.typeList = res.data.data
        } else {
          this.warning(res.data.message)
        }
      })
    },
    // 分类change
    catalogChange (e) {
      for (let i = 0; i < this.catalogList.length; i++) {
        if (e == this.catalogList[i].code) {
          this.dishes.catalogName = this.catalogList[i].name
        }
      }
    },
    // 单位change
    unitChange (e) {
      for (let i = 0; i < this.unitList.length; i++) {
        if (e == this.unitList[i].code) {
          this.dishes.unitName = this.unitList[i].value
        }
      }
    },
    // 类型change
    typeChange (e) {
      for (let i = 0; i < this.typeList.length; i++) {
        if (e == this.typeList[i].code) {
          this.dishes.typeName = this.typeList[i].value
        }
      }
    },
    // 添加规格
    addSpecification () {
      this.dishes.specificationList.push(
        {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }
      )
    },
    // 删除规格
    deleteSpecification (index) {
      let _this = this
      setTimeout(function () {
        _this.deleteAfterSpecification(index)
      }, 200)
    },
    deleteAfterSpecification (index) {
      this.dishes.specificationList.splice(index, 1)
    },
    // 添加加料
    addAdditive () {
      this.dishes.additiveList.push(
        {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }
      )
    },
    // 删除加料
    deleteAdditive (index) {
      if (index > 0) {
        let _this = this
        setTimeout(function () {
          _this.deleteAfterAdditive(index)
        }, 200)
      } else {
        this.warning('请剩余一条信息（可不填）')
      }
    },
    deleteAfterAdditive (index) {
      this.dishes.additiveList.splice(index, 1)
    },
    success (msg) {
      this.$Message.success(msg)
    },
    warning (msg) {
      this.$Message.warning(msg)
    },
    /** ***************简易图片上传*******************/
    jyHandleBeforeUpload (file) {
      // 创建一个 FileReader 对象
      let reader = new FileReader()
      // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
      // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
      // 读取文件作为 URL 可访问地址
      reader.readAsDataURL(file)
      const _this = this
      reader.onloadend = function (e) {
        file.url = reader.result
        _this.jySelfUploadList = []
        _this.jySelfUploadList.push(file)
      }
    },
    jyHandleSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      file.url = this.$config.baseUrl.display + res.data[0]
      file.name = ''
      this.dishes.image = res.data[0]
    },
    jyHandleRemove (file) {
      this.uploadList.splice(this.uploadList.indexOf(file), 1)
    },
    jyHandleFormatError (file) {
      this.$Notice.warning({ title: '文件格式不正确', desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。' })
    },
    jyHandleMaxSize (file) {
      this.$Notice.warning({ title: '超出文件大小限制', desc: '文件 ' + file.name + ' 太大，不能超过 2M。' })
    },
    jyUploadImg () {
      this.$refs.s_upload.handleClick()
    },
    /** ***************图片上传结束*******************/
    /** ***************高级图片上传*******************/
    handleRemove (file) {
      const fileList = this.$refs.h_upload.fileList
      this.$refs.h_upload.fileList.splice(fileList.indexOf(file), 1)
      const afterList = this.$refs.h_upload.fileList

      let photos = []
      afterList.forEach((file) => {
        photos.push(file.url.replace(this.$config.baseUrl.display, ''))
      })
      this.selfGoodsInfoBaseVO.photos = photos
    },
    handleSuccess (res, file) {
      const fileList = this.$refs.h_upload.fileList
      file.url = this.$config.baseUrl.display + res.data[0]
      file.name = getGuid()

      this.gjSelfUploadList = this.$refs.h_upload.fileList
      let photos = []
      fileList.forEach((file) => {
        photos.push(file.url.replace(this.$config.baseUrl.display, ''))
      })
      this.selfGoodsInfoBaseVO.photos = photos
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '图片格式不正确',
        desc: '图片 ' + file.name + ' 格式不正确，请上传 [jpg | gif | png] 格式的图片'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出图片大小限制',
        desc: '图片 ' + file.name + ' 太大，不能超过 5M'
      })
    },
    handleBeforeUpload () {
      const check = this.gjSelfUploadList.length < 10
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传 10 张图片。'
        })
      }
      return check
    },
    /** ***************图片上传结束*******************/
    // 新增菜品
    addMenu () {
      this.$refs.tabs.activeKey = 'name1'
      this.saveOrEdit = '1'
      this.jySelfUploadList = []
      this.dishes = {
        id: 0,
        nameCn: '',
        nameEn: '',
        mnemonicCode: '',
        sort: 0,
        image: '',
        catalogCode: '',
        catalogName: '',
        unitCode: '',
        unitName: '',
        typeCode: '',
        typeName: '',
        makeTime: '',
        enabledSpecifications: '0',
        enabledDiscount: '1',
        boxAmount: 0,
        totalStock: 0,
        dayStock: 0,
        orderRestriction: 0,
        personRestriction: 0,
        sales: 0,
        enabledDineIn: false,
        enabledTakeOut: false,
        dishesTag: '',
        specification: {
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        },
        specificationList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          originalPrice: 0,
          costPrice: 0
        }],
        additiveList: [{
          dishesId: 0,
          name: '',
          salesPrice: 0,
          costPrice: 0
        }]
      }
      this.addMenuWin = true
    },
    onSelectionChange (selection) {
      this.disabled = selection.length > 0
      this.selection = selection
    },
    onPageChange (val) {
      this.tableParams.pageNum = val
      this.initTable()
    },
    change (status) {

    },
    cancel () {
      this.modal2 = false
      this.modal1 = false
    },
    add () {
      // this.permsMethod()
      this.operator = {}
      this.modal1 = true
    },

    reload: function () {
      this.$bus.$emit('content-reload')
    },
    formatDate (timestramp) {
      return new Date(timestramp).Format('yyyy-MM-dd hh:mm:ss')
    },

    initFormatter () {
      Date.prototype.Format = function (fmt) {
        let o = {
          'M+': this.getMonth() + 1, // 月份
          'd+': this.getDate(), // 日
          'h+': this.getHours(), // 小时
          'm+': this.getMinutes(), // 分
          's+': this.getSeconds(), // 秒
          'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
          'S': this.getMilliseconds() // 毫秒
        }
        if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
        }
        return fmt
      }
    },
    clearDate () {
      this.tableParams.beginTime = ''
      this.tableParams.endTime = ''
    },
    changeDate () {
      if (this.rangeTime.length > 1 && this.rangeTime[0] != '') {
        let beginTime = new Date(this.rangeTime[0]).toJSON()
        beginTime = new Date(+new Date(beginTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        let endTime = new Date(this.rangeTime[1]).toJSON()
        endTime = new Date(+new Date(endTime) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

        this.tableParams.beginTime = beginTime
        this.tableParams.endTime = endTime
      }
    }
  }
}
</script>

<style scoped>
  .admin-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
