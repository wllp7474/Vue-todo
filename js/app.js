const vm = new Vue({
	el: '.todoapp',
	// 数据
	data: {
		list: [], //整个表单 
		something: {  //单一事件
			content: '',
			isChecked: false
		},
		currentIndex: '',//选中的index
		selectAll: '',  //全选按钮的状态
		setHash: '#/'
	},

	created() {
		//监听window的hash值
		window.addEventListener('hashchange', this.getHash);

		//刷新时list数据去获取本地存储
		this.list=JSON.parse(window.localStorage.getItem("todolist") || "[]")

	},
	//方法
	methods: {
		//添加操作：将单一事件something增加到表单
		add() {
			if (this.something != '') {
				this.list.push(this.something); //添加
				this.something = {             //清空
					content: '',
					isChecked: false
				}
			}
		},
		//全选
		changeAll(event) {
			console.log(this.selectAll)
			this.list.forEach(item => {
				item.isChecked = this.selectAll;
			});
		},
		//判断双击的是哪一条数据,将该数据的index赋值给currentIndex
		current(index) {
			this.currentIndex = index
		},
		//失焦事件，失去焦点时改变currentIndex从而达到去除输入框样式的目的
		blur() {
			this.currentIndex = ''
		},
		// 单个删除事件
		remove(index) {
			this.list.splice(index, 1)
		},
		//得到当前的Hash值
		getHash() {
			this.setHash = window.location.hash;
		},
		//清楚所有选中的表单项目，也就是过滤掉勾选的返回未勾选的
		clearCompletend() {
			this.list = this.list.filter(item => {
				return item.isChecked === false
			})
			console.log(this.list)
		},
		//存储数据到本地
		setLocalStorage() {
window.localStorage.setItem("todolist",JSON.stringify(this.list))
		},

	},
	//自定义属性
	directives: {
		focus(el, bindings) {
			if (bindings.value) {
				el.focus()
			}
		}
	},
	//计算属性
	computed: {
		// 计算已经完成的综合
		total() {
			return this.list.reduce((total, item) => {
				if (item.isChecked === true) {
					total++
				}
				return total
			}, 0)
		},
		//创建一个实时的表单，根据功能键进行过滤改变
		currentList() {
			if (this.setHash === '#/') {
				return this.list
			} else if (this.setHash === '#/active') {
				return this.list.filter(item => { return item.isChecked === false })
			} else if (this.setHash === '#/completed') {
				return this.list.filter(item => { return item.isChecked === true })
			} else {
				return this.list
			}
		}
	},
	// 监听属性
	watch:{
		//对list表单进行监听，list变化都会将全新的数据存储到本地
		list:{
			handler(){
				this.setLocalStorage()
			},
			deep:true
		}
	}

})
