// pages/list/list.js
const fetch = require("../../utils/fetch")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: {},
    shops: [],
    page: 0,
    limit: 10,
    total: 0,
    hasMore: true,
    key: '',
    keyShops: []
  },

  querySearchKey(option) {
    this.setData({ key: option.detail.value, page: 1 })
    this.getListDataHandle()
  },

  getListDataHandle() {
    const param = {
      _page: this.data.page,
      _limit: this.data.limit
    }

    if (this.data.key) {
      param.q = this.data.key
    }

    let name = 'shops'
    let shops = this.data.shops

    return fetch(`categories/${this.data.category.id}/shops`, param)
      .then(res => {
        shops = shops.concat(res.data)

        if (this.data.key) {
          shops = this.data.keyShops.concat(res.data)
        }

        this.setData({
          shops: shops,
          total: parseInt(res.header['x-total-count']),
          hasMore: this.data.page * this.data.limit < this.data.total ? true : false
        })
        console.log(this.data.page * this.data.limit < this.data.total ? true : false)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    fetch(`categories/${options.id}`).then(res => {
      this.setData({ category: res.data, page: this.data.page + 1 })

      wx.setNavigationBarTitle({
        title: res.data.name
      })

      this.getListDataHandle()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.setData({ page: this.data.page + 1 })
    this.getListDataHandle().then(() => wx.stopPullDownRefresh())
  },

  /* 
    监听用户下拉触底事件
   */
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      shops: [],
      page: 0,
      hasMore: true
    })
    this.getListDataHandle()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})