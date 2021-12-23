<template>
   <div class="app-container">
     <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
       <el-form-item label="信息标题" prop="informationTitle">
         <el-input
           v-model="queryParams.informationTitle"
           placeholder="请输入信息标题"
           clearable
           size="small"
           @keyup.enter.native="handleQuery"
         />
       </el-form-item>
       <el-form-item label="操作人员" prop="createBy">
         <el-input
           v-model="queryParams.createBy"
           placeholder="请输入操作人员"
           clearable
           size="small"
           @keyup.enter.native="handleQuery"
         />
       </el-form-item>
       <el-form-item label="类型" prop="informationType">
         <el-select v-model="queryParams.informationType" placeholder="信息类型" clearable size="small">
           <el-option
             v-for="dict in dict.type.village_information_type"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
           />
         </el-select>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
         <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
       </el-form-item>
     </el-form>

     <el-row :gutter="10" class="mb8">
       <el-col :span="1.5">
         <el-button
           type="primary"
           plain
           icon="el-icon-plus"
           size="mini"
           @click="handleAdd"
           v-hasPermi="['village:information:add']"
         >新增</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button
           type="success"
           plain
           icon="el-icon-edit"
           size="mini"
           :disabled="single"
           @click="handleUpdate"
           v-hasPermi="['village:information:edit']"
         >修改</el-button>
       </el-col>
       <el-col :span="1.5">
         <el-button
           type="danger"
           plain
           icon="el-icon-delete"
           size="mini"
           :disabled="multiple"
           @click="handleDelete"
           v-hasPermi="['village:information:remove']"
         >删除</el-button>
       </el-col>
       <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
     </el-row>

     <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
       <el-table-column type="selection" width="55" align="center" />
       <el-table-column label="序号" align="center" prop="informationId" width="100" />
       <el-table-column
         label="信息标题"
         align="center"
         prop="informationTitle"
         :show-overflow-tooltip="true"
       />
       <el-table-column label="信息类型" align="center" prop="informationType" width="100">
         <template slot-scope="scope">
           <dict-tag :options="dict.type.village_information_type" :value="scope.row.informationType"/>
         </template>
       </el-table-column>
       <el-table-column label="状态" align="center" prop="status" width="100">
         <template slot-scope="scope">
           <dict-tag :options="dict.type.village_information_status" :value="scope.row.status"/>
         </template>
       </el-table-column>
       <el-table-column label="浏览数" align="center" prop="visitorVolume" width="100" />
       <el-table-column label="创建者" align="center" prop="createBy" width="100" />
       <el-table-column label="创建时间" align="center" prop="createTime" width="100">
         <template slot-scope="scope">
           <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
         </template>
       </el-table-column>
       <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
         <template slot-scope="scope">
           <el-button
             size="mini"
             type="text"
             icon="el-icon-edit"
             @click="handleUpdate(scope.row)"
             v-hasPermi="['village:information:edit']"
           >修改</el-button>
           <el-button
             size="mini"
             type="text"
             icon="el-icon-delete"
             @click="handleDelete(scope.row)"
             v-hasPermi="['village:information:remove']"
           >删除</el-button>
         </template>
       </el-table-column>
     </el-table>

     <pagination
       v-show="total>0"
       :total="total"
       :page.sync="queryParams.pageNum"
       :limit.sync="queryParams.pageSize"
       @pagination="getList"
     />

     <!-- 添加或修改信息对话框 -->
     <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body>
       <el-form ref="form" :model="form" :rules="rules" label-width="80px">
         <el-row>
           <el-col :span="12">
             <el-form-item label="信息标题" prop="informationTitle">
               <el-input v-model="form.informationTitle" placeholder="请输入信息标题" />
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label="信息类型" prop="informationType">
               <el-select v-model="form.informationType" placeholder="请选择">
                 <el-option
                   v-for="dict in dict.type.village_information_type"
                   :key="dict.value"
                   :label="dict.label"
                   :value="dict.value"
                 ></el-option>
               </el-select>
             </el-form-item>
           </el-col>
           <el-col :span="24">
             <el-form-item label="状态">
               <el-radio-group v-model="form.status">
                 <el-radio
                   v-for="dict in dict.type.village_information_status"
                   :key="dict.value"
                   :label="dict.value"
                 >{{dict.label}}</el-radio>
               </el-radio-group>
             </el-form-item>
           </el-col>
           <el-col :span="24">
             <el-form-item label="内容">
               <editor v-model="form.informationContent" :min-height="192"/>
             </el-form-item>
           </el-col>
         </el-row>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitForm">确 定</el-button>
         <el-button @click="cancel">取 消</el-button>
       </div>
     </el-dialog>
   </div>
 </template>

 <script>
 import { listInformation, getInformation, delInformation, addInformation, updateInformation } from "@/api/village/information";

 export default {
   name: "Information",
   dicts: ['village_information_status', 'village_information_type'],
   data() {
     return {
       // 遮罩层
       loading: true,
       // 选中数组
       ids: [],
       // 非单个禁用
       single: true,
       // 非多个禁用
       multiple: true,
       // 显示搜索条件
       showSearch: true,
       // 总条数
       total: 0,
       // 信息表格数据
       informationList: [],
       // 弹出层标题
       title: "",
       // 是否显示弹出层
       open: false,
       // 查询参数
       queryParams: {
         pageNum: 1,
         pageSize: 10,
         informationTitle: undefined,
         createBy: undefined,
         status: undefined
       },
       // 表单参数
       form: {},
       // 表单校验
       rules: {
         informationTitle: [
           { required: true, message: "信息标题不能为空", trigger: "blur" }
         ],
         informationType: [
           { required: true, message: "信息类型不能为空", trigger: "change" }
         ]
       }
     };
   },
   created() {
     this.getList();
   },
   methods: {
     /** 查询信息列表 */
     getList() {
       this.loading = true;
       listInformation(this.queryParams).then(response => {
         this.informationList = response.rows;
         this.total = response.total;
         this.loading = false;
       });
     },
     // 取消按钮
     cancel() {
       this.open = false;
       this.reset();
     },
     // 表单重置
     reset() {
       this.form = {
         informationId: undefined,
         informationTitle: undefined,
         informationType: undefined,
         informationContent: undefined,
         visitorVolume: undefined,
         status: "0"
       };
       this.resetForm("form");
     },
     /** 搜索按钮操作 */
     handleQuery() {
       this.queryParams.pageNum = 1;
       this.getList();
     },
     /** 重置按钮操作 */
     resetQuery() {
       this.resetForm("queryForm");
       this.handleQuery();
     },
     // 多选框选中数据
     handleSelectionChange(selection) {
       this.ids = selection.map(item => item.informationId)
       this.single = selection.length!=1
       this.multiple = !selection.length
     },
     /** 新增按钮操作 */
     handleAdd() {
       this.reset();
       this.open = true;
       this.title = "添加信息";
     },
     /** 修改按钮操作 */
     handleUpdate(row) {
       this.reset();
       const informationId = row.informationId || this.ids
       getInformation(informationId).then(response => {
         this.form = response.data;
         this.open = true;
         this.title = "修改信息";
       });
     },
     /** 提交按钮 */
     submitForm: function() {
       this.$refs["form"].validate(valid => {
         if (valid) {
           if (this.form.informationId != undefined) {
             updateInformation(this.form).then(response => {
               this.$modal.msgSuccess("修改成功");
               this.open = false;
               this.getList();
             });
           } else {
             addInformation(this.form).then(response => {
               this.$modal.msgSuccess("新增成功");
               this.open = false;
               this.getList();
             });
           }
         }
       });
     },
     /** 删除按钮操作 */
     handleDelete(row) {
       const informationIds = row.informationId || this.ids
       this.$modal.confirm('是否确认删除信息编号为"' + informationIds + '"的数据项？').then(function() {
         return delInformation(informationIds);
       }).then(() => {
         this.getList();
         this.$modal.msgSuccess("删除成功");
       }).catch(() => {});
     }
   }
 };
 </script>