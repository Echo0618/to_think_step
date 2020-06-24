function deepclone (target) {
    let result
    if (typeof target === 'object') {
        if (Array.isArray(target)) {
            result = []
            for (let item in target) {
                result.push(deepclone(target[item]))
            }
        } else if (target === null || target.constructor === RegExp) {
            result = target
        } else {
            result = {}
            for (let item in target) {
                result[item] = deepclone(target[item])
            }
        }
    } else {
        result = target
    }
    return result
}
var obj = {
    a:1,
    b:[1,2,{
        aa:11,
        bb:function(){console.log('this is obj.b.bb')},
        undefined
    }],
    c: / /,
    d:function(){console.log('this is obj.d')},
    e:{
        name:'echo',
        hobby:['coding','play','eat'],
        reg: / /,
        baba: null,
        undefined
    },
    undefined
}
var obj2 = deepclone(obj)
obj.b[2].aa = 22
obj.b[2].bb = / /
obj.c = /e+ /g
obj.e.hobby = [1,2,3]
obj.e.baba = '牛B'
console.log(obj,obj2)