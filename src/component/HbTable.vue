<template lang="html">
  <div class="vbox flex1" >
    <el-table
      ref="baseTable"
      class="flex1 hbtable"
      :data="datas"
      height="0"
      highlight-current-row
      :row-key="rowKey"
      @row-click="rowClick" 
      @cell-click="cellClick"
      @row-dblclick="rowDblClick"
      @selection-change="selectChange"
      v-loading.body="loading" >
      <el-table-column
        v-if="showCheck==1"
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column
        v-for="c in columns"
        :property="c.property"
        :label="c.label"
        :width="c.width"
        :formatter="c.formatter"
        :fixed="c.fixed"
        :class-name="c.className">
      </el-table-column>
      <el-table-column v-if="option.enable" inline-template label="操作">
          <span>
                <el-button @click="deleteRow(row,$event)" type="danger" :plain="true" size="small" >删除</el-button>
              </span>
      </el-table-column>
    </el-table>
<div v-if="showPage==1" class="page">
    <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, next, jumper" @current-change="curPageChange" :total="total">
    </el-pagination>
</div>
</div>
</template>

<script>
    import request from '../request.js'

    export default {
        data() {
            return {
                datas: [],
                checkedRows: [],
                total: 0,
                page: 1,
                pageSize: 18,
                loading: false
            }
        },
        props: {
            columns: {
                type: Array,
                required: true
            },
            url: {
                type: String,
                required: true
            },
            params: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            rowKey: {
                type: String,
                default: "id"
            },
            rowClick: {
                type: Function,
                default: function() {}
            },
            rowDblClick: {
                type: Function,
                default: function() {}
            },
            cellClick: {
                type: Function,
                default: function() {}
            },
            showPage: {
                type: String,
                default: "1"
            },
            showCheck: {
                type: String,
                default: "0"
            },
            option: {
                type: Object,
                default: function() {
                    return {
                        enable: false,
                        tableName: ''
                    }
                }
            }
        },
        beforeMount: function() {
            var me = this;
            me.loadData();
        },
        methods: {
            loadData: function() {
                var me = this;
                me.loading = true;
                if (me.showPage == 1) {
                    me.params.page = me.page;
                }

                request.get(me.url, me.params).then(function(res) {
                    me.datas = res.data.list;
                    if (me.showPage == 1) {
                        me.total = res.data.totalRow;
                    }
                    me.loading = false;
                });
            },
            curPageChange: function(currentPage) {
                this.page = currentPage;
                this.loadData();
            },
            selectChange: function(selection) {
                this.checkedRows = selection;
            },
            toggleRowSelection: function(rowIds, check, cancelBefore) {
                var me = this;
                var len = me.datas.length;
                for (var i = 0; i < len; i++) {
                    for (var k = 0; k < rowIds.length; k++) {
                        if (me.datas[i][me.rowKey] == rowIds[k]) {
                            me.$refs.baseTable.toggleRowSelection(me.datas[i], check);
                        } else {
                            if (cancelBefore) {
                                me.$refs.baseTable.toggleRowSelection(me.datas[i], false);
                            }
                        }
                    }
                }
            },
            getCheckedRows: function(isOnlyRowId) { //只返回rowid就行
                if (isOnlyRowId) {
                    var array = [];
                    for (var i = 0; i < this.checkedRows.length; i++) {
                        array.push(this.checkedRows[i][this.rowKey]);
                    }
                    return array;
                } else {
                    return this.checkedRows;
                }
            },
            deleteRow: function(row, e) {
                e.stopPropagation();
                var me = this;
                me.$confirm('确认要删除选中行数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    request.post('common/deleteData', {
                        id: row[me.rowKey],
                        tableName: me.option.tableName
                    }).then(function(res) {
                        if (res.data.success) {
                            me.$message({
                                message: "删除成功",
                                type: 'success'
                            });
                            me.loadData();
                        }
                    });
                }).catch(() => {

                })
            }
        }
    }
</script>

<style lang="css">
    .page {
        padding: 10px 10px 20px 10px;
        text-align: right;
    }
    
    .hbtable {
        overflow: auto;
    }
    
    .cellClick {
        color: #007aff !important;
        cursor: pointer;
    }
</style>