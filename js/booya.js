$(document).ready(function() {
    var module = function() {
        var self = this;
        
        self.loadMe();
        self.loadProjects();
    };
    
    module.prototype.loadProjects = function() {
      $.get('https://api.github.com/users/booyanach/repos', function(response) {
      });
    };
    
    module.prototype.loadMe = function() {
      $.get('https://api.github.com/users/booyanach', function(response) {
          var classes = Object.keys(response);
          $.each(classes, function(idx, item) {
             var value = response[item];
             
             $('.loadMe').each(function(i, elm) {
                 var element = $(this);
                     
                 if (element.hasClass(item)) {
                     if (element.hasClass('text')) {
                        element.html(value); 
                     } else if(element.hasClass('image')) {
                         element.css({
                             'background-image': 'url("' + value + '")'
                         })
                     }
                 }
             })
          });
      });
    };
    
    var booya = new module();
});