
all: ../static/mmgt/js/templates.js ../static/mmgt/js/views.js

clean:
	rm -f ../static/mmgt/js/templates.js
	rm -f ../static/mmgt/js/views.js

../static/mmgt/js/templates.js: templates/*.hbs
	handlebars -f $@ -e hbs $^

../static/mmgt/js/views.js: views/*.js
	cat $^ > $@

