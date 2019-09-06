import qs from 'qs'
import { isString, isArray, merge, cloneDeep, last } from 'lodash'
import utils from './index'

/**
 * current pageSize total 是分页参数，不要出现在struct配置中
 *
 * 根据struct配置，获取以下字段
 *   fromSearch
 *     => search // 用于页面加载完成后，设置表单的初始值
 *     => post     // 用于页面加载完成后，请求后台的数据
 *   fromFields
 *     => 将this.props.form.getFieldsValue()返回的值转换成后台接口入参的值
 * @param {Object} config struct配置，配置项如下：
 * {
 *    [fieldName]: {
 *      format: 'RangePicker',
 *      fields: Array<String>,
 *      defaultValue?: Array<[Moment, Moment]>
 *    },
 *    [fieldName]: {
 *      format: 'DatePicker',
 *      field: String,
 *      defaultValue?: Moment,
 *      formatter?: String
 *    },
 *    [fieldName]: {
 *      format: 'InputGroup',
 *      valueFormat?: {
 *        format: 'RangePicker',
 *        fields: Array<String>,
 *        defaultValue?: Array<Moment>
 *      },
 *      key: String,
 *      value: String,
 *      defaultKey?: String
 *    },
 *    [fieldName]: {
 *      format: 'ProductCategoryCascader',
 *      field: String
 *    },
 *    fields?: Array<String> | Array<[Array<String, formatter>]>
 * }
 * defaultValue字段仅在fromSearch方法生效
 *
 * @example
 * const struct = createStruct({
 *   rangeDate: {
 *     format: 'RangePicker',
 *     fields: ['startRange', 'endRange']
 *   },
 *   date: {
 *     format: 'DatePicker',
 *     field: 'startDate',
 *     formatter: undefined // 默认值为undefined
 *   },
 *   compact1: {
 *     format: 'InputGroup',
 *     key: 'searchCode',
 *     value: 'searchCodeValue',
 *     defaultKey: 'compact1'
 *   },
 *   compact2: {
 *     format: 'InputGroup',
 *     key: 'searchCode',
 *     value: 'searchCodeValue',
 *     defaultKey: 'compact1'
 *   },
 *   fields: ['name', ['age', ageValue => ageValue + 1]]
 * })
 * struct.fromSearch('startRange=2018-01-01&endRange=2018-02-02&startDate=2018-03-03&name=divcss3&age=20&searchCode=compact1&searchCodeValue=666')
 * struct.fromFields({
 *   rangeDate: [moment('2018-01-01'), moment('2018-02-02')],
 *   date: moment('2018-03-03'),
 *   name: ' divcss3  ',
 *   age: 20,
 *   searchCode: 'compact1',
 *   searchCodeValue: 666
 * })
 *
 */
