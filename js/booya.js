$(document).ready(function() {
    var module = function() {
        var self = this;
        
        self.loadPage();
        self.draw();
    };
    
    module.prototype.loadPage = function() {
        var self = this,
            now = new Date().getTime();
        if (!localStorage.date || localStorage.date && localStorage.date < now) {
            delete localStorage.repos;
            delete localStorage.me;
            delete localStorage.date;
            localStorage.setItem('date', now);
        }
        
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
        this[key] = typeof value === 'string' ? JSON.parse(value) : value;
    };
    
    module.prototype.draw = function() {
        var self = this;
        
        self.watch('me', function(id, oldval, newval) {
            var classes = Object.keys(newval);
            $.each(classes, function(idx, item) {
                var value = newval[item];
                 
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
        });
        
        self.watch('repos', function(id, oldval, newval) {
             $.each(newval, function(index, project) {
                 console.log(project);
                var container = $('<div class="project"/>').on('click', function() {
                    var win = window.open(project.html_url, '_blank');
                    win.focus();
                }),
                    name = $('<div class="name"/>').html(project.name).appendTo(container),
                    language = $('<div class="language"/>').html(project.language);
                
                container.appendTo($('.projects'));
            });
        });
    };
    
    var booya = new module();
});

/******************* POLYFILL ***************************/
// As per https://gist.github.com/eligrey/384583
/********************************************************/
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;
			
			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}
 
// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}