var AuditLogger=(function(){var instance;function create(){return{previewRoadmap:function(){save('preview_roadmap');}}}
function save(type,data){$.ajax({url:'saveAuditLog',type:'POST',data:{type:type,data:data,_csrfToken:_csrfToken}});}
return{getInstance:function(){if(!instance){instance=create();}
return instance;}}}());