export default function struct(config = {}) {
  if (!isArray(config.fields)) {
    config.fields = []
  }
  config.fields.push(...['current', 'pageSize'])
  return {
    /**
     * 根据struct配置解析search字符串
     * @param {String} searchString 从location.search获取的字符串
     * @param {Object} extra search & post 可注册额外的默认值
     * @return {Object} search & post
     */
    fromSearch(searchString, extra = {}) {
      const query = qs.parse(searchString.slice(1))
      let ret = {
        search: {},
        post: {}
      }
      const { search, post } = getExtraData(extra)
      ret.search = search
      ret.post = post

      Object.keys(config).forEach(key => {
        const obj = config[key]

        if (isArray(obj)) {
          const values = utils.getFieldsFromObject(query, obj)
          merge(ret.search, values)
          merge(ret.post, values)
          return
        }

        if (obj.format === 'InputGroup') {
          const value = utils.getFieldsFromObject(query, [obj.key, obj.value])
          const isValid = value[obj.key] && value[obj.value] && value[obj.key] === key
          if (obj.valueFormat && obj.valueFormat.format === 'RangePicker') {
            if (isValid) {
              const values = utils.objToMomentArray(value[obj.value], obj.valueFormat.fields)
              merge(ret.post, value[obj.value])
              ret.search[obj.key] = value[obj.key]
              ret.search[obj.value] = values
              // 防止另外一个InputGroup配置覆盖前面的value
            } else if (!ret.search[obj.value]) {
              ret.search[obj.value] = getDefaultValue(undefined, obj.valueFormat, query)
              merge(ret.post, utils.momentArrayToObj(ret.search[obj.value], obj.valueFormat.fields))
            }
          } else {
            if (isValid) {
              ret.search[obj.key] = key
              ret.search[obj.value] = query[obj.value]
              ret.post[key] = query[obj.value]
            }
          }
          // 设置默认key
          ret.search[obj.key] = ret.search[obj.key] || obj.defaultKey
          ret.search[obj.value] = ret.search[obj.value] || undefined
          return
        }

        if (obj.format === 'RangePicker') {
          const momentArray = utils.objToMomentArray(query, obj.fields)
          // 判断是否需要设置默认值
          ret.search[key] = getDefaultValue(momentArray, obj, query)
          // 如果search中有值，则后台入参为search中的值
          if (momentArray) {
            merge(ret.post, utils.getFieldsFromObject(query, obj.fields))
          } else if (ret.search[key]) {
            merge(ret.post, utils.momentArrayToObj(ret.search[key], obj.fields))
          }
          return
        }

        if (obj.format === 'DatePicker') {
          const momentObj = utils.stringToMoment(query, obj.field, obj.formatter)
          // 判断是否需要设置默认值
          ret.search[key] = getDefaultValue(momentObj, obj, query)
          // 如果search中有值，则后台入参为search中的值
          if (momentObj) {
            merge(ret.post, utils.getFieldsFromObject(query, [obj.field]))
          } else if (ret.search[key]) {
            merge(ret.post, {
              [obj.field]: utils.momentToString(ret.search[key])
            })
          }
          return
        }

        if (obj.format === 'TimePicker') {
          const momentObj = utils.stringToMoment(query, obj.field, 'HH:mm:ss')
          // 判断是否需要设置默认值
          ret.search[key] = getDefaultValue(momentObj, obj, query)
          // 如果search中有值，则后台入参为search中的值
          if (momentObj) {
            merge(ret.post, utils.getFieldsFromObject(query, [obj.field]))
          } else if (ret.search[key]) {
            merge(ret.post, {
              [obj.field]: utils.momentToString(ret.search[key], 'HH:mm:ss')
            })
          }
          return
        }

        if (obj.format === 'ProductCategoryCascader') {
          if (query[key]) {
            const val = query[key].split(',')
            ret.search[key] = {
              value: val
            }
            ret.post[key] = last(val)
          } else {
            ret.search[key] = { value: [] }
            ret.post[key] = undefined
          }
          return
        }

        if (obj.format === 'CityCascader') {
          if (query[key]) {
            const val = query[key].split(',')
            const fields = ['provinceId', 'cityId', 'regionId']
            fields.forEach((item, index) => {
              ret.post[item] = val[index]
            })
            ret.search[key] = val
          } else {
            ret.search[key] = undefined
          }
          return
        }

        if (obj.format === 'OperateTypeCascader') {
          if (query[key]) {
            const val = query[key].split(',')
            const fields = ['stockType', 'operateTypeId']
            fields.forEach((item, index) => {
              ret.post[item] = val[index]
            })
            ret.search[key] = val
          } else {
            ret.search[key] = undefined
          }
          return
        }

        if (obj.format === 'CompanyCascader') {
          if (query[key]) {
            const val = query[key].split(',')
            const fields = ['companyId', 'cityId', 'regionId']
            fields.forEach((item, index) => {
              ret.post[item] = val[index]
            })
            ret.search[key] = val
          }
          return
        }

        if (obj.format === 'CompanyCascaderV2') {
          if (query[key]) {
            const fields = ['companyId', 'provinceId', 'cityId', 'regionId', 'shopId']
            const values = {}
            fields.forEach(item => {
              if ({}.hasOwnProperty.call(query[key], item)) {
                values[item] = query[key][item]
              }
            })
            merge(ret.post, values)
            merge(ret.search, { [key]: values })
          } else {
            ret.search[key] = undefined
          }
        }

        if (obj.format === 'FinanceCost') {
          if (query[key]) {
            const val = query[key].split(',')
            const fields = ['feeFieldId', 'feeItemId']
            val.forEach((item, index) => {
              ret.post[fields[index]] = item
            })
            ret.search[key] = query[key]
          } else {
            ret.search[key] = undefined
          }
          return
        }
      })
      return ret
    },
    /**
     * 根据struct配置解析对象，返回符合接口入参规则的post，和符合search的search
     * @param {Object} mockData 数据对象 ⚠️️️️️️⚠️⚠️只接收从antd form组件获取的数据
     * @param {Object} extra search & post 可注册额外的默认值
     * @return {Object} search & post
     */
    fromFields(mockData = {}, extra = {}) {
      const { search, post } = getExtraData(extra)
      // 去除空字符串
      Object.keys(mockData).forEach(m => {
        if (isString(mockData[m]) && !mockData[m].trim()) {
          delete mockData[m]
        }
      })
      let ret = {
        search,
        post
      }
      Object.keys(config).forEach(key => {
        const obj = config[key]

        // 解析普通字段
        if (isArray(obj)) {
          const values = utils.getFieldsFromObject(mockData, obj)
          merge(ret.post, values)
          merge(ret.search, values)
          return
        }

        if (obj.format === 'InputGroup') {
          const value = utils.getFieldsFromObject(mockData, [obj.key, obj.value])
          const isValid = value[obj.key] && value[obj.value] && value[obj.key] === key
          if (obj.valueFormat && obj.valueFormat.format === 'RangePicker') {
            if (isValid) {
              const values = utils.momentArrayToObj(value[obj.value], obj.valueFormat.fields)
              merge(ret.post, values)
              ret.search[obj.key] = value[obj.key]
              ret.search[obj.value] = values
            }
          } else {
            if (isValid) {
              ret.post[key] = value[obj.value]
              ret.search[obj.key] = value[obj.key]
              ret.search[obj.value] = value[obj.value]
            }
          }
          return
        }

        if (obj.format === 'RangePicker') {
          const values = utils.momentArrayToObj(mockData[key], obj.fields)
          merge(ret.post, values)
          merge(ret.search, values)
          return
        }

        if (obj.format === 'DatePicker') {
          const date = utils.momentToString(mockData[key], obj.formatter)
          ret.post[obj.field] = date
          ret.search[obj.field] = date
        }

        if (obj.format === 'TimePicker') {
          const date = utils.momentToString(mockData[key], 'HH:mm:ss')
          ret.post[obj.field] = date
          ret.search[obj.field] = date
        }

        if (obj.format === 'ProductCategoryCascader') {
          if (mockData[key] && isArray(mockData[key].value)) {
            ret.post[key] = last(mockData[key].value)
            ret.search[key] = mockData[key].value.join(',')
          }
        }

        if (obj.format === 'CityCascader') {
          const fields = ['provinceId', 'cityId', 'regionId']
          let values = {}
          if (!mockData[key]) {
            return
          }
          fields.forEach((item, index) => {
            values[item] = mockData[key][index]
          })
          merge(ret.post, values)
          ret.search[key] = mockData[key].slice(0, 3).join(',')
        }

        if (obj.format === 'OperateTypeCascader') {
          const fields = ['stockType', 'operateTypeId']
          let values = {}
          if (!mockData[key]) {
            return
          }
          fields.forEach((item, index) => {
            values[item] = mockData[key][index]
          })
          merge(ret.post, values)
          ret.search[key] = mockData[key].slice(0, 2).join(',')
        }

        if (obj.format === 'CompanyCascader') {
          const fields = ['companyId', 'cityId', 'regionId']
          let values = {}
          if (!mockData[key]) {
            return
          }
          fields.forEach((item, index) => {
            values[item] = mockData[key][index]
          })
          merge(ret.post, values)
          ret.search[key] = mockData[key].slice(0, 3).join(',')
        }

        if (obj.format === 'CompanyCascaderV2') {
          const fields = ['companyId', 'provinceId', 'cityId', 'regionId', 'shopId']
          let values = {}
          if (!mockData[key]) {
            return
          }
          fields.forEach(item => {
            values[item] = mockData[key][item]
          })
          merge(ret.post, values)
          merge(ret.search, { [key]: values })
        }

        if (obj.format === 'FinanceCost') {
          let values = {}
          if (!mockData[key]) {
            return
          }
          values[key] = mockData[key]
          merge(ret.post, values)
          ret.search[key] = mockData[key]
        }
      })
      return ret
    }
  }
}

// 处理额外的参数，主要是将里面的current字段转成current字段
function getExtraData(extra) {
  let { search = {}, post = {} } = cloneDeep(extra)
  search.current = search.current
  post.current = post.current
  delete post.current
  delete search.current
  delete search.total
  delete post.total
  return {
    search: { ...search },
    post: { ...post }
  }
}

/**
 * 用户在点击搜索或者点击Table组件的分页时候，会在url中添加`current`和`pageSize`字段
 * 则，如果query中包含这两个字段，说明当前页面状态是由用户主动改变的，那么下一次刷新页面后
 * 不会使用默认值，除非用户点击左侧菜单栏重置这两个字段
 * @param {Any} val 初次解析后返回的值
 * @param {Object} obj struct配置信息
 * @param {Object} query qs解析后的对象
 */
function getDefaultValue(val, obj, query) {
  // search中没有值 && struct有设置defaultValue && search中没有分页参数
  if (!val && obj.defaultValue && !query.current && !query.pageSize) {
    val = obj.defaultValue
  }
  return val
}
