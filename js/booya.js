$(document).ready(function() {
    var module = function() {
        var self = this;
        
        self.loadPage();
        self.draw();
    };
    
    module.prototype.loadPage = function() {
        var self = this;
        
        if(!localStorage.repos) {
            $.get('https://api.github.com/users/booyanach/repos', function(response) {
                localStorage.setItem('repos', JSON.stringify(response));
                self.handleStorage('repos', response);
            });
        } else {
            self.handleStorage('repos', localStorage.repos);
        }
        
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
    
    module.prototype.draw = function() {
        var self = this,
            classes = Object.keys(self.me);
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
                        });
                    }
                }
            })
        });
        
         $.each(self.repos, function(index, project) {
             console.log(project);
            var container = $('<div class="project"/>').on('click', function() {
                var win = window.open(project.html_url, '_blank');
                win.focus();
            }),
                name = $('<div class="name"/>').html(project.name).appendTo(container),
                language = $('<div class="language"/>').html(project.language);
            
            container.appendTo($('.projects'));
        });
    };
    
    var booya = new module();
});