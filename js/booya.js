$(document).ready(function() {
    var module = function() {
        var self = this;
        
        self.loadMe();
        self.loadProjects();
        self.drawMe();
    };
    
    module.prototype.loadProjects = function() {
        var self = this;
        
        if(!localStorage.repos) {
            $.get('https://api.github.com/users/booyanach/repos', function(response) {
                localStorage.setItem('repos', JSON.stringify(response));
                self.handleStorage('repos', response);
            });
        } else {
            self.handleStorage('repos', localStorage.repos);
        }
    };
    
    module.prototype.loadMe = function() {
        var self = this;
        
        if (!localStorage.me) {
         $.get('https://api.github.com/users/booyanach', function(response) {
             localStorage.setItem('me', JSON.stringify(response));
             self.handleStorage('me', response);
         });
        } else {
            self.handleStorage('me', localStorage.me);
        }
    };
    
    module.prototype.handleStorage = function(key, value) {
        this[key] = JSON.parse(value);
    };
    
    module.prototype.drawMe = function() {
        var self = this,
            classes = Object.keys(this.me);
        $.each(classes, function(idx, item) {
            var value = self.me[item];
             
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
    };
    
    var booya = new module();
});