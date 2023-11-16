var Logger=(function(){var instance;var lastErrorLogged;function create(){return{logError:logError}}
function logError(error){var currentTime=new Date().getTime();if(typeof lastErrorLogged==='undefined'||(currentTime-lastErrorLogged)>7000){lastErrorLogged=currentTime;try{$.ajax({url:'logFrontendError',type:'POST',data:{error:error.toString()}});}catch(e){console.error(e);}}}
return{getInstance:function(){if(typeof instance==='undefined'){instance=create();}
return instance;}}})();