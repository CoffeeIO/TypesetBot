var TypeOtter = {};

TypeOtter.submodule2 = (function(obj){
    // another module stuff that can even reference MODULE
  obj.func = function () {
    return ' world';
  }

    return obj;
})(TypeOtter.submodule2 || {});
TypeOtter.submodule = (function(obj){
    // another module stuff that can even reference MODULE
  obj.func = function () {
    return 'hello';
  }

    return obj;
})(TypeOtter.submodule || {});


TypeOtter = (function(obj, $) {


  obj.main = function () {
      console.log(obj.submodule.func() + obj.submodule2.func());
  };

return obj;
}(TypeOtter || {}));

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TypeOtter;
}
