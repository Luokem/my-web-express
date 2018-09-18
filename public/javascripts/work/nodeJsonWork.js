let rets 
let title
let classify
let path
let textarea
let fs = require('fs')


module.exports = {
onmessage:  function(event) {
   return new Promise((resolve, reject) => {
   rets = event[0]
   let classifyid = event[1]
  var classifys = this.readFile(rets.classify)
  var titles = this.readFile(rets.title)
  var paths = this.readFile(rets.path)
  var textareas  = this.readFile(rets.editContent)
  
  Promise.all([classifys,titles, paths, textareas]).then((data) => {
   classify = data[0]
   title = data[1]
   path = data[2]
   textarea = data[3]
   var classifyArray =  classify.data.map((item) => {
      if(item.classify == classifyid) {
         return item.id
      }
   })
   
      title = title.data.filter((item) => {
        return  classifyArray.indexOf(item.id) !== -1 
   })
   

      path = path.data.filter((item) => {
       return  classifyArray.indexOf(item.id) !== -1
   })
     textarea =textarea.data.filter((item) => {
       return  classifyArray.indexOf(item.id) !== -1
   })

   let datas =  []
    title.forEach((item,index) => {
     datas.push({
      title: item.title,
      path: path[index].path,
      textarea: textarea[index].editContent,
      date: item.date,
      num:classify.num,
      id: item.id
     })
   })
     resolve(datas)
   

  })
  .catch((err)=> {
   reject('error')
  })
   })


},
readFile:  function(path) {
   return new Promise((resolve, reject) => {
      fs.readFile(path,'utf8',(err,ret)=> {
         if(err) {throw err; reject()} 
         else {
             resolve(JSON.parse(ret))
         }
        

      })
   })
 }
}

