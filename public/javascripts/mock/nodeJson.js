// 'use strict'
const fs = require('fs')
const dataURL = 'static/server-db/login.json'
const dataURL2 ='static/server-db/handlerPrice.json' 
const dataURL3 = 'static/server-db/getTableData.json'
const nodeJsonWork = require('../work/nodeJsonWork.js')

module.exports= {
	writeJson: function(param) {
		return new Promise((resolve, reject) => {

			 
			fs.readFile(dataURL,'utf8', (err,data)=> {
				if(err) {throw  err;reject({err:'1',tip: '服务器错误'})}

				// var datas =  data.toString();
			    var   datas = JSON.parse(data);

			    datas.data.push(param);
			    // console.log(datas.data)
			    datas.tatol = datas.data.length;
			    
			    let str = JSON.stringify(datas)
			    fs.writeFile(dataURL,str,(err)=> {
			    if(err) {
					throw err
					reject({err:'1',tip: '注册失败'})
				}else {
					resolve({err: '0',tip: '注册成功'})
				}
			    	
			    })
			   
			})
		})
	},
	deletJson: function(param) {
		return new Promise((resolve, reject) => {
		fs.readFile(dataURL, 'utf8', (err, data)=> {
		if(err) {throw  err;reject({err:'1',tip: '服务器错误'})}
		let datas = JSON.parse(data)
		for(let i in datas.data) {
			if(param.username == datas.data[i].username && param.password ==datas.data[i].password) {
				datas.data[i].splice(i,1)
				datas.tatol = datas.data.length
			}
		}
		var str  = JSON.stringify(datas)
		fs.writeFile(dataURL, str,(err) =>{
			if(err) {
				throw err
				reject({err:'1',tip: '删除错误'})
			}else {
				resolve({err: '0',tip: '删除成功'})
			}
		})

		})
		})

	},
	readJson: function(param) {
	return new  Promise((resolve, reject) => {
			fs.readFile(dataURL, 'utf8', (err,data)=> {
			var	ret
			if(err) {
				throw  err  
				reject({err: '1',tip: '服务器错误'})
			}else {
				let datas = JSON.parse(data)

				for(let i in datas.data) {

				if(param.username == datas.data[i].username ) {

					if(param.password ==datas.data[i].password) {
					
						ret = {err: '0', tip: 'success',username: param.username}
					
						resolve(ret)
						return 
					}
					else {
						ret = {err: '1', tip: '密码不正确'}
						resolve(ret)
						return 
					}
					
				}
			}
			}
			
			if(!ret) {
			ret = {err: '1', tip: '没有此用户'}
			}
			resolve(ret)
		})
			})
		
	
},
changeJson: function(param) {
		return new Promise( (resolve, reject) => {

			fs.readFile(dataURL,'utf8', (err,data)=> {
				if(err) {throw  err;reject({err:'1',tip: '服务器错误'})}

				// var datas =  data.toString();
			    var   datas = JSON.parse(data);
				for(let i in datas.data) {
					if(param.username == datas.data[i].username) {
					datas.data[i].password = param.password
					}
				}
				let str = JSON.stringify(datas)
			    fs.writeFile(dataURL,str,(err)=> {
			    if(err) {
					throw err
					reject({err:'1',tip: '修改失败'})
				}else {
					resolve({err: '0',tip: '修改成功'})
				}
			    	
			    })
			   
			})
	})
		
},
/*
	分页处理,还没验证
*/ 
pagination: function(param) {
	return new Promise( (resolve, reject) => {
		let ret= {err: '0', tip: 'sucess'}
		fs.readFile(dataURL, 'utf8', (err, data)=> {
			if(err){
				ret ={err: '1',tip: 'fail'}
					throw  err
					reject(ret)
			}else {
			let datas = JSON.parse(data)
			ret.tatol = datas.data.length
			ret.data = datas.slice(param.p*param.s,(param.p+1)*(param.s+1))
			resolve(ret)
		}
		
			})
		
	})
		
},
handlerPrice: function(param) {
	return new Promise ((resolve, reject) => {
		fs.readFile(dataURL2,'utf8',(err,data)=> {
			if(err) {
				throw err
				reject({err:'1',tip:'服务器错误'})
			}else {
				let datas = JSON.parse(data)
				let price1= datas.number[String(param.buyNum)];
				let price2 = datas.proType[String(param.proType.value)]
				let price3 = datas.period[String(param.period.value)]
				let price4 =0
				
				if(price1 == null) {
					price1 = 0
				}

				if(price2 == null) {
					price2 = 0
				}
				if(price3 == null) {
					price3 = 0
				}
				if(price4 == null || datas.version=='') {
					price4 = 0
				}else {
					let param4 = param.version.split(',')
					for( let item in param4) {
					price4 += datas.version[String(item)]
				}
				}
				let allPrice = price1 + price2 + price3 + price4

				resolve({err: '0',tip: '成功',data: allPrice})

			}
		})
	})
},
getTableData: function(param) {
	return new Promise( (resolve, reject) => {
		fs.readFile(dataURL3, 'utf8',(err, data) => {
			if(err) {throw err;reject({err:'1',tip: '服务器错误'})}
			let datas = JSON.parse(data)
			// 此处并不做其他处理，统一返回一个数据 
			resolve({err: '0',tip:'返回成功',list: datas.list})
		})
	})
} ,

/*
	处理编辑内容
*/ 

createUserInformation: function(param) {
	return new Promise((resolve, reject) => {

		var username = 'username1'
		let userPath = 'static/server-db/user/'+ username+ '.json'

		var path1 = 'static/server-db/title/'+ username + '.json'

		var path2 = 'static/server-db/classify/'+ username + '.json'

		var path3 = 'static/server-db/imgUrl/'+ username + '.json'

		var path4 = 'static/server-db/editContent/'+ username + '.json'
		var array = [path1, path2, path3,path4]
		var userData = {
				title: path1,
				classify: path2,
				path: path3,
				editContent: path4
			}
		userData = JSON.stringify(userData)
		
	    fs.exists(userPath, (exists) => {
	    	
	    	
	      if(!exists) {
	      	
	        fs.writeFile(userPath,userData,function(err) {
	            if(err) {
	            	throw err
	            	reject({err: '1',tip: '服务器错误'})
	            	return
	            }else {
	            	var date = new Date().getTime()
					var title = JSON.stringify({data:[{title: param.title,id:1,date: date}],num: 1})
					var classify = JSON.stringify({data:[{classify: param.classify,id:1,date: date}],num: 1})
					let path = JSON.stringify({data:[{path: param.path,id: 1,date: date}],num: 1})
					var editContent = JSON.stringify({data:[{editContent: param.textarea,id: 1,date: date}],num: 1})

					var datas = [title,classify,path, editContent]
					
					array.forEach((item,index) => {
						fs.writeFileSync(item,datas[index], (err2) => {
							if(err2) {
								throw err2
								reject({err: '1',tip: '服务器错误'})
								return
							}
								if(index == (array.length -1)){
									resolve({err: '0',tip: '保存成功'})
								}
							
						})	
					})
				  }
	            })
	        }
	      else {
	      		// ---存在情况

						
	      		let params = [param.title, param.classify, param.path, param.textarea]
	      		let name = ['title','classify','path','editContent']
	      		let errDiff2 = false;

	      		// var promise = function() {
	      			array.forEach((item,index)  =>{
	      			fs.readFile(item,'utf8',(err3,data) => {	
		      			if(err3) {
		      				throw err3
		      				errDiff2 =  true
							reject({err: '1',tip: '服务器错误'})
		      			}else {
		      				 var datas =  JSON.parse(data)
		      				 var ob ={} 
		      				 ob[name[index]] = params[index]
		      				 ob.id = 0;
		      				 ob.id = datas.data[datas.data.length -1].id +1
		      				 var date = new Date().getTime()
		      				 ob.date = date
		      				 datas.data.push(ob)
		      				 datas.num = datas.data.length
		      				 datas = JSON.stringify(datas)
		      				 fs.writeFile(item,datas, (err4) =>{
		      				 	if(err4) {
		      				 		throw err4
		      				 		errDiff2 = true
							        reject({err: '1',tip: '保存失败'})
		      				 	}
		      				 	if(index == (array.length-1)) {
		      				 		resolve({err: '0',tip: '保存成功'})
		      				 	}
		      				 })
		      				
		      			}
	      		})	
	        })
	
	   	
      			
  			     		
      }
})
	
})
},
showQianduan: function(data) {
	return new Promise((resolve, reject) => {
		// 这里假设用户为username1
	var username = 'username1'
	var classifyid = data.classify
   fs.readFile('static/server-db/user/'+ username +'.json','utf8',(err, ret) => {
   	if(err) {
   		throw err;
   		reject({err: '1',tip: '服务器错误'})
   	}

   	rets = JSON.parse(ret)
   

   /*
    考虑这个文件功能是直接返回给后端的,又另开了一个模块处理多个文件运算，
    返回最终结果,给这里判断就行了.
   */ 
   var word = nodeJsonWork.onmessage([rets,classifyid])
    word.then((data) => {
    	resolve({err: '0',tip: '成功', data: data})
		
    })
    .catch((res) => {
    	reject({err: '1'})
    })

   	

   	})

   
  

   

   })
}
	

